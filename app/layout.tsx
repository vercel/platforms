// These styles apply to every route in the application
import "@/styles/globals.css";
import { inter } from "@/styles/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
