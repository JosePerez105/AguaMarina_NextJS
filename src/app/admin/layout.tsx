"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";


import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { checkToken } from "@/api/validations/check_cookie";
import LoaderFullScreen from "@/components/Loaders/LoaderFullScreen";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const [isLogged, setIsLogged] = useState(false);

  // useEffect(() => {
  //   const render = async() => {
  //     setLoadingLayout(false);
  //   };
  //   render();
  // }, []);


  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-hidden" >
        {/* <!-- ===== Sidebar Star ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area STAR ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setLoadingLayout={setLoading} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
        {loading ? (
          <LoaderFullScreen />
        ): <></>}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}




// import React, { useEffect, useState } from "react";
// import Loader from "@/components/common/Loader";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // const pathname = usePathname();

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 0);
//   }, []);

//   return (
//     <html lang="en">
//       <head>
//         <link rel="icon" href="/images/logo/LogoSimbolo.png" />
//       </head>
//       <body suppressHydrationWarning={true}>
//         {loading ? <div className="w-full h-screen flex justify-center overflow-hidden"><Loader /></div> : children}
//       </body>
//     </html>
//   );
// }



// "use client";
