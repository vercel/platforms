import { ReactNode, Suspense } from "react";
import { cal } from "@/styles/fonts";
import Profile from "@/components/profile";
import Nav from "@/components/nav";
import { FileCode, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const externalLinks = [
  {
    name: "Star on GitHub",
    href: "https://github.com/vercel/platforms",
    icon: <Github width={18} />,
  },
  {
    name: "Read the guide",
    href: "https://vercel.com/guides/nextjs-multi-tenant-application",
    icon: <FileCode width={18} />,
  },
  {
    name: "Deploy your own",
    href: "https://vercel.com/templates/next.js/platforms-starter-kit",
    icon: (
      <svg
        width={18}
        viewBox="0 0 76 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="py-1"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cal.variable}>
      <div className="w-60 left-0 h-full fixed border-r bg-stone-100 border-gray-200 p-4 flex flex-col justify-between">
        <div className="grid gap-2">
          <div className="rounded-lg px-2 py-1.5 flex items-center space-x-2">
            <a
              href="https://vercel.com/templates/next.js/platforms-starter-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 hover:bg-stone-200"
            >
              <svg
                width="26"
                viewBox="0 0 76 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
              </svg>
            </a>
            <div className="border-l border-stone-400 h-6 rotate-[30deg]" />
            <Link href="/" className="rounded-lg p-2 hover:bg-stone-200">
              <Image src="/logo.png" width={24} height={24} alt="Logo" />
            </Link>
          </div>
          <Nav />
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between hover:bg-stone-200 active:bg-stone-300 rounded-lg px-2 py-1.5 transition-all ease-in-out duration-150"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="border-t border-stone-200 my-2" />
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        </div>
      </div>
      <div className="pl-60">{children}</div>
    </div>
  );
}
