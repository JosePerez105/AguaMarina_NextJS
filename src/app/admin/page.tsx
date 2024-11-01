import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import { NextUIProvider } from '@nextui-org/react';

export const metadata: Metadata = {
  title:
    "Dashboard Page",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
    <NextUIProvider>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </NextUIProvider>
    </>
  );
}
