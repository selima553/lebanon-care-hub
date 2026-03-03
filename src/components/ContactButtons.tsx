import { Phone, MessageCircle } from 'lucide-react';

interface ContactButtonsProps {
  phone: string;
}

const ContactButtons = ({ phone }: ContactButtonsProps) => {
  const cleanPhone = phone.replace(/\s/g, '');

  return (
    <div className="flex gap-2">
      <a
        href={`tel:${cleanPhone}`}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Phone className="w-3.5 h-3.5" />
        Call
      </a>
      <a
        href={`https://wa.me/${cleanPhone.replace('+', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[hsl(142,71%,40%)] text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        WhatsApp
      </a>
    </div>
  );
};

export default ContactButtons;
