"use client";
import { Trophy, BadgeCheck, Star, type LucideIcon } from "lucide-react";

interface Badge {
  icon: LucideIcon;
  label: string;
  value: string;
  ariaLabel?: string;
}

interface TrustBadgesProps {
  badges?: Badge[];
}

const DEFAULT_BADGES: Badge[] = [
  {
    icon: Trophy,
    label: "30+ Years",
    value: "Trusted Since 1996",
    ariaLabel: "28 plus years in business"
  },
  {
    icon: BadgeCheck,
    label: "10,000+",
    value: "TVs Repaired",
    ariaLabel: "10 thousand plus TVs repaired"
  },
  {
    icon: Star,
    label: "4.3★",
    value: "Google Rating",
    ariaLabel: "4 point 8 stars on Google with over 850 reviews"
  }
];

function BadgeItem({ badge }: { badge: Badge }) {
  const Icon = badge.icon;
  const ariaDescription = badge.ariaLabel || `${badge.label} - ${badge.value}`;

  return (
    <div
      role="listitem"
      className="flex items-center gap-4 bg-gradient-to-br from-blue-accent/10 to-blue-accent/5 dark:from-blue-accent/20 dark:to-blue-accent/10 border-2 border-blue-accent/30 dark:border-blue-accent/40 rounded-xl px-6 py-4 backdrop-blur-sm hover:border-blue-accent/60 hover:from-blue-accent/15 hover:to-blue-accent/10 dark:hover:from-blue-accent/30 dark:hover:to-blue-accent/15 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-blue-accent/15 dark:hover:shadow-blue-accent/30"
      aria-label={ariaDescription}
    >
      <div className="w-10 h-10 bg-blue-accent/15 dark:bg-blue-accent/25 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-accent dark:text-blue-300" aria-hidden="true" />
      </div>
      <div>
        <p className="text-base font-extrabold text-blue-accent dark:text-blue-300">{badge.label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{badge.value}</p>
      </div>
    </div>
  );
}

export default function TrustBadges({ badges = DEFAULT_BADGES }: TrustBadgesProps) {
  return (
    <div role="list" className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
      {badges.map((badge, index) => (
        <BadgeItem key={index} badge={badge} />
      ))}
    </div>
  );
}
