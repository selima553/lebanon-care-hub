import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const childTools = [
  {
    title: { en: 'Balloon breathing', ar: 'تنفس البالون' },
    text: {
      en: 'Pretend your belly is a balloon. Breathe in to fill it up, then breathe out slowly to make it small again.',
      ar: 'تخيّل أن بطنك بالون. خذ شهيقًا ليمتلئ، ثم ازفر ببطء ليصغر من جديد.',
    },
  },
  {
    title: { en: 'Safe place imagination', ar: 'تخيّل مكان آمن' },
    text: {
      en: 'Close your eyes and picture a place where you feel calm. Notice what you see, hear, and feel there.',
      ar: 'أغمض عينيك وتخيّل مكانًا تشعر فيه بالهدوء. انتبه لما تراه وتسمعه وتشعر به هناك.',
    },
  },
  {
    title: { en: 'Counting game', ar: 'لعبة العد' },
    text: {
      en: 'Pick a color, then count 10 things of that color around you. Go slowly and say each one out loud.',
      ar: 'اختر لونًا ثم عدّ ١٠ أشياء بهذا اللون حولك. امشِ ببطء وقل كل شيء بصوت مسموع.',
    },
  },
];

const ChildAnxietySupport = () => {
  const { isArabic } = useLanguage();
  const [showParentTips, setShowParentTips] = useState(false);
  const language = isArabic ? 'ar' : 'en';

  return (
    <Card className="bg-secondary/40">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base">{isArabic ? 'دعم قلق الأطفال' : 'Child Anxiety Support'}</CardTitle>
        <p className="text-sm text-muted-foreground">{isArabic ? 'أنشطة لطيفة يمكن للأطفال تجربتها مع وجود شخص بالغ قريب.' : 'Gentle activities children can try with an adult nearby.'}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {childTools.map((item) => (
            <div key={item.title.en} className="rounded-lg border bg-card p-3">
              <h4 className="font-medium text-sm">{item.title[language]}</h4>
              <p className="text-sm text-muted-foreground mt-1">{item.text[language]}</p>
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
          {showParentTips ? (isArabic ? 'إخفاء نصائح للأهل' : 'Hide Parent Tips') : (isArabic ? 'عرض نصائح للأهل' : 'Show Parent Tips')}
        </Button>

        {showParentTips && (
          <div id="parent-tips" className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
            {isArabic
              ? 'حافظ على نبرة صوت هادئة وبطيئة. قدّم خيارات قصيرة مثل: «هل تريد الجلوس أم تمسك يدي؟» وذكّر الطفل أن مشاعره طبيعية ومقبولة.'
              : 'Keep your voice slow and soft. Offer short choices like “Would you like to sit or hold my hand?” and remind them their feelings are okay.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildAnxietySupport;
