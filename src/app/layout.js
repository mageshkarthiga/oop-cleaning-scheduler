"use client";
import { PrimeReactProvider } from 'primereact/api';
import { Inter } from 'next/font/google';
import "primeflex/primeflex.css";
import Navbar from "./components/navbar"
import "../styles/globals.css"
import Tailwind from "primereact/passthrough/tailwind";
import { usePathname } from 'next/navigation';
import metadata from './metadata';
        

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>
        {!isLoginPage && <Navbar />}
        <PrimeReactProvider value={{ unstyled: false, pt: Tailwind }}>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
