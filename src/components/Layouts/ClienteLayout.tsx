"use client";

import Footer from "@/components/Clients/Footer";
import Header from "@/components/Clients/Header";
import ScrollToTop from "@/components/Clients/ScrollToTop";
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "@/css/Clientes/index.css";
import "@/css/Clientes/prism-vsc-dark-plus.css";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Clients/Common/PreLoader";

  export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html suppressHydrationWarning={true} /* className="!scroll-smooth" */ lang="en">
      <head />

      <body>
        {loading ? (
          <PreLoader />
        ) : (
          // <SessionProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
            >
                <div>
                  <Header />
                  {children}
                  <Footer />
                  <ScrollToTop />
                </div>
                  
                
            </ThemeProvider>
          // </SessionProvider>
        )}
      </body>
    </html>
  );
}