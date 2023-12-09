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
        ? "bg-gray-300 text-gray-700 dark:bg-gray-850"
        : ""
    } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-gray-200 active:bg-gray-400/20 dark:text-white dark:hover:bg-gray-850 dark:active:bg-gray-850`}
  >
    {icon}
    <span className="text-sm font-medium">{name}</span>
  </Link>
);

export default DrawerLink;
