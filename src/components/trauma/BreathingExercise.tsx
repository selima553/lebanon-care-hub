import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BREATHING_MODES = {
  '4-4-6': [
    { key: 'inhale', label: 'Inhale slowly', duration: 4 },
    { key: 'hold', label: 'Hold', duration: 4 },
    { key: 'exhale', label: 'Exhale gently', duration: 6 },
  ],
  box: [
    { key: 'inhale', label: 'Inhale slowly', duration: 4 },
    { key: 'hold-in', label: 'Hold', duration: 4 },
    { key: 'exhale', label: 'Exhale gently', duration: 4 },
    { key: 'hold-out', label: 'Hold', duration: 4 },
  ],
} as const;

type Mode = keyof typeof BREATHING_MODES;

const BreathingExercise = () => {
  const [mode, setMode] = useState<Mode>('4-4-6');
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(BREATHING_MODES['4-4-6'][0].duration);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const phases = useMemo(() => BREATHING_MODES[mode], [mode]);
  const activePhase = phases[phaseIndex];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(media.matches);

    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    setIsRunning(false);
    setPhaseIndex(0);
    setRemaining(phases[0].duration);
  }, [mode, phases]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const tick = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) {
          return current - 1;
        }

        setPhaseIndex((prev) => {
          const next = (prev + 1) % phases.length;
          setRemaining(phases[next].duration);
          return next;
        });

        return 0;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [isRunning, phases]);


  const phaseProgress = ((activePhase.duration - remaining) / activePhase.duration) * 100;
  const circleScale = activePhase.key.startsWith('inhale')
    ? 1 + phaseProgress / 180
    : activePhase.key.startsWith('exhale')
      ? 1.25 - phaseProgress / 200
      : 1.12;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle className="text-base">Breathing Exercise</CardTitle>
        <div className="flex gap-2" role="group" aria-label="Breathing modes">
          <Button
            size="sm"
            variant={mode === '4-4-6' ? 'default' : 'outline'}
            onClick={() => setMode('4-4-6')}
          >
            4-4-6 Breathing
          </Button>
          <Button
            size="sm"
            variant={mode === 'box' ? 'default' : 'outline'}
            onClick={() => setMode('box')}
          >
            Box Breathing
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div
            aria-live="polite"
            className="h-36 w-36 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-center px-3 transition-transform"
            style={{
              transform: `scale(${prefersReducedMotion ? 1 : circleScale})`,
              transitionDuration: prefersReducedMotion ? '0ms' : '1000ms',
            }}
          >
            <span className="text-sm font-medium text-foreground">{activePhase.label}</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground" aria-live="polite">
          {remaining}s • {activePhase.label}
        </p>

        <div className="flex gap-2 justify-center">
          <Button onClick={() => setIsRunning((v) => !v)} aria-label={isRunning ? 'Stop breathing timer' : 'Start breathing timer'}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
