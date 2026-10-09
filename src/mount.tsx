import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import themeCss from './styles/theme.css?inline';
import componentCss from './styles/component.css?inline';

export const HOST_ID = 'hmp-finder-host';

export interface MountOptions {
  demoMode?: boolean;
}

export interface FinderInstance {
  host: HTMLElement;
  destroy: () => void;
}

let current: FinderInstance | null = null;

export function isMounted(): boolean {
  return current !== null && current.host.isConnected;
}

/**
 * Mounts the finder into its own Shadow DOM host appended to <body>.
 * Idempotent: returns the existing instance while its host is still in the document.
 */
export function mount(options: MountOptions = {}): FinderInstance {
  if (current && current.host.isConnected) return current;

  // A host that was detached by the site, or left behind by an older copy of the script.
  current?.destroy();
  document.getElementById(HOST_ID)?.remove();

  const host = document.createElement('div');
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `${themeCss}\n${componentCss}`;
  const container = document.createElement('div');
  container.className = 'hmp-root';
  shadow.append(style, container);
  document.body.append(host);

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App demoMode={options.demoMode ?? false} />
    </StrictMode>,
  );

  const instance: FinderInstance = {
    host,
    destroy() {
      root.unmount();
      host.remove();
      if (current === instance) current = null;
    },
  };
  current = instance;
  return instance;
}

export function destroy(): void {
  current?.destroy();
}
