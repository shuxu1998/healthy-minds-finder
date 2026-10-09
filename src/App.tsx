import { useReducer, useRef, useState } from 'react';
import { FinderPanel, PANEL_ID } from './components/FinderPanel';
import { Launcher } from './components/Launcher';
import { flowReducer, initialFlowState } from './logic/flow';

export interface AppProps {
  /** Demo mode shows draft therapist records and the TEST DEMO banner. */
  demoMode: boolean;
}

export function App({ demoMode }: AppProps) {
  const [open, setOpen] = useState(false);
  // Answers persist while the panel is closed; only "Start again" clears them.
  const [state, dispatch] = useReducer(flowReducer, initialFlowState);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  return (
    <>
      <Launcher ref={launcherRef} expanded={open} controlsId={PANEL_ID} onOpen={() => setOpen(true)} />
      <FinderPanel open={open} demoMode={demoMode} state={state} dispatch={dispatch} onClose={handleClose} />
    </>
  );
}
