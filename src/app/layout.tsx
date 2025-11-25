import ReduxProvider from "@/store/providers";
import "./globals.css";
import { ThemeProvider } from "@/components/client/theme-provider";
import { Toaster } from "sonner";
export const metadata = {
  icons: {
    icon: "/logo-cinema.png",
    apple: "/logo-cinema.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors position="top-right" />

            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
