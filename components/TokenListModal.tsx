import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";

import Modal from "./Modal";
import TokenlistBox from "./TokenListBox";
import Button from "../components/Button";
import { useModal } from "../context/ModalContext";
import { ImageLoader } from "../utils/functions";

const TokenListModal = ({ chooseToken }: any) => {
  const {
    visible: { setIsVisible },
    iFlag: { inputFlag, setInputFlag },
    oFlag: { outputFlag, setOutputFlag },
    splToken: { tokens },
    search: { searchValue, setSearchValue },
    tokensInWallet,
    wallet,
  } = useModal();
  const [count, setCount] = useState(1);
  const [resultTokens, setResultTokens] = useState<any>([]);
  const [scrollTokens, setScrollTokens] = useState<any>([]);

  const preferredTokens = [
    {
      symbol: "SOL",
      address: tokens.find((token: any) => token.symbol === "SOL").address,
      logoURI: tokens.find((token: any) => token.symbol === "SOL").logoURI,
    },
    {
      symbol: "USDC",
      address: tokens.find((token: any) => token.symbol === "USDC").address,
      logoURI: tokens.find((token: any) => token.symbol === "USDC").logoURI,
    },
    {
      symbol: "USDT",
      address: tokens.find((token: any) => token.symbol === "USDT").address,
      logoURI: tokens.find((token: any) => token.symbol === "USDT").logoURI,
    },
    {
      symbol: "USDH",
      address: tokens.find((token: any) => token.symbol === "USDH").address,
      logoURI: tokens.find((token: any) => token.symbol === "USDH").logoURI,
    },
    {
      symbol: "USH",
      address: tokens.find((token: any) => token.symbol === "USH").address,
      logoURI: tokens.find((token: any) => token.symbol === "USH").logoURI,
    },
    {
      symbol: "PAI",
      address: tokens.find((token: any) => token.symbol === "PAI").address,
      logoURI: tokens.find((token: any) => token.symbol === "PAI").logoURI,
    },
  ];

  const filteredTokens = useMemo(
    () =>
      resultTokens &&
      resultTokens.filter((token: any) => {
        if (token) {
          if (!searchValue) return true;
          if (
            token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
            token.address.includes(searchValue)
          )
            return true;
        }
      }),
    [resultTokens, searchValue]
  );

  const walletTokens = useMemo(() => {
    if (tokensInWallet.length > 0 && tokens.length > 0) {
      return tokensInWallet.map((mint: any) => {
        if (mint) {
          const findToken = tokens.find(
            (token: any) => token.address === mint.splTokenAddress
          );
          if (findToken) {
            return {
              symbol: findToken.symbol,
              name: findToken.name,
              address: mint.splTokenAddress,
              logoURI: findToken.logoURI,
              decimal: findToken.decimals,
              amount: mint.amount,
            };
          }
        } else {
          return false;
        }
      });
    } else return false;
  }, [tokens, tokensInWallet]);

  useEffect(() => {
    if (wallet.connected && inputFlag && !outputFlag) {
      setResultTokens(walletTokens);
    } else {
      setResultTokens(tokens);
      setScrollTokens(filteredTokens);
    }
  }, [wallet.connected, inputFlag, outputFlag, tokens]);

  useEffect(() => {
    filteredTokens && setScrollTokens(filteredTokens.slice(0, 19));
  }, [filteredTokens]);

  const fetchMoreData = (e: any) => {
    const scrollHeight = e.target.scrollHeight;
    const maxHeight: any = document.getElementById("scroll")?.offsetHeight;
    if (e.target.scrollTop === scrollHeight - maxHeight) {
      const tempTokens = filteredTokens.slice(0 + count * 20, 19 + count * 20);
      setScrollTokens(scrollTokens.concat(tempTokens));
      setCount(count + 1);
    }
  };

  return (
    <>
      <Modal>
        <div className="space-y-4 z-30">
          <div className="flex justify-between items-center">
            <p className="text-skin-base text-[20px]">Select a Token</p>
            <button
              className="p-2 drop-shadow transition transform hover:scale-125 motion-reduce:transition-none motion-reduce:hover:transform-none"
              onClick={() => {
                setIsVisible(false);
                setInputFlag(false);
                setOutputFlag(false);
                setSearchValue("");
              }}
            >
              <div className="relative w-[12px] h-[12px] text-skin-base">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="fill-skin-base"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3337 13.3333L2.66699 2.66667M13.3337 2.66667L2.66699 13.3333"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
          </div>
          <input
            type="search"
            autoFocus
            placeholder="Search name or paste address"
            className="rounded-md h-12 w-full text-skin-base bg-transparent border border-skin-base p-2 outline-none"
            onChange={(e: any) => setSearchValue(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            {preferredTokens.map((token) => (
              <Button key={token.address} action={() => chooseToken(token)}>
                <div className="w-full flex items-center justify-start space-x-1">
                  <Image
                    loader={ImageLoader}
                    src={token.logoURI}
                    alt={token.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p className="text-skin-invrerted">{token.symbol}</p>
                </div>
              </Button>
            ))}
          </div>
          <div className="mx-1 border-[1px] border-[#313131]" />
          <div
            id="scroll"
            className={`space-y-6 overflow-y-auto h-full max-h-[500px] scrollbar-thin scrollbar-thumb-gray-800`}
            onScrollCapture={(e: any) => {
              fetchMoreData(e);
            }}
          >
            {scrollTokens.length > 0 ? (
              scrollTokens.map((token: any, index: any) => {
                return (
                  token && (
                    <TokenlistBox
                      key={`sdf${index}`}
                      token={token}
                      chooseToken={chooseToken}
                    />
                  )
                );
              })
            ) : (
              <p className="text-center text-skin-base">No results found.</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TokenListModal;
