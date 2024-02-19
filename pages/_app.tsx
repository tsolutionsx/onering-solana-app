import Head from "next/head";
import Script from "next/script";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  BitKeepWalletAdapter,
  BitpieWalletAdapter,
  BloctoWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  MathWalletAdapter,
  GlowWalletAdapter,
  SafePalWalletAdapter,
  SolongWalletAdapter,
  TokenPocketWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AppProps } from "next/app";
import { FC, useEffect, useMemo } from "react";
import StateContext from "../context/StateContext";
import ModalProvider from "../context/ModalContext";
import Layout from "../components/Layout";
import { TourProvider, useTour } from "@reactour/tour";

require("@solana/wallet-adapter-react-ui/styles.css");
require("react-toastify/dist/ReactToastify.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const cluster = WalletAdapterNetwork.Mainnet;
  const customRpcUrl = process.env.NEXT_PUBLIC_CUSTOM_RPC_URL as string;

  const endpoint = useMemo(
    () => customRpcUrl || clusterApiUrl(cluster),
    [customRpcUrl, cluster]
  );

  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network: cluster }),
      new SolletExtensionWalletAdapter({ network: cluster }),
      new SolletWalletAdapter({ network: cluster }),
      new TorusWalletAdapter(),
      new BitKeepWalletAdapter(),
      new BitpieWalletAdapter(),
      new BloctoWalletAdapter({ network: cluster }),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new MathWalletAdapter(),
      new GlowWalletAdapter(),
      new SafePalWalletAdapter(),
      new SolongWalletAdapter(),
      new TokenPocketWalletAdapter(),
    ],
    [cluster]
  );

  useEffect(() => {
    document.body.addEventListener("touchmove", function (e) {
      e.preventDefault();
    });
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <StateContext>
            <ModalProvider>
              <Head>
                <title>One Ring</title>
                <meta charSet="utf-8" />
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
                <link rel="icon" href="/favicon.ico" />
                <meta
                  name="description"
                  content="Cross Chain Stable Coin Yield Optimizer"
                />
                <link
                  rel="preload"
                  href="/fonts/FuturaPT-Medium.woff2"
                  as="font"
                  crossOrigin=""
                  type="font/woff2"
                />

                <link
                  rel="preload"
                  href="/fonts/FuturaPT-Heavy.woff2"
                  as="font"
                  crossOrigin=""
                  type="font/woff2"
                />

                <link
                  rel="preload"
                  href="/fonts/Inter-Regular.woff2"
                  as="font"
                  crossOrigin=""
                  type="font/woff2"
                />
              </Head>
              <Script
                src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"
                strategy="beforeInteractive"
              ></Script>
              <TourProvider steps={[]} className="tour">
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </TourProvider>
            </ModalProvider>
          </StateContext>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
