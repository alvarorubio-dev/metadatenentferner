import { Lock, Shield, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TrustBadges() {
  const { t } = useTranslation();

  const badges = [
    {
      icon: Lock,
      title: t('trustBadges.clientSide.title'),
      description: t('trustBadges.clientSide.description'),
    },
    {
      icon: Shield,
      title: t('trustBadges.noUpload.title'),
      description: t('trustBadges.noUpload.description'),
    },
    {
      icon: Zap,
      title: t('trustBadges.swissPrivacy.title'),
      description: t('trustBadges.swissPrivacy.description'),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <badge.icon className="w-8 h-8 text-red-800" strokeWidth={2} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{badge.title}</h3>
            <p className="text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
