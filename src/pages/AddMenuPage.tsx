import { useNavigate } from 'react-router-dom';
import { Home, HandHeart, Gift, ArrowLeft, Pencil } from 'lucide-react';

const AddMenuPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: Home,
      emoji: '🏠',
      title: 'Add a Shelter',
      description: 'Register a shelter location for displaced people',
      path: '/add/shelter',
    },
    {
      icon: Pencil,
      emoji: '✏️',
      title: 'Edit My Shelters',
      description: 'Manage and update the shelters you added',
      path: '/my-shelters',
    },
    {
      icon: HandHeart,
      emoji: '🤝',
      title: 'Request Help',
      description: 'Post a request for assistance',
      path: '/add/help',
    },
    {
      icon: Gift,
      emoji: '💝',
      title: 'Share a Donation',
      description: 'Offer donations or resources to those in need',
      path: '/add/donation',
    },
  ];

  return (
    <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="text-xl font-bold text-foreground">How can you help?</h2>
      <p className="text-sm text-muted-foreground">Choose what you'd like to contribute</p>

      <div className="space-y-3 pt-2">
        {options.map((opt) => (
          <button
            key={opt.path}
            onClick={() => navigate(opt.path)}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-md transition-all text-left"
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div>
              <h3 className="font-bold text-card-foreground">{opt.title}</h3>
              <p className="text-sm text-muted-foreground">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AddMenuPage;
