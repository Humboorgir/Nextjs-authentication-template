import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import "@/styles/globals.css";
import { Toaster } from "sonner";

import { Roboto } from "next/font/google";

const roboto = Roboto({ weight: ["400", "500", "700", "900"] });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className={roboto.className}>
      {getLayout(<Component {...pageProps} />)}
      <Toaster position="top-center" richColors />
    </div>
  );
}
