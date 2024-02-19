import React, { useState, useEffect } from "react";
import Image from "next/image";

import JSBI from "jsbi";
import { BiChevronDown } from "react-icons/bi";
import { useDebounce } from "use-debounce";
import { getPlatformFeeAccounts, Jupiter, RouteInfo } from "@jup-ag/core";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import BoxContent from "../../components/BoxContent";
import Loading from "../../components/Loading";
import Notification from "../../components/Notification";
import TokenListModal from "../../components/TokenListModal";
import Button from "../../components/Button";
import { useModal } from "../../context/ModalContext";
import { ImageLoader, EscapeRegExp } from "../../utils/functions";
import { inputRegex, SOL_ADDRESS } from "../../utils/constants";

export interface Token {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  tags: string[];
}

const Swap = () => {
  const {
    visible: { isVisible, setIsVisible },
    iFlag: { inputFlag, setInputFlag },
    oFlag: { outputFlag, setOutputFlag },
    input: { inputToken, setInputToken },
    output: { outputToken, setOutputToken },
    splToken: { tokens },
    search: { setSearchValue },
    cluster,
  } = useModal();
  const wallet = useWallet();
  const { connection } = useConnection();

  const [jupiter, setJupiter] = useState<Jupiter>();
  const [inputAmount, setInputAmount] = useState<any>("");
  const [outputAmount, setOutputAmount] = useState<any>(0);
  const [inputBalance, setInputBalance] = useState(0);
  const [outputBalance, setOutputBalance] = useState(0);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [defaultRoute, setDefaultRoute] = useState<RouteInfo>(routes[0]);
  const [selectedRouteFlag, setSelectedRouteFlag] = useState(0);
  const [isSwappable, setIsSwappable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [platformFeeAndAccounts, setPlatformFeeAndAccounts] = useState<{
    feeBps: number;
    feeAccounts: Map<string, PublicKey>;
  }>();

  const [delayedValue] = useDebounce(inputAmount, 600);
  const selectedInputTokenInfo: any = tokens.find(
    (token: any) => token.address === inputToken.toString()
  );
  const selectedOutputTokenInfo: any = tokens.find(
    (token: any) => token.address === outputToken.toString()
  );

  useEffect(() => {
    (async () => {
      await getPlatformFeeAccounts(
        connection,
        new PublicKey("5yjWb6dHH4d4s4NbisQvtXjjBaz5otmR6wcV8ZdSUSjn")
      ).then((res) => {
        setPlatformFeeAndAccounts({
          feeBps: 10,
          feeAccounts: res,
        });
      });

      const jupiter = await Jupiter.load({
        connection,
        cluster,
        platformFeeAndAccounts,
        routeCacheDuration: 600,
      });

      setJupiter(jupiter);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, cluster]);

  useEffect(() => {
    if (inputAmount > 0) {
      getRoutes();
    } else {
      setRoutes([]);
      // setDefaultRoute();
      setIsLoading(false);
      setIsSwappable(false);
      setOutputAmount(0);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayedValue, outputToken]);

  useEffect(() => {
    (async () => {
      if (wallet.publicKey) {
        if (selectedInputTokenInfo.address === SOL_ADDRESS) {
          const tokenAmount = await connection.getBalance(
            wallet.publicKey as PublicKey
          );
          const uiAmount = tokenAmount / 10 ** 9;
          return setInputBalance(uiAmount);
        } else if (selectedOutputTokenInfo.address === SOL_ADDRESS) {
          const tokenAmount = await connection.getBalance(
            wallet.publicKey as PublicKey
          );
          const uiAmount = tokenAmount / 10 ** 9;
          return setOutputBalance(uiAmount);
        }
        getBalance();
      } else {
        setInputAmount(0);
        setOutputAmount(0);
        setInputBalance(0);
        setOutputBalance(0);
        setRoutes([]);
        setDefaultRoute(routes[0]);
        setIsLoading(false);
        setIsSwappable(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected, inputToken, outputToken]);

  const getRoutes = async () => {
    if (!jupiter) return;
    setIsLoading(true);
    setIsSwappable(false);

    const amount = inputAmount * 10 ** selectedInputTokenInfo.decimals;

    console.time("holmes");
    const computeRoutes = await jupiter.computeRoutes({
      inputMint: inputToken,
      outputMint: outputToken,
      amount: JSBI.BigInt(+amount),
      slippage: 1,
      // forceFetch: true,
      onlyDirectRoutes: true,
    });
    console.timeEnd("holmes");

    setRoutes(computeRoutes.routesInfos);
    setDefaultRoute(computeRoutes.routesInfos[0]);
    setIsLoading(false);
    setIsSwappable(true);
  };

  const getBalance = async () => {
    if (inputToken === SOL_ADDRESS) {
      const tokenAmount = await connection.getBalance(
        wallet.publicKey as PublicKey
      );
      const uiAmount = tokenAmount / 10 ** 9;
      setInputBalance(uiAmount);
    } else if (outputToken === SOL_ADDRESS) {
      const tokenAmount = await connection.getBalance(
        wallet.publicKey as PublicKey
      );
      const uiAmount = tokenAmount / 10 ** 9;
      setOutputBalance(uiAmount);
    } else {
      const [iResult, oResult] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(wallet.publicKey as any, {
          mint: inputToken,
        }),
        connection.getParsedTokenAccountsByOwner(wallet.publicKey as any, {
          mint: outputToken,
        }),
      ]);

      if (iResult.value.length > 0) {
        const parsedInfo = iResult.value[0].account.data.parsed;
        const iTokenAmount = parsedInfo.info.tokenAmount.uiAmount;
        setInputBalance(iTokenAmount);
      } else {
        setInputBalance(0);
      }
      if (oResult.value.length > 0) {
        const parsedInfo = oResult.value[0].account.data.parsed;
        const oTokenAmount = parsedInfo.info.tokenAmount.uiAmount;
        setOutputBalance(oTokenAmount);
      } else {
        setOutputBalance(0);
      }
    }
  };

  const getMaxAmount = () => {
    if (wallet.publicKey) {
      const val = restrictInputValue(+inputBalance);
      setInputAmount(val);
      if (inputAmount !== +inputBalance) {
        setInputAmount(val);
      }
    } else {
      Notification({
        type: "error",
        title: "Connection Required",
        message: "Please connect your wallet before.",
        link: "",
      });
    }
  };

  const getHalfAmount = () => {
    if (wallet.publicKey) {
      const val = restrictInputValue(+inputBalance / 2);
      setInputAmount(val);
      if (inputAmount !== +inputBalance / 2) {
        setInputAmount(val);
      }
    } else {
      Notification({
        type: "error",
        title: "Connection Required",
        message: "Please connect your wallet before.",
        link: "",
      });
    }
  };

  const handleSwapAction = async () => {
    if (routes.length <= 0) {
      setIsSwappable(false);
      return;
    }
    setIsSwappable(false);
    if (wallet.publicKey) {
      setIsLoading(true);
      try {
        const jupiter = await Jupiter.load({
          connection,
          cluster,
          user: wallet.publicKey,
          platformFeeAndAccounts,
        });

        const { execute }: any = await jupiter.exchange({
          routeInfo: defaultRoute,
        });

        await execute({
          wallet: {
            sendTransaction: wallet.sendTransaction,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
          },
          onTransaction: async (txid: any) => {
            Notification({
              title: "Transaction submitting",
              message: "Confirming your transaction",
              link: `https://explorer.solana.com/tx/${txid}`,
            });

            await connection.confirmTransaction(txid, "confirmed");

            Notification({
              type: "success",
              title: "Transaction submitted",
              message: "Your swap transaction was successfully submitted.",
              link: `https://explorer.solana.com/tx/${txid}`,
            });

            setInputAmount(0);
            getBalance();
          },
        });
      } catch (error: any) {
        Notification({
          type: "error",
          title: "Error catched",
          message: error.name,
          link: "",
        });
      }

      setIsSwappable(true);
      setIsLoading(false);
    }
  };

  const chooseToken = (token: any) => {
    if (inputFlag) {
      setInputToken(new PublicKey(token.address));
    }
    if (outputFlag) {
      setOutputToken(new PublicKey(token.address));
    }
    setIsVisible(false);
    setInputFlag(false);
    setOutputFlag(false);
    setSearchValue("");
    setDefaultRoute(routes[0]);
  };

  const switchToken = () => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setInputBalance(outputBalance);
    setOutputBalance(inputBalance);
    setInputAmount(0);
    setOutputAmount(0);

    setDefaultRoute(routes[0]);
    setRoutes([]);
    setIsSwappable(false);
  };

  const restrictInputValue = (value: any) => {
    if (value === "") {
      return "";
    }
    const tvalue = +value;

    if (selectedInputTokenInfo) {
      if (tvalue > inputBalance) {
        return inputBalance;
      } else {
        return Number(tvalue.toFixed(selectedInputTokenInfo.decimals));
      }
    } else {
      return Number(tvalue.toFixed(6));
    }
  };

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(EscapeRegExp(nextUserInput))) {
      setInputAmount(nextUserInput);
      setOutputAmount(
        parseInt(defaultRoute?.outAmount.toString()) /
          10 ** selectedOutputTokenInfo?.decimals || 0
      );
    }
  };

  const chevronDown = (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[30px] h-[30px]"
    >
      <path
        d="m8 10 4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <>
      {isVisible && <TokenListModal chooseToken={chooseToken} />}

      <BoxContent>
        <div className="relative">
          <div className="absolute top-[144px] left-0 flex justify-center w-[100%]">
            <div>
              <button
                className="relative shadow-xl bg-skin-base/[0.1] hover:bg-skin-base/[0.1] rounded-full border-2 border-skin-inverted p-1"
                onClick={() => switchToken()}
              >
                <div className="stroke-skin-base hover:stroke-skin-accent">
                  {chevronDown}
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-1">
          <p className="text-skin-base text-[14px] font-inter">From:</p>
          <div className="flex items-center text-[14px] gap-2 text-skin-base pb-3">
            <p>Powered by</p>
            <Image
              loader={ImageLoader}
              src="/jupiter-logo.png"
              alt="jupier-logo"
              width={25}
              height={25}
            />
            <p className="text-skin-base text-[20px]">Jupiter</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="rounded-lg space-y-2">
            <div className="flex justify-between max-h-[48px] py-[12px] px-[16px] h-[48px] bg-skin-base/[0.1] shadow-buttonDisabled rounded-[8px] outline-0 text-skin-base text-[14px] sm:text-[16px]">
              <input
                type="text"
                placeholder="Set amount"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                pattern="^[0-9]*[.,]?[0-9]*$"
                minLength={1}
                maxLength={11}
                spellCheck="false"
                value={inputAmount}
                className="w-[70%] bg-transparent outline-none"
                onChange={(e) => {
                  enforcer(e.target.value.replace(/,/g, "."));
                }}
              />
              <div className="w-[1px] h-[24px] bg-skin-base mr-[10px] sm:mr-[18px]" />
              <button
                className="flex items-center text-skin-base"
                onClick={() => {
                  setIsVisible(true);
                  setInputFlag(true);
                }}
              >
                {selectedInputTokenInfo ? (
                  <div className="flex items-center gap-2 mr-1">
                    <Image
                      loader={ImageLoader}
                      src={
                        selectedInputTokenInfo
                          ? selectedInputTokenInfo.logoURI
                          : "/no-token.png"
                      }
                      alt={selectedInputTokenInfo.name}
                      className="rounded-full"
                      width={28}
                      height={28}
                    />
                    <p>{selectedInputTokenInfo.symbol}</p>
                  </div>
                ) : (
                  "Select"
                )}
                <BiChevronDown size={26} />
              </button>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-skin-base space-x-2">
                <button
                  className="text-skin-inverted bg-skin-accent cursor-pointer hover:bg-gradient-to-r from-skin-gradient3 to-skin-gradient4 hover:bg-skin-accent px-3 py-[2px] rounded-xl"
                  onClick={() => getHalfAmount()}
                >
                  Half
                </button>
                <button
                  className="text-skin-inverted bg-skin-accent cursor-pointer hover:bg-gradient-to-r from-skin-gradient3 to-skin-gradient4 hover:bg-skin-accent px-3 py-[2px] rounded-xl"
                  onClick={() => getMaxAmount()}
                >
                  Max
                </button>
              </div>
              <div className="text-skin-base text-[12px] pr-1">
                Available:{" "}
                {inputBalance
                  .toFixed(selectedInputTokenInfo?.decimals)
                  .toLocaleString()}{" "}
                {selectedInputTokenInfo?.symbol}
              </div>
            </div>
          </div>
          <div className="h-20" />
          <div className="rounded-lg pb-4 space-y-2 text-sm">
            <p className="text-skin-base text-[14px] font-inter">To:</p>
            <div className="flex justify-between max-h-[48px] py-[12px] px-[16px] h-[48px] bg-skin-base/[0.1] shadow-buttonDisabled rounded-[8px] outline-0 text-skin-base text-[14px] sm:text-[16px]">
              <input
                id="outputToken"
                type="number"
                placeholder="Set amount"
                readOnly
                value={
                  inputAmount > 0
                    ? parseInt(defaultRoute?.outAmount.toString()) /
                        10 ** selectedOutputTokenInfo?.decimals || 0
                    : outputAmount
                }
                className="w-[70%] bg-transparent outline-none cursor-default"
              />

              <div className="w-[1px] h-[24px] bg-skin-base mr-[10px] sm:mr-[18px]" />
              <button
                className="flex items-center text-skin-base"
                onClick={() => {
                  setIsVisible(true);
                  setOutputFlag(true);
                }}
              >
                {selectedOutputTokenInfo ? (
                  <div className="flex items-center space-x-2 mr-1">
                    <Image
                      loader={ImageLoader}
                      src={
                        selectedOutputTokenInfo
                          ? selectedOutputTokenInfo.logoURI
                          : "/no-token.png"
                      }
                      alt={selectedOutputTokenInfo.name}
                      className="rounded-full"
                      width={28}
                      height={28}
                    />
                    <p>{selectedOutputTokenInfo.symbol}</p>
                  </div>
                ) : (
                  "Select"
                )}
                <BiChevronDown size={26} />
              </button>
            </div>
            <div className="flex justify-between">
              <div className="text-skin-base">
                {routes.length > 0 ? routes.length + " routes found" : ""}
              </div>
              <div className="text-skin-base text-[12px] pr-1">
                Balance:{" "}
                {outputBalance
                  .toFixed(selectedOutputTokenInfo?.decimals)
                  .toLocaleString()}{" "}
                {selectedOutputTokenInfo?.symbol}
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[300px] px-4 -mx-4 scrollbar-thin scrollbar-thumb-gray-700">
            {!isLoading ? (
              routes.length > 0 &&
              routes.map((route, index) => {
                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center pr-4 py-3 mb-2 cursor-pointer text-skin-accent  bg-skin-inverted ${
                      selectedRouteFlag === index &&
                      "border-4 border-skin-accent opacity-70"
                    } rounded-md px-4`}
                    onClick={() => {
                      setSelectedRouteFlag(index);
                      setDefaultRoute(route);
                    }}
                  >
                    <div className="flex flex-col">
                      <p>{route.marketInfos[0].amm.label}</p>
                      <p className="text-[12px]">
                        {selectedInputTokenInfo.symbol}
                        {" => "}
                        {selectedOutputTokenInfo.symbol}
                      </p>
                    </div>
                    <p className="text-[20px]">
                      {selectedOutputTokenInfo &&
                        parseInt(route.outAmount.toString()) /
                          10 ** selectedOutputTokenInfo.decimals}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="py-4">
                <Loading />
              </div>
            )}
          </div>

          <div className="py-2">
            <Button
              disabled={!isSwappable || inputAmount > inputBalance}
              isLoading={!isSwappable && isLoading}
              action={() => handleSwapAction()}
            >
              {inputAmount > inputBalance ? "Insufficient Balance" : "Swap"}
            </Button>
          </div>
        </div>
      </BoxContent>
    </>
  );
};

export default Swap;
