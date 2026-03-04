import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, HandHeart, Gift, Plus, HeartPulse } from 'lucide-react';
import GoogleTranslate from './GoogleTranslate';
import { useLanguage } from '@/context/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isArabic } = useLanguage();

  const navItems = [
    { path: '/', label: isArabic ? 'الملاجئ' : 'Shelters', icon: Home },
    { path: '/help', label: isArabic ? 'طلبات المساعدة' : 'Help Needed', icon: HandHeart },
    { path: '/donations', label: isArabic ? 'التبرعات' : 'Donations', icon: Gift },
    { path: '/trauma-support', label: isArabic ? 'الدعم النفسي' : 'Mental Support', icon: HeartPulse },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="emergency-header text-primary-foreground px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <GoogleTranslate />
          <span className="text-2xl shrink-0">🇱🇧</span>
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-tight">{isArabic ? 'طوارئ لبنان' : 'Lebanon Emergency'}</h1>
            <p className="text-xs opacity-80">{isArabic ? 'منصة إغاثة عامة' : 'Public Relief Platform'}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-full p-2.5 backdrop-blur-sm"
          aria-label={isArabic ? 'إضافة عنصر جديد' : 'Add new entry'}
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors flex-1 ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
