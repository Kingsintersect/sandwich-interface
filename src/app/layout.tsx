import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";

import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { SessionProvider } from "@/contexts/SessionContext ";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastProvider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME } from "@/config";

// Outfit carries the whole interface - geometric, warm, and a close match
// for the lettering in the crest wordmark.
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#0b1a24",
}
// 
export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME}`,
  },
  description: "Manage Account and data",
  icons: {
    icon: [
      { url: "/logo/logo2.png", sizes: "any" },
      { url: "/logo/logo2.png", type: "image/png" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const activeThemeValue = cookieStore.get("active_theme")?.value
  const isScaled = activeThemeValue?.endsWith("-scaled")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo/logo2.png" type="image/x-icon" />
      </head>
      <body
        className={cn(
          outfit.variable,
          `bg-background font-sans overscroll-none antialiased`,
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <ReactQueryProvider>
              <SessionProvider>
                <AppProvider>
                  <AuthProvider>
                    {children}
                    <ToastProvider />
                  </AuthProvider>
                </AppProvider>
              </SessionProvider>
            </ReactQueryProvider>
          </ActiveThemeProvider>
          {/* shadcn toaster */}
          <Toaster position="top-right" expand={true} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
// BCRYPT JS