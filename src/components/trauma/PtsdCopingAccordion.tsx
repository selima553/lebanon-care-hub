import { Brain, Flower2, Hand, MoonStar, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';

const techniques = [
  {
    id: 'grounding',
    icon: Flower2,
    title: { en: '5-4-3-2-1 grounding', ar: 'تقنية ٥-٤-٣-٢-١ للثبات' },
    description: {
      en: 'Use your senses to reconnect to the present moment.',
      ar: 'استخدم حواسك للعودة إلى اللحظة الحالية.',
    },
    steps: {
      en: [
        'Name 5 things you can see around you.',
        'Touch 4 different textures near you.',
        'Notice 3 sounds, near or far.',
        'Name 2 smells, or remember two comforting scents.',
        'Take 1 sip of water and notice the taste.',
      ],
      ar: [
        'اذكر ٥ أشياء تراها حولك.',
        'المس ٤ ملمسات مختلفة بالقرب منك.',
        'انتبه إلى ٣ أصوات قريبة أو بعيدة.',
        'اذكر رائحتين أو تذكّر رائحتين مريحتين.',
        'خذ رشفة ماء واحدة وركّز على الطعم.',
      ],
    },
  },
  {
    id: 'panic-reset',
    icon: ShieldAlert,
    title: { en: 'Panic reset', ar: 'تهدئة سريعة لنوبة الهلع' },
    description: {
      en: 'A short reset when your body feels overwhelmed.',
      ar: 'خطوات قصيرة عندما تشعر أن جسدك مُرهق.',
    },
    steps: {
      en: [
        'Place one hand on your chest and one on your stomach.',
        'Press your feet gently into the floor for 10 seconds.',
        'Say to yourself: “I am here, I am safe right now.”',
        'Take three slow exhales, longer than your inhales.',
      ],
      ar: [
        'ضع يدًا على صدرك ويدًا على بطنك.',
        'اضغط قدميك بلطف على الأرض لمدة ١٠ ثوانٍ.',
        'قل لنفسك: «أنا هنا، وأنا بأمان الآن».',
        'خذ ثلاث زفرات بطيئة أطول من الشهيق.',
      ],
    },
  },
  {
    id: 'flashback',
    icon: Brain,
    title: { en: 'Flashback interruption', ar: 'إيقاف الاسترجاع المؤلم' },
    description: {
      en: 'Simple cues to remind your mind this moment is new.',
      ar: 'إشارات بسيطة لتذكير عقلك أن هذه لحظة جديدة.',
    },
    steps: {
      en: [
        'Look around and name today’s date and your current location.',
        'Describe one object in detail: color, shape, texture.',
        'Touch a cool surface or hold something with weight.',
        'Repeat: “This is a memory, not what is happening now.”',
      ],
      ar: [
        'انظر حولك واذكر تاريخ اليوم ومكانك الحالي.',
        'صف شيئًا واحدًا بالتفصيل: اللون، الشكل، الملمس.',
        'المس سطحًا باردًا أو أمسك شيئًا له وزن.',
        'كرّر: «هذه ذكرى، وليست ما يحدث الآن».',
      ],
    },
  },
  {
    id: 'muscle-release',
    icon: Hand,
    title: { en: 'Muscle release', ar: 'إرخاء العضلات' },
    description: {
      en: 'Release body tension one area at a time.',
      ar: 'خفّف توتر الجسم منطقةً بعد منطقة.',
    },
    steps: {
      en: [
        'Tighten your shoulders for 5 seconds, then release.',
        'Clench your fists for 5 seconds, then open your hands.',
        'Squeeze your legs gently, then let them soften.',
        'Drop your jaw and let your breath move naturally.',
      ],
      ar: [
        'شدّ كتفيك لمدة ٥ ثوانٍ ثم اتركهما.',
        'اقبض يديك لمدة ٥ ثوانٍ ثم افتحهما.',
        'شدّ ساقيك بلطف ثم أرخِهما.',
        'أرخِ الفك واترك النفس يتحرك بشكل طبيعي.',
      ],
    },
  },
  {
    id: 'night-support',
    icon: MoonStar,
    title: { en: 'Night anxiety support', ar: 'دعم القلق الليلي' },
    description: {
      en: 'Calming steps when sleep feels difficult.',
      ar: 'خطوات مهدئة عندما يصبح النوم صعبًا.',
    },
    steps: {
      en: [
        'Dim your screen and lights if possible.',
        'Wrap in a blanket or hold something comforting.',
        'Count your exhales from 1 to 10, then restart.',
        'Tell yourself one kind phrase: “My body can rest now.”',
      ],
      ar: [
        'خفف إضاءة الشاشة والأنوار إن أمكن.',
        'تغطَّ ببطانية أو أمسك شيئًا يمنحك الراحة.',
        'عدّ الزفرات من ١ إلى ١٠ ثم أعد من البداية.',
        'قل لنفسك عبارة لطيفة: «يمكن لجسدي أن يرتاح الآن».',
      ],
    },
  },
];

const PtsdCopingAccordion = () => {
  const { isArabic } = useLanguage();
  const language = isArabic ? 'ar' : 'en';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isArabic ? 'تقنيات التهدئة' : 'Coping Techniques'}</CardTitle>
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
                    {technique.title[language]}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{technique.description[language]}</p>
                  <ul className="list-disc pl-4 text-sm space-y-1 text-foreground">
                    {technique.steps[language].map((step) => (
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
};

export default PtsdCopingAccordion;
