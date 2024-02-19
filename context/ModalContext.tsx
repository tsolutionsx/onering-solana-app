import { createContext, useContext, useEffect, useMemo, useState } from "react";

import useSWRImmutable from "swr/immutable";
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { SOL_ADDRESS } from "../utils/constants";

interface ChildrenProps {
  children?: React.ReactNode;
}

//  Create context
const ModalContext = createContext({});

const ModalProvider = ({ children }: ChildrenProps) => {
  const cluster = WalletAdapterNetwork.Mainnet;
  const wallet = useWallet();
  const { connection } = useConnection();

  const [tokens, setTokens] = useState<any[]>([]);
  const [tokensInWallet, setTokensInWallet] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [inputFlag, setInputFlag] = useState(false);
  const [outputFlag, setOutputFlag] = useState(false);
  const [inputToken, setInputToken] = useState(
    new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  );
  const [outputToken, setOutputToken] = useState(
    new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")
  );

  const fetcher = (url: any) =>
    fetch(url)
      .then((res) => res.json())
      .then((result) => setTokens(result));
  useSWRImmutable(TOKEN_LIST_URL[cluster], fetcher);

  useEffect(() => {
    (async () => {
      if (wallet.connected) {
        let response = await connection.getTokenAccountsByOwner(
          wallet.publicKey as PublicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        let allSplTokens: any = response.value.map((e) => {
          const accountInfo = AccountLayout.decode(e.account.data);
          const splTokenAddress = new PublicKey(accountInfo.mint).toString();
          const amount = parseInt(u64.fromBuffer(accountInfo.amount) as any);
          if (amount > 0) {
            return { splTokenAddress, amount };
          }
          return false;
        });

        const solBalance = await connection.getBalance(
          wallet.publicKey as PublicKey
        );

        if (solBalance > 0) {
          allSplTokens = [
            { splTokenAddress: SOL_ADDRESS, amount: solBalance },
            ...allSplTokens,
          ];
        }

        setTokensInWallet(allSplTokens);
      }
    })();
  }, [wallet.connected]);

  const visible = useMemo(
    () => ({ isVisible, setIsVisible }),
    [isVisible, setIsVisible]
  );

  const iFlag = useMemo(
    () => ({ inputFlag, setInputFlag }),
    [inputFlag, setInputFlag]
  );

  const oFlag = useMemo(
    () => ({ outputFlag, setOutputFlag }),
    [outputFlag, setOutputFlag]
  );

  const input = useMemo(
    () => ({ inputToken, setInputToken }),
    [inputToken, setInputToken]
  );

  const output = useMemo(
    () => ({ outputToken, setOutputToken }),
    [outputToken, setOutputToken]
  );

  const splToken = useMemo(() => ({ tokens, setTokens }), [tokens, setTokens]);

  const search = useMemo(
    () => ({ searchValue, setSearchValue }),
    [searchValue, setSearchValue]
  );

  return (
    <>
      <ModalContext.Provider
        value={{
          visible,
          iFlag,
          oFlag,
          input,
          output,
          splToken,
          cluster,
          search,
          tokensInWallet,
          wallet,
        }}
      >
        {children}
      </ModalContext.Provider>
    </>
  );
};

//  Use context
export const useModal = () => {
  return useContext<any>(ModalContext);
};

export default ModalProvider;
