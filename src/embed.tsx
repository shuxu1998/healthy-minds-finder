import { version } from '../package.json';
import { destroy, isMounted, mount } from './mount';

// Entry for dist/widget.js (classic IIFE loaded from Squarespace Footer Code Injection).
//
// Navigation strategy: the host is a direct child of <body>. One MutationObserver watches
// only the direct children of <html> and <body> (no subtree), so it fires when the host is
// removed or <body> is replaced, and remounts. popstate/pageshow re-check the optional
// data-pages allow-list. pushState navigations that do not touch <body>'s children are not
// detected; that only matters when data-pages is used.

export interface HmpFinderApi {
  version: string;
  mount: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    hmpFinder?: HmpFinderApi;
  }
}

const script = document.currentScript as HTMLScriptElement | null;
const allowedPages = (script?.dataset.pages ?? '*')
  .split(',')
  .map((p) => normalizePath(p.trim()))
  .filter(Boolean);

function normalizePath(path: string): string {
  return path === '*' ? path : path.replace(/\/+$/, '') || '/';
}

function pageAllowed(): boolean {
  return allowedPages.includes('*') || allowedPages.includes(normalizePath(location.pathname));
}

let observer: MutationObserver | null = null;
let observedBody: HTMLElement | null = null;

function sync() {
  if (!pageAllowed()) destroy();
  else if (!isMounted()) mount({ demoMode: false });
}

function observeBody() {
  if (!observer || document.body === observedBody) return;
  observedBody = document.body;
  observer.observe(observedBody, { childList: true });
}

function onMutation() {
  observeBody();
  sync();
}

function start() {
  if (observer) return;
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', start, { once: true });
    return;
  }
  observer = new MutationObserver(onMutation);
  observer.observe(document.documentElement, { childList: true });
  observeBody();
  window.addEventListener('popstate', sync);
  window.addEventListener('pageshow', sync);
  sync();
}

function stop() {
  document.removeEventListener('DOMContentLoaded', start);
  window.removeEventListener('popstate', sync);
  window.removeEventListener('pageshow', sync);
  observer?.disconnect();
  observer = null;
  observedBody = null;
  destroy();
}

// If the script runs again (duplicate tag or re-injection), the newest copy replaces the old one.
window.hmpFinder?.destroy();
window.hmpFinder = { version, mount: start, destroy: stop };
start();
