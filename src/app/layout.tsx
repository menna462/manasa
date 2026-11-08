import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "لوحة تحكم المنصة (الأدمن) | إدارة وتوليد الأكواد",
  description: "إدارة وتوليد أكواد الوصول، متابعة الاستهلاك، والتحكم في حزم الحصص للسناتر والمنصة الإلكترونية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="min-h-screen bg-[#F8F9FA] text-[#1A1D20] font-sans antialiased selection:bg-[#FF6A00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
