'use client';

/*
 * "Liquid Glass" intro, drawn from the real logo artwork (no reconstruction):
 *
 *  0.3 – 2.0s  the head blooms out from its centre as flowing liquid glass,
 *              refracting with rainbow edges and a bright liquid front
 *  1.6 – 3.0s  the liquid flows on into the wordmark, left to right
 *  1.8 – 3.4s  everything settles; glossy glass highlights catch the light and
 *              one sheen sweeps across the logo
 *  3.4 – 4.0s  highlights fade so the final frame is the exact, crisp logo
 *
 * Plain WebGL2 (one fragment shader), so it is tiny compared with a 3D library.
 * The logo is drawn at lockupRect(), the same place the Preloader positions things.
 */

export const DURATION = 4.2;
export const LOGO_SRC = '/assets/cropped-Brandtom.-Logo.svgtransparent.png';
const LOGO_W = 1188, LOGO_H = 378;

export const lockupRect = (W, H) => {
    const L = Math.min(W * (W < 600 ? 0.9 : 0.72), 900);
    const h = (L * LOGO_H) / LOGO_W;
    return { left: (W - L) / 2, top: (H - h) / 2, width: L, height: h };
};

const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uLogo;
uniform vec2 uRes;      // canvas size, CSS px
uniform vec4 uRect;     // logo rect: left, top, width, height (CSS px)
uniform float uDpr;
uniform float uT;       // seconds
out vec4 outColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
    vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

vec4 logo(vec2 uv){
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
    return texture(uLogo, uv);
}

void main(){
    vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;  // CSS px, top-left origin
    vec2 sp = px / uRes;
    float aspect = uRect.z / uRect.w;                                        // ~3.14 for this logo

    // Stage: deep ink, two soft brand-colour glows, vignette to the overlay colour at the edges
    vec2 c = (sp - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec3 bg = mix(vec3(0.075, 0.072, 0.092), vec3(0.0196), smoothstep(0.0, 0.95, length(c)));
    float glowIn = smoothstep(0.2, 1.6, uT);
    bg += vec3(1.0, 0.2, 0.15) * 0.07 * glowIn * smoothstep(0.7, 0.0, length(c - vec2(-0.42, -0.22)));
    bg += vec3(0.0, 0.64, 0.92) * 0.07 * glowIn * smoothstep(0.7, 0.0, length(c - vec2(0.42, 0.24)));

    vec2 uv = (px - uRect.xy) / uRect.zw;

    // Liquid motion: strong at first, calm by ~3.2s
    float amp = pow(1.0 - smoothstep(0.3, 3.2, uT), 1.6);
    vec2 q = uv * vec2(aspect, 1.0);
    vec2 flow = vec2(fbm(q * 3.0 + vec2(uT * 0.7, 0.0)), fbm(q * 3.0 + vec2(5.2, -uT * 0.6))) - 0.5;
    vec2 off = flow * vec2(0.09 / aspect, 0.09) * amp;

    // Reveal front: blooms from the head's centre, then flows across the wordmark
    vec2 headC = vec2(0.172, 0.505);
    float pr = uv.x < 0.29
        ? length((uv - headC) * vec2(aspect, 1.0)) * 1.15
        : 0.72 + (uv.x - 0.29) * 2.3;
    pr += (fbm(q * 3.0 + uT * 1.1) - 0.5) * 0.18 * amp;
    float front = mix(-0.15, 2.6, smoothstep(0.3, 3.0, uT));
    float reveal = smoothstep(front, front - 0.2, pr);
    float meniscus = exp(-pow((pr - front + 0.05) / 0.06, 2.0));

    // Chromatic split while the glass is still "liquid"
    vec2 ca = vec2(0.0045 / aspect * 3.0, 0.0) * amp;
    vec4 cR = logo(uv + off + ca), cG = logo(uv + off), cB = logo(uv + off - ca);
    vec3 rgb = vec3(cR.r, cG.g, cB.b);
    float a = max(cG.a, max(cR.a, cB.a));

    // Glass relief from the logo's own edges: highlights along every shape
    vec2 e = vec2(2.5) / uRect.zw;
    float dx = logo(uv + off + vec2(e.x, 0)).a - logo(uv + off - vec2(e.x, 0)).a;
    float dy = logo(uv + off + vec2(0, e.y)).a - logo(uv + off - vec2(0, e.y)).a;
    vec3 n = normalize(vec3(-dx, dy, 0.55));
    vec3 L = normalize(vec3(-0.5, 0.65, 0.6));
    float spec = pow(max(dot(reflect(-L, n), vec3(0, 0, 1)), 0.0), 18.0);
    float glass = 1.0 - smoothstep(3.0, 3.9, uT);

    // One sheen sweeping across the logo
    float sweep = mix(-1.2, aspect + 1.6, smoothstep(1.7, 3.4, uT));
    float sheen = exp(-pow((uv.x * aspect + (uv.y - 0.5) * 0.9) - sweep, 2.0) * 10.0) * 0.28 * glass;

    // Liquid interior is slightly lighter and translucent until it settles
    float settle = smoothstep(0.8, 3.0, uT);
    vec3 body = mix(rgb * 1.08 + 0.06, rgb, settle);
    float bodyA = a * reveal * mix(0.82, 1.0, settle);

    vec3 col = mix(bg, body, bodyA);
    col += (rgb * 0.9 + 0.12) * meniscus * a * 0.55 * (1.0 - settle * 0.6);
    col += vec3(1.0) * spec * glass * a * reveal * 0.75;
    col += vec3(1.0) * sheen * a * reveal;
    outColor = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
    return s;
}

/**
 * Plays the intro into `canvas`. Returns { skip, dispose } once the logo texture
 * is ready. Throws if WebGL2 is unavailable, so the caller can fall back.
 */
export async function playLiquidLogo(canvas, { onComplete, onTick } = {}) {
    const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) throw new Error('WebGL2 unavailable');

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link failed');
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // The real logo, mipmapped so it stays crisp when drawn smaller than the source
    // onload rather than img.decode(): decode() may be postponed by the browser (e.g. in
    // background tabs), which would stall the intro
    const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error('logo failed to load'));
        i.src = LOGO_SRC;
    });
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u('uRes'), uRect = u('uRect'), uDpr = u('uDpr'), uT = u('uT');
    gl.uniform1i(u('uLogo'), 0);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
        const W = canvas.clientWidth || window.innerWidth;
        const H = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        const r = lockupRect(W, H);
        gl.uniform2f(uRes, W, H);
        gl.uniform4f(uRect, r.left, r.top, r.width, r.height);
        gl.uniform1f(uDpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0, disposed = false, finished = false;
    const start = performance.now();
    const frame = () => {
        if (disposed) return;
        const t = Math.min((performance.now() - start) / 1000, DURATION);
        gl.uniform1f(uT, t);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        onTick?.(t);
        if (t >= DURATION) {
            if (!finished) { finished = true; onComplete?.(); }
            return; // hold the final, exact logo frame
        }
        raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return {
        skip() {
            if (finished) return;
            finished = true;
            onComplete?.({ skipped: true });
        },
        dispose() {
            if (disposed) return;
            disposed = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            gl.deleteTexture(tex);
            gl.deleteBuffer(buf);
            gl.deleteProgram(prog);
        },
    };
}
