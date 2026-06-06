import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "@/assets/styles/globals.css";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";  // ← اضافه شد

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: {
    template: `%s | فروشگاه تن پوشان`,
    default: APP_NAME
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body className={cn(vazirmatn.className, "antialiased")}>
        <ThemeProvider attribute='class' defaultTheme="light" enableSystem disableTransitionOnChange>
          <SessionProvider>  {/* ← این خط اضافه شد */}
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}