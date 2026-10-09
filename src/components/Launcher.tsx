import type { Ref } from 'react';
import { content } from '../config/content';

interface LauncherProps {
  ref: Ref<HTMLButtonElement>;
  expanded: boolean;
  controlsId: string;
  onOpen: () => void;
}

export function Launcher({ ref, expanded, controlsId, onOpen }: LauncherProps) {
  return (
    <button
      ref={ref}
      type="button"
      className="hmp-btn hmp-btn--primary hmp-launcher"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onOpen}
    >
      {content.launcher.label}
    </button>
  );
}
