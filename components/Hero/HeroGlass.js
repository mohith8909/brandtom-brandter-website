'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion, whenIntroDone } from '../Motion/gsap';

/*
 * Water behind the hero headline.
 *
 * The hero's coral / blue / magenta lights sit under a sheet of water. The cursor (or a
 * finger) drags a wake through it and a click drops a stone in; now and then a stray
 * drop lands on its own so the surface never looks frozen.
 *
 * It is a real wave simulation, not a drawn effect: a small height field on the GPU
 * where every point is pulled towards its neighbours, so waves spread, interfere,
 * bounce off the edges and die out like water. The picture is then rendered from that
 * surface: the lights refract through it (with a slight rainbow split), caustics
 * brighten where the waves focus light, and the crests catch a sharp highlight.
 *
 * Runs only while the hero is on screen and the tab is visible; not at all for visitors
 * with reduced motion, or on devices without float render targets. They keep the CSS
 * glow underneath.
 */

const MAX_DROPS = 8;
const STEP = 1 / 120;          // simulation steps per second: fixed, so waves move at the same speed everywhere

const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// One step of the wave equation. r = height, g = velocity.
const SIM = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uAspect;
uniform vec4 uDrops[${MAX_DROPS}];   // x, y (0..1), radius (in screen heights), strength
uniform int uDropCount;
out vec4 o;
void main(){
    vec2 uv = gl_FragCoord.xy * uTexel;
    vec4 s = texture(uState, uv);
    float avg = (
        texture(uState, uv - vec2(uTexel.x, 0.0)).r +
        texture(uState, uv + vec2(uTexel.x, 0.0)).r +
        texture(uState, uv - vec2(0.0, uTexel.y)).r +
        texture(uState, uv + vec2(0.0, uTexel.y)).r) * 0.25;
    s.g += (avg - s.r) * 2.0;
    s.g *= 0.993;            // waves lose energy as they travel
    s.r += s.g;
    s.r *= 0.999;            // and the surface slowly settles flat
    for (int i = 0; i < ${MAX_DROPS}; i++){
        if (i >= uDropCount) break;
        vec4 d = uDrops[i];
        float l = length((uv - d.xy) * vec2(uAspect, 1.0)) / d.z;
        float k = max(0.0, 1.0 - l);
        s.r -= (0.5 - cos(k * 3.14159265) * 0.5) * d.w;   // smooth dimple
    }
    o = s;
}`;

const RENDER = `#version 300 es
precision highp float;
uniform sampler2D uState;
uniform vec2 uSimTexel;
uniform vec2 uRes;
uniform float uT;
uniform float uFade;
out vec4 o;

float blob(vec2 p, vec2 c, float r){ vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }

// What lies under the water: ink with drifting brand lights
vec3 scene(vec2 uv, vec2 asp){
    vec2 p = uv * asp;
    float t = uT * 0.12;
    vec3 col = vec3(0.039, 0.039, 0.059);
    col += vec3(1.0, 0.2, 0.145) * 0.36 * blob(p, vec2(0.82 * asp.x + 0.06 * sin(t * 1.3), 0.92 + 0.05 * cos(t)), 0.42);
    col += vec3(0.0, 0.64, 0.92) * 0.36 * blob(p, vec2(0.12 * asp.x + 0.05 * cos(t * 0.9), 0.08 + 0.06 * sin(t * 1.1)), 0.45);
    col += vec3(0.68, 0.165, 0.45) * 0.22 * blob(p, vec2(0.6 * asp.x + 0.12 * sin(t * 0.7), 0.42 + 0.1 * cos(t * 0.8)), 0.36);
    col += vec3(0.56, 0.84, 0.23) * 0.14 * blob(p, vec2(0.95 * asp.x, 0.12 + 0.04 * sin(t * 1.4)), 0.22);
    return col;
}

void main(){
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);

    float h  = texture(uState, uv).r;
    float hl = texture(uState, uv - vec2(uSimTexel.x, 0.0)).r;
    float hr = texture(uState, uv + vec2(uSimTexel.x, 0.0)).r;
    float hd = texture(uState, uv - vec2(0.0, uSimTexel.y)).r;
    float hu = texture(uState, uv + vec2(0.0, uSimTexel.y)).r;

    // Surface normal from the height field
    vec3 n = normalize(vec3(hl - hr, hd - hu, 0.025));

    // Refraction: the lights below bend through the surface, red bending least
    vec2 off = n.xy * 0.05 / asp;
    vec3 col = vec3(
        scene(uv + off * 0.94, asp).r,
        scene(uv + off, asp).g,
        scene(uv + off * 1.07, asp).b);

    // Caustics: where the surface curves like a lens, light gathers
    float lap = hl + hr + hd + hu - 4.0 * h;
    float caustic = clamp(lap * 230.0, -0.45, 1.6);
    col *= 1.0 + caustic;
    col += vec3(0.9, 0.95, 1.0) * max(caustic, 0.0) * 0.025;

    // Light catching the water: one sharp sun glint and a soft sheen
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L = normalize(vec3(-0.25, 0.35, 0.9));
    vec3 R = reflect(-L, n);
    float glint = pow(max(dot(R, V), 0.0), 160.0);
    float sheen = pow(max(dot(R, V), 0.0), 18.0);
    float tilt = 1.0 - n.z;                                    // only where there is a wave
    col += vec3(1.0) * glint * smoothstep(0.0, 0.02, tilt) * 0.9;
    col += vec3(0.75, 0.85, 1.0) * sheen * smoothstep(0.0, 0.08, tilt) * 0.12;

    // Fresnel: steeper wave faces reflect a little of the (slightly blue) sky
    float fres = pow(1.0 - max(n.z, 0.0), 3.0);
    col += vec3(0.25, 0.32, 0.45) * fres * 0.6;

    // Vignette, as the CSS glow had
    col *= mix(1.0, 0.5, smoothstep(0.45, 1.15, length((uv - 0.5) * asp)));

    vec3 ink = vec3(0.039, 0.039, 0.059);
    o = vec4(mix(ink, col, uFade), 1.0);
}`;

function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
    return s;
}

function program(gl, frag) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, 'p');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link failed');
    return p;
}

export default function HeroGlass({ className }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (prefersReducedMotion()) return undefined;
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' });
        // The simulation needs to render into half-float textures
        if (!gl || !(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))) return undefined;

        let simProg, renderProg;
        try {
            simProg = program(gl, SIM);
            renderProg = program(gl, RENDER);
        } catch {
            return undefined; // the CSS glow stays
        }

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        const su = (n) => gl.getUniformLocation(simProg, n);
        const ru = (n) => gl.getUniformLocation(renderProg, n);
        const S = { state: su('uState'), texel: su('uTexel'), aspect: su('uAspect'), drops: su('uDrops'), count: su('uDropCount') };
        const R = { state: ru('uState'), simTexel: ru('uSimTexel'), res: ru('uRes'), t: ru('uT'), fade: ru('uFade') };

        // Two height-field textures, ping-ponged each step
        let sim = null;
        const makeTarget = (w, h) => {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            const fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return { tex, fb, ok };
        };
        const freeSim = () => {
            if (!sim) return;
            sim.targets.forEach((t) => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); });
            sim = null;
        };

        // The water keeps a fixed number of cells across, whatever the screen size,
        // so ripples look the same size everywhere
        const resize = () => {
            const W = canvas.clientWidth || 1, H = canvas.clientHeight || 1;
            const scale = Math.min(window.devicePixelRatio || 1, 2) * (W < 700 ? 0.55 : 0.6);
            canvas.width = Math.max(2, Math.round(W * scale));
            canvas.height = Math.max(2, Math.round(H * scale));
            const simW = W < 700 ? 200 : 320;
            const simH = Math.max(2, Math.round(simW * (H / W)));
            if (!sim || sim.w !== simW || sim.h !== simH) {
                freeSim();
                const targets = [makeTarget(simW, simH), makeTarget(simW, simH)];
                sim = { w: simW, h: simH, targets, cur: 0, ok: targets.every((t) => t.ok) };
            }
        };
        resize();
        if (!sim.ok) { freeSim(); gl.deleteProgram(simProg); gl.deleteProgram(renderProg); gl.deleteBuffer(buf); return undefined; }
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        // Drops waiting to be added on the next step (cursor wake, clicks, stray drops)
        const pending = [];
        const drop = (x, y, radius, strength) => { if (pending.length < 64) pending.push([x, y, radius, strength]); };

        let last = null;
        const toLocal = (e) => {
            const r = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - r.left) / r.width,
                y: 1 - (e.clientY - r.top) / r.height,
                inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom,
                aspect: r.width / r.height,
            };
        };
        const onMove = (e) => {
            const p = toLocal(e);
            if (!p.inside) { last = null; return; }
            if (last) {
                // lay drops along the path so a fast swipe leaves an unbroken wake
                const dx = (p.x - last.x) * p.aspect, dy = p.y - last.y;
                const dist = Math.hypot(dx, dy);
                const n = Math.min(6, Math.ceil(dist / 0.012));
                const strength = Math.min(0.03, 0.006 + dist * 0.15);
                for (let i = 1; i <= n; i++) {
                    drop(last.x + (p.x - last.x) * (i / n), last.y + (p.y - last.y) * (i / n), 0.022, strength / Math.sqrt(n));
                }
            }
            last = p;
        };
        const onDown = (e) => {
            const p = toLocal(e);
            if (p.inside) drop(p.x, p.y, 0.045, 0.16);
        };
        const onLeave = () => { last = null; };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerdown', onDown, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);

        const dropData = new Float32Array(MAX_DROPS * 4);
        const step = () => {
            const t = sim.targets;
            const src = t[sim.cur], dst = t[1 - sim.cur];
            gl.useProgram(simProg);
            gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
            gl.viewport(0, 0, sim.w, sim.h);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.tex);
            gl.uniform1i(S.state, 0);
            gl.uniform2f(S.texel, 1 / sim.w, 1 / sim.h);
            gl.uniform1f(S.aspect, sim.w / sim.h);
            const count = Math.min(MAX_DROPS, pending.length);
            pending.splice(0, count).forEach((d, i) => dropData.set(d, i * 4));
            gl.uniform4fv(S.drops, dropData);
            gl.uniform1i(S.count, count);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            sim.cur = 1 - sim.cur;
        };

        let time = 0, fade = 0, acc = 0, nextStray = 1.5;
        const render = () => {
            gl.useProgram(renderProg);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, sim.targets[sim.cur].tex);
            gl.uniform1i(R.state, 0);
            gl.uniform2f(R.simTexel, 1 / sim.w, 1 / sim.h);
            gl.uniform2f(R.res, canvas.width, canvas.height);
            gl.uniform1f(R.t, time);
            gl.uniform1f(R.fade, fade);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        // Only animate while the hero is visible
        let onScreen = true, raf = 0, prev = 0, introDone = false, lost = false, stopped = false;
        const frame = (now) => {
            raf = 0;
            if (stopped || lost) return;
            const dt = Math.max(0, Math.min((now - prev) / 1000, 0.05));
            prev = now;
            time += dt;
            fade = Math.min(1, fade + dt / 1.4);

            // a stray drop now and then, so the water is alive even with no cursor (phones)
            nextStray -= dt;
            if (nextStray <= 0) {
                drop(0.1 + Math.random() * 0.8, 0.1 + Math.random() * 0.8, 0.018 + Math.random() * 0.014, 0.025 + Math.random() * 0.03);
                nextStray = 2.2 + Math.random() * 2.8;
            }

            acc += dt;
            let steps = 0;
            while (acc >= STEP && steps < 6) { step(); acc -= STEP; steps++; }
            if (steps === 6) acc = 0;
            render();
            if (fade > 0.02) canvas.style.opacity = '1';
            if (onScreen && document.visibilityState === 'visible') raf = requestAnimationFrame(frame);
        };
        // (re)start the loop after a pause
        function wake() {
            if (raf || stopped || lost || !introDone || !onScreen || document.visibilityState !== 'visible') return;
            prev = performance.now();
            raf = requestAnimationFrame(frame);
        }
        // declared after frame/wake: whenIntroDone may call back straight away
        const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; wake(); });
        io.observe(canvas);
        const cancelIntro = whenIntroDone(() => { introDone = true; wake(); });
        const onVis = () => wake();
        document.addEventListener('visibilitychange', onVis);

        // GPU reset (driver update, too many tabs): hide the canvas, the CSS glow shows again
        const onLost = (e) => { e.preventDefault(); lost = true; canvas.style.opacity = '0'; };
        canvas.addEventListener('webglcontextlost', onLost);

        return () => {
            stopped = true;
            cancelAnimationFrame(raf);
            cancelIntro();
            io.disconnect();
            ro.disconnect();
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerdown', onDown);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('visibilitychange', onVis);
            canvas.removeEventListener('webglcontextlost', onLost);
            if (!lost) {
                freeSim();
                gl.deleteBuffer(buf);
                gl.deleteProgram(simProg);
                gl.deleteProgram(renderProg);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
