import { Brain, Flower2, Hand, MoonStar, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const techniques = [
  {
    id: 'grounding',
    title: '5-4-3-2-1 grounding',
    icon: Flower2,
    description: 'Use your senses to reconnect to the present moment.',
    steps: [
      'Name 5 things you can see around you.',
      'Touch 4 different textures near you.',
      'Notice 3 sounds, near or far.',
      'Name 2 smells, or remember two comforting scents.',
      'Take 1 sip of water and notice the taste.',
    ],
  },
  {
    id: 'panic-reset',
    title: 'Panic reset',
    icon: ShieldAlert,
    description: 'A short reset when your body feels overwhelmed.',
    steps: [
      'Place one hand on your chest and one on your stomach.',
      'Press your feet gently into the floor for 10 seconds.',
      'Say to yourself: “I am here, I am safe right now.”',
      'Take three slow exhales, longer than your inhales.',
    ],
  },
  {
    id: 'flashback',
    title: 'Flashback interruption',
    icon: Brain,
    description: 'Simple cues to remind your mind this moment is new.',
    steps: [
      'Look around and name today’s date and your current location.',
      'Describe one object in detail: color, shape, texture.',
      'Touch a cool surface or hold something with weight.',
      'Repeat: “This is a memory, not what is happening now.”',
    ],
  },
  {
    id: 'muscle-release',
    title: 'Muscle release',
    icon: Hand,
    description: 'Release body tension one area at a time.',
    steps: [
      'Tighten your shoulders for 5 seconds, then release.',
      'Clench your fists for 5 seconds, then open your hands.',
      'Squeeze your legs gently, then let them soften.',
      'Drop your jaw and let your breath move naturally.',
    ],
  },
  {
    id: 'night-support',
    title: 'Night anxiety support',
    icon: MoonStar,
    description: 'Calming steps when sleep feels difficult.',
    steps: [
      'Dim your screen and lights if possible.',
      'Wrap in a blanket or hold something comforting.',
      'Count your exhales from 1 to 10, then restart.',
      'Tell yourself one kind phrase: “My body can rest now.”',
    ],
  },
];

const PtsdCopingAccordion = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Coping Techniques</CardTitle>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible className="w-full" defaultValue="grounding">
        {techniques.map((technique) => {
          const Icon = technique.icon;
          return (
            <AccordionItem key={technique.id} value={technique.id}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {technique.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{technique.description}</p>
                <ul className="list-disc pl-4 text-sm space-y-1 text-foreground">
                  {technique.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </CardContent>
  </Card>
);

export default PtsdCopingAccordion;
