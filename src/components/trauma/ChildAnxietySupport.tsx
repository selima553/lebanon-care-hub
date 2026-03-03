import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const childTools = [
  {
    title: 'Balloon breathing',
    text: 'Pretend your belly is a balloon. Breathe in to fill it up, then breathe out slowly to make it small again.',
  },
  {
    title: 'Safe place imagination',
    text: 'Close your eyes and picture a place where you feel calm. Notice what you see, hear, and feel there.',
  },
  {
    title: 'Counting game',
    text: 'Pick a color, then count 10 things of that color around you. Go slowly and say each one out loud.',
  },
];

const ChildAnxietySupport = () => {
  const [showParentTips, setShowParentTips] = useState(false);

  return (
    <Card className="bg-secondary/40">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base">Child Anxiety Support</CardTitle>
        <p className="text-sm text-muted-foreground">Gentle activities children can try with an adult nearby.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {childTools.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-3">
              <h4 className="font-medium text-sm">{item.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowParentTips((value) => !value)}
          aria-expanded={showParentTips}
          aria-controls="parent-tips"
        >
          {showParentTips ? 'Hide Parent Tips' : 'Show Parent Tips'}
        </Button>

        {showParentTips && (
          <div id="parent-tips" className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
            Keep your voice slow and soft. Offer short choices like “Would you like to sit or hold my hand?” and remind them their feelings are okay.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildAnxietySupport;
