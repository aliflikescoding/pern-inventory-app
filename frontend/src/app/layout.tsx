import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import CustomContainer from "@/components/custom-container";
import { Roboto } from "next/font/google";
import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import "./globals.css";

// Define the Roboto font from Google Fonts
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

// Define metadata for SEO and other global head elements
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app", // Add a meaningful description for SEO
  openGraph: {
    title: "Create Next App", // Title for Open Graph (social media preview)
    description: "Generated by create next app",
    url: "https://your-website.com", // Set the website URL (replace with your actual URL)
    siteName: "Next.js Website",
    images: [
      {
        url: "/og-image.jpg", // URL to an image for social media preview (Open Graph)
        width: 800,
        height: 600,
        alt: "Next.js website preview image",
      },
    ],
    locale: "en_US", // Language setting for Open Graph
    type: "website", // Type of content (can be 'website', 'article', etc.)
  },
  twitter: {
    card: "summary_large_image", // Twitter card type
    title: "Create Next App",
    description: "Generated by create next app",
    image: "/og-image.jpg", // Image for the Twitter card
  },
  icons: {
    icon: "/favicon.ico", // Set the favicon (used by browsers)
  },
  // Add any other global meta information you'd like
};

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
