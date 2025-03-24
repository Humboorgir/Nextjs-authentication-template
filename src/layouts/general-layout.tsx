import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import React from "react";

type GeneralLayoutProps = {
  children: React.ReactNode;
};

export default function GeneralLayout({ children }: GeneralLayoutProps) {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
