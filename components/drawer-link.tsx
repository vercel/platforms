import React from 'react';
import Link from 'next/link';

interface DrawerLinkProps {
  name: string;
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const DrawerLink: React.FC<DrawerLinkProps> = ({ name, href, isActive, icon }) => (
  <Link
    key={name}
    href={href}
    className={`flex items-center space-x-3 ${
      isActive
        ? "bg-brand-gray400/20 text-brand-gray700 dark:bg-brand-gray700"
        : ""
    } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-brand-gray300 active:bg-brand-gray400/20 dark:text-white dark:hover:bg-brand-gray700 dark:active:bg-brand-gray800`}
  >
    {icon}
    <span className="text-sm font-medium">{name}</span>
  </Link>
);

export default DrawerLink;
