import { ThemeProvider } from "@/components/theme-provider";
import CustomContainer from "@/components/custom-container";
import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-roboto text-foreground">
        <main className="max-w-[1920px] mx-auto border-x-0 screen-border">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="mx-2 sm:mx-8">
              <NavBar />
            </header>
            <CustomContainer>{children}</CustomContainer>
            <footer className="mx-2 sm:mx-8">
              <Footer />
            </footer>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
