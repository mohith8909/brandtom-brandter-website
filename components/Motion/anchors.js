'use client';

/*
 * Scrolling to a section by id (#about, #digital-marketing, ...), used by every kind of
 * navigation: links within a page, links from another page, and opening a URL with a hash.
 *
 * Most sections are found with getElementById. Sections that live inside a horizontally
 * pinned row (the Services cards) can't be reached that way, because their real position
 * depends on how far the row has slid; their component registers its own scroll function
 * with registerAnchor().
 */

const custom = new Map();

export function registerAnchor(id, fn) {
    custom.set(id, fn);
    return () => { if (custom.get(id) === fn) custom.delete(id); };
}

// Mark the section a link pointed at for a few seconds, so it can be highlighted
// (CSS :target can't do this: the site changes the address without reloading)
let markTimer = 0;
const mark = (el) => {
    document.querySelectorAll('[data-targeted]').forEach((n) => n.removeAttribute('data-targeted'));
    clearTimeout(markTimer);
    el.setAttribute('data-targeted', '');
    markTimer = setTimeout(() => el.removeAttribute('data-targeted'), 2800);
};

export function scrollToAnchor(id, { immediate = false } = {}) {
    if (!id) return null;
    const el = document.getElementById(id);
    if (!el) return null;
    const lenis = window.__lenis;
    lenis?.resize(); // the page may just have grown (pinned sections); update the scroll limit
    const fn = custom.get(id);
    if (fn) fn({ immediate });
    else if (lenis) lenis.scrollTo(el, { immediate, force: true, duration: 1.4, offset: -parseFloat(getComputedStyle(el).scrollMarginTop || 0) });
    else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
    mark(el);
    return el;
}

// Move keyboard / screen reader focus to a section or heading without scrolling to it.
// An element hidden by its entrance animation can't take focus, and loses focus if an
// animation hides it again a moment later. So for a couple of seconds keep putting
// focus back whenever it has dropped to the page body, then settle for the page heading
// if the element never took it.
let focusTimer = 0;
export function focusWithoutScroll(el) {
    clearTimeout(focusTimer);
    if (!el) return;
    const tryFocus = (target) => {
        if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        return document.activeElement === target;
    };
    let tries = 0, held = false;
    const attempt = () => {
        const active = document.activeElement;
        // the visitor has moved focus somewhere themselves: leave it there
        if (tries > 0 && active && active !== document.body && active !== el) return;
        if (active !== el) held = tryFocus(el) || held;
        if (++tries < 10) { focusTimer = setTimeout(attempt, 300); return; }
        if (document.activeElement === el) return;
        if (held) { if (document.activeElement === document.body) tryFocus(el); return; }
        if (document.activeElement && document.activeElement !== document.body) return;
        // never took focus (e.g. the hero heading is faded out when the page is scrolled):
        // the page heading, else the main content area, which is always visible
        const h1 = document.querySelector('main h1');
        if (!(h1 && h1 !== el && tryFocus(h1))) {
            const main = document.querySelector('main');
            if (main && main !== el) tryFocus(main);
        }
    };
    attempt();
}

export { serviceHref } from '../site';
