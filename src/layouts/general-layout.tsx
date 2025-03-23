import React from "react";

type GeneralLayoutProps = {
  children: React.ReactNode;
};

export default function GeneralLayout({ children }: GeneralLayoutProps) {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <nav></nav>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}
