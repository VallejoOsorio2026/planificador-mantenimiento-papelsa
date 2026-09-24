import type { Metadata } from "next";
import { Comfortaa, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planificador semanal de mantenimiento",
  description: "Planificación semanal de órdenes de trabajo por mecánico y turno.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-theme="dark" className={`${inter.variable} ${comfortaa.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
