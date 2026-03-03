import { lazy, Suspense } from 'react';
import BreathingExercise from '@/components/trauma/BreathingExercise';
import PtsdCopingAccordion from '@/components/trauma/PtsdCopingAccordion';
import ChildAnxietySupport from '@/components/trauma/ChildAnxietySupport';
import { Card, CardContent } from '@/components/ui/card';

const AudioCalmingGuides = lazy(() => import('@/components/trauma/AudioCalmingGuides'));

const TraumaSupportPage = () => {
  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
      <header className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Trauma Support</h2>
        <p className="text-sm text-muted-foreground">Take a moment to breathe and reset.</p>
      </header>

      <BreathingExercise />
      <PtsdCopingAccordion />

      <Suspense
        fallback={
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">Loading calming audio guides...</CardContent>
          </Card>
        }
      >
        <AudioCalmingGuides />
      </Suspense>

      <ChildAnxietySupport />
    </div>
  );
};

export default TraumaSupportPage;
