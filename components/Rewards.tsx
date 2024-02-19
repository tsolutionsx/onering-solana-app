import { useContext, useCallback, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { StateContext } from "../context/StateContext";
import truncate from "../utils/truncate";
import Image from "next/image";
import Button from "./Button";
import { unstake } from "../helpers/sdk";
import Loading from "../components/Loading";
import type { SDKContext } from "../helpers/sdk";
import { DecimalsType } from "../utils/constants";

type Props = {
  isMobile?: boolean;
};

export default function Rewards({ isMobile = false }: Props) {
  const ref = useDetectClickOutside({ onTriggered: () => setIsOpen(false) });
  const [isOpen, setIsOpen] = useState(false);
  const {
    disconnected,
    rewards,
    apy,
    setShouldUpdateBalance,
    SDK,
    isLoading,
    setIsLoading,
    currentApy,
  } = useContext(StateContext);

  const onUnstake = useCallback(async () => {
    await unstake({
      SDK: SDK as SDKContext,
      amount: rewards,
      setIsLoading: setIsLoading,
    });

    setShouldUpdateBalance(true);
  }, [rewards, SDK, setIsLoading, setShouldUpdateBalance]);

  return isMobile ? (
    <div className="flex flex-col relative space-y-4 border-t-[1px] border-skin-inverted/[10%] pt-4">
      <div className="flex flex-row h-[30px] justify-between items-center px-2">
        <span className="text-[14px] font-inter text-skin-accent">
          Average APY
        </span>
        <div className="text-[18px] text-skin-base">
          {isLoading ? (
            <Loading />
          ) : (
            `${truncate({ value: currentApy, decimals: DecimalsType.two })}%`
          )}
        </div>
      </div>
      <div className="flex- flex-col h-[110px] p-[24px] rounded-[16px] shadow-internal bg-oneusd bg-no-repeat bg-contain bg-right bg-clip-border">
        <h1 className="text-[14px] font-inter text-skin-accent">
          Available to unstake
        </h1>
        {isLoading ? (
          <div className="flex mt-3">
            <Loading />
          </div>
        ) : (
          <p className="text-[18px] text-skin-base">
            {truncate({ value: rewards })} $1USD
          </p>
        )}
      </div>
      <Button disabled={isLoading || rewards === 0} action={() => onUnstake()}>
        {isLoading ? <Loading /> : "Unstake"}
      </Button>
    </div>
  ) : (
    <>
      {!disconnected && (
        <div
          className="rewards relative shadow-2xl border-l-2 pl-4 ml-2 border-skin-base/[0.1]"
          ref={ref}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-row items-center gap-2"
          >
            <div className="relative w-[30px] h-[30px]">
              <Image
                src="/oneusd.svg"
                layout="fill"
                alt="rewards"
                placeholder="blur"
                blurDataURL="/yield.svg"
              />
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <span className="text-skin-base hover:text-skin-accent">
                {truncate({ value: rewards, decimals: DecimalsType.two })}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute bg-skin-inverted top-[53px] right-[-160px] transition-all duration-500 ease-in-out shadow-2xl backdrop-blur-[36px] rounded-[8px] border-[2px] border-skin-base/[0.1]">
              <div className="flex flex-col w-[400px] p-[24px] relative opacity-[99%]">
                <div className="flex flex-row justify-between items-center text-skin-base">
                  <span className="text-[18px]">Rewards</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 drop-shadow transition transform hover:scale-125 motion-reduce:transition-none motion-reduce:hover:transform-none"
                  >
                    <div className="relative w-[12px] h-[12px]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
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
                <div className="flex flex-col h-[110px] p-[24px] my-4 rounded-[16px] shadow-internal bg-oneusd bg-no-repeat bg-contain bg-right bg-clip-border bg-opacity-75 dark-bg-opacity-100">
                  <h1 className="text-[14px] font-inter text-skin-base">
                    Available to unstake
                  </h1>
                  <div className="text-[18px] text-skin-accent mt-3">
                    {isLoading ? (
                      <div className="flex mt-3">
                        <Loading />
                      </div>
                    ) : (
                      `${truncate({ value: rewards })} $1USD`
                    )}
                  </div>
                </div>
                <div className="w-full p-[24px] h-[100px] rounded-[16px] shadow-internal bg-skin-fill mb-6">
                  <span className="text-[14px] font-inter text-skin-base">
                    Average APY
                  </span>
                  <div className="text-[18px] text-skin-accent">
                    {isLoading ? (
                      <div className="flex mt-3">
                        <Loading />
                      </div>
                    ) : (
                      // `${lastApr().toFixed(2)}%`
                      `${truncate({
                        value: currentApy,
                        decimals: DecimalsType.two,
                      })}%`
                    )}
                  </div>
                </div>
                <Button
                  disabled={isLoading || rewards === 0}
                  action={() => onUnstake()}
                >
                  {isLoading ? <Loading /> : "Unstake"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
