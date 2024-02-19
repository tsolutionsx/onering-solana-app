import { useCallback, useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import BoxContent from "../../components/BoxContent";
import Button from "../../components/Button";
import ModeSelect from "../../components/ModeSelect";
import Input from "../../components/Input";
import { StateContext } from "../../context/StateContext";
import {
  mint,
  redeem,
  mintAndStake,
  previewRedeemAmount,
} from "../../helpers/sdk";
import Loading from "../../components/Loading";
import { InputType, TabType } from "../../utils/constants";
import { nav } from "../../utils/constants";
import truncate from "../../utils/truncate";
import BlockModal from "../../components/BlockModal";
import getPercentage from "../../utils/percentageBetweenDates";
import type { SDKContext } from "../../helpers/sdk";
import { useDebounce } from "use-debounce";

const Mint: NextPage = () => {
  const {
    selectedTab,
    disconnected,
    stableBalance,
    realmBalance,
    inputValueFrom,
    inputValueTo,
    SDK,
    isLoading,
    lastDeposit,
    redeemLockedUntil,
    setIsLoading,
    setShouldUpdateBalance,
    setInputValueFrom,
    setInputValueTo,
  } = useContext(StateContext);

  const [warningIsOpen, setWarningIsOpen] = useState(false);
  const [style, setStyle] = useState({});
  const [currentBlockTime, setCurrentBlockTime] = useState(0);
  const [delayedValue] = useDebounce(inputValueFrom, 600);

  const cleanFields = useCallback(() => {
    setInputValueFrom("");
    setInputValueTo("");
  }, [setInputValueFrom, setInputValueTo]);

  const getMaxValue = () => {
    if (disconnected) return "";

    switch (selectedTab) {
      case TabType.Mint.valueOf():
        if (stableBalance) return stableBalance.toString();
        return "";
      case TabType.Redeem.valueOf():
        if (realmBalance) return realmBalance.toString();
        return "";
      default:
        return "";
    }
  };

  const onMint = useCallback(async () => {
    await mint({
      SDK: SDK! as SDKContext,
      amount: Number(inputValueFrom),
      setIsLoading: setIsLoading,
    });

    setShouldUpdateBalance(true);
    cleanFields();
  }, [inputValueFrom, SDK, cleanFields, setIsLoading, setShouldUpdateBalance]);

  const onMintAndStake = useCallback(async () => {
    await mintAndStake({
      SDK: SDK! as SDKContext,
      amount: Number(inputValueFrom),
      setIsLoading: setIsLoading,
    });

    setShouldUpdateBalance(true);
    cleanFields();
  }, [inputValueFrom, SDK, cleanFields, setIsLoading, setShouldUpdateBalance]);

  const onRedeem = useCallback(async () => {
    await redeem({
      SDK: SDK! as SDKContext,
      amount: Number(inputValueFrom),
      setIsLoading: setIsLoading,
    });

    setShouldUpdateBalance(true);
    cleanFields();
  }, [inputValueFrom, SDK, cleanFields, setIsLoading, setShouldUpdateBalance]);

  const onPreviewRedeemAmount = useCallback(async () => {
    const previewAmount =
      (await previewRedeemAmount({
        SDK: SDK! as SDKContext,
        amount: Number(inputValueFrom),
        setIsLoading: setIsLoading,
      })) || 0;

    setInputValueTo(previewAmount.toString());
  }, [inputValueFrom, SDK]);

  useEffect(() => {
    if (selectedTab === TabType.Redeem && Number(delayedValue) > 0) {
      onPreviewRedeemAmount();
    } else {
      setInputValueTo(delayedValue);
    }
  }, [selectedTab, delayedValue, setInputValueTo]);

  useEffect(() => {
    cleanFields();
  }, [selectedTab, disconnected, cleanFields]);

  const refreshCurrentBlockTime = useCallback(async () => {
    if (currentBlockTime === 0) {
      const sdk = SDK! as SDKContext;
      const blockTime = await sdk.oneRingSDK.getCurrentBlockTime();
      setStyle({
        "--value": 100,
      } as React.CSSProperties);
      return setCurrentBlockTime(moment(blockTime).unix());
    }

    setCurrentBlockTime((value) =>
      moment.unix(value).utc().add(1, "seconds").unix()
    );

    if (lastDeposit > 0 && redeemLockedUntil > 0 && currentBlockTime > 0) {
      setStyle({
        "--value":
          100 -
          getPercentage({
            startDate: lastDeposit,
            currentDate: currentBlockTime,
            endDate: redeemLockedUntil,
          }),
      } as React.CSSProperties);
    }
  }, [
    SDK,
    currentBlockTime,
    lastDeposit,
    redeemLockedUntil,
    setCurrentBlockTime,
  ]);

  useEffect(() => {
    if (
      selectedTab === TabType.Redeem.valueOf() &&
      SDK &&
      Object.keys(SDK).length > 0 &&
      lastDeposit > 0 &&
      redeemLockedUntil > 0
    ) {
      refreshCurrentBlockTime();
    }
  }, [SDK, selectedTab, lastDeposit, redeemLockedUntil]);

  useEffect(() => {
    if (
      selectedTab === TabType.Redeem.valueOf() &&
      SDK &&
      Object.keys(SDK).length > 0
    ) {
      const refreshInterval = setInterval(() => {
        refreshCurrentBlockTime();
      }, 1000); // 1 second
      return () => clearInterval(refreshInterval);
    }
  }, [SDK, currentBlockTime]);

  return (
    <BoxContent>
      <div className="redeem-tab flex flex-col gap-6 mb-10">
        <ModeSelect tabs={[TabType.Mint, TabType.Redeem]} />
      </div>

      <div className="mint-input redeem-input flex flex-col gap-1 mt-10">
        <div className="flex flex-row justify-between items-center px-1">
          <p className="text-skin-base font-inter text-[12px] sm:text-[14px]">
            From:
          </p>
          {isLoading && !disconnected && <Loading />}
          {!isLoading && !disconnected && (
            <p className="text-skin-base font-futuraPT text-[12px]">
              Balance: $
              {selectedTab === TabType.Mint
                ? truncate({ value: stableBalance })
                : truncate({ value: realmBalance })}
            </p>
          )}
        </div>
        <Input
          options={selectedTab === TabType.Mint.valueOf() ? ["USDC"] : ["1USD"]}
          type={InputType.From}
          max={getMaxValue()}
        />
      </div>

      <div className="flex flex-col w-full justify-center items-center pt-[25px] sm:pt-[40px] pb-[13px] sm:pb-[26px] opacity-80">
        <div className="relative w-[20px] h-[20px]">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-skin-base"
          >
            <path
              d="m12 20v-16m0 16l-7-7m7 7l7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity=".48"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-10">
        <p className="text-skin-base pl-1 font-inter text-[12px] sm:text-[14px]">
          To:
        </p>
        <Input
          options={selectedTab === TabType.Mint.valueOf() ? ["1USD"] : ["USDC"]}
          type={InputType.To}
          disabled
        />
      </div>

      {selectedTab === TabType.Mint.valueOf() && (
        <div className="flex flex-row justify-around items-start font-inter text-[14px] text-skin-base mt-5 mb-10 space-x-5 px-3">
          <svg
            className="fill-skin-base w-[28px] h-[28px] sm:w-[34px] sm:h-[34px]"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m12 6c-0.5523 0-1 0.44772-1 1s0.4477 1 1 1v-2zm0.01 2c0.5523 0 1-0.44772 1-1s-0.4477-1-1-1v2zm-2.01 2c-0.55228 0-1 0.4477-1 1s0.44772 1 1 1v-2zm2 1h1c0-0.5523-0.4477-1-1-1v1zm-1 5c0 0.5523 0.4477 1 1 1s1-0.4477 1-1h-2zm-1-1c-0.55228 0-1 0.4477-1 1s0.44772 1 1 1v-2zm4 2c0.5523 0 1-0.4477 1-1s-0.4477-1-1-1v2zm7-5c0 4.9706-4.0294 9-9 9v2c6.0751 0 11-4.9249 11-11h-2zm-9 9c-4.9706 0-9-4.0294-9-9h-2c0 6.0751 4.9249 11 11 11v-2zm-9-9c0-4.9706 4.0294-9 9-9v-2c-6.0751 0-11 4.9249-11 11h2zm9-9c4.9706 0 9 4.0294 9 9h2c0-6.0751-4.9249-11-11-11v2zm0 5h0.01v-2h-0.01v2zm-2 4h2v-2h-2v2zm1-1v5h2v-5h-2zm-1 6h4v-2h-4v2z" />
          </svg>

          <p className="flex flex-wrap text-[12px] sm:text-[14px]">
            All the mints issue $1USD in a 1:1 manner. You'll receive $1USD in
            your wallet.
          </p>
        </div>
      )}

      {selectedTab === TabType.Mint.valueOf() && (
        <div className="h-[1px] bg-skin-base/[0.3] mx-[12px] mb-4" />
      )}

      {selectedTab === TabType.Mint.valueOf() ? (
        <>
          <div className="flex flex-row font-inter justify-center items-start space-x-5 bg-skin-button-accent/[0.6] text-skin-accent sm:h-[78px] p-[16px] rounded-[8px] mb-[24px]">
            <div className="min-w-[20px] min-h-[20px] sm:min-w-[24px] sm:min-h-[24px] relative mt-[6px]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-skin-accent stroke-skin-accent/[0.1]"
              >
                <path d="M12.9999 9.00001C12.9999 8.44772 12.5522 8.00001 11.9999 8.00001C11.4476 8.00001 10.9999 8.44772 10.9999 9.00001H12.9999ZM10.9999 14C10.9999 14.5523 11.4476 15 11.9999 15C12.5522 15 12.9999 14.5523 12.9999 14H10.9999ZM12.9999 17.5C12.9999 16.9477 12.5522 16.5 11.9999 16.5C11.4476 16.5 10.9999 16.9477 10.9999 17.5H12.9999ZM10.9999 18C10.9999 18.5523 11.4476 19 11.9999 19C12.5522 19 12.9999 18.5523 12.9999 18H10.9999ZM2.23192 19.016L3.12314 19.4696L3.12329 19.4693L2.23192 19.016ZM10.3499 3.05201L11.2413 3.50528L11.2414 3.50506L10.3499 3.05201ZM13.6519 3.05201L12.7602 3.50455L12.7605 3.50524L13.6519 3.05201ZM21.7689 19.016L22.6609 18.564L22.6603 18.5628L21.7689 19.016ZM10.9999 9.00001V14H12.9999V9.00001H10.9999ZM10.9999 17.5V18H12.9999V17.5H10.9999ZM3.12329 19.4693L11.2413 3.50528L9.45855 2.59873L1.34055 18.5627L3.12329 19.4693ZM11.2414 3.50506C11.5841 2.83081 12.4189 2.832 12.7602 3.50455L14.5437 2.59946C13.461 0.466009 10.5418 0.467201 9.45843 2.59896L11.2414 3.50506ZM12.7605 3.50524L20.8775 19.4692L22.6603 18.5628L14.5433 2.59877L12.7605 3.50524ZM20.8769 19.468C21.2739 20.2514 20.6841 21 20.1159 21V23C22.4037 23 23.626 20.4686 22.6609 18.564L20.8769 19.468ZM20.1159 21H3.88292V23H20.1159V21ZM3.88292 21C3.31447 21 2.72549 20.2509 3.12314 19.4696L1.34069 18.5624C0.370342 20.4691 1.59736 23 3.88292 23V21Z" />
              </svg>
            </div>

            <p className="flex flex-wrap text-[12px] sm:text-[14px]">
              Remember to stake your $1USD in order to get your yield and claim
              your rewards.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 gap-3 sm:gap-0">
            <div className="mint-button flex w-full">
              <Button
                action={() => onMint()}
                disabled={
                  isLoading ||
                  disconnected ||
                  Number(inputValueTo) === 0 ||
                  Number(inputValueFrom) > stableBalance ||
                  Number(inputValueFrom) > 25_000
                }
                isLoading={isLoading && !disconnected}
              >
                Mint
              </Button>
            </div>
            <div className="mint-stake-button flex w-full">
              <Button
                action={() => onMintAndStake()}
                disabled={
                  isLoading ||
                  disconnected ||
                  Number(inputValueTo) === 0 ||
                  Number(inputValueFrom) > stableBalance ||
                  Number(inputValueFrom) > 25_000
                }
                isLoading={isLoading && !disconnected}
              >
                Mint & Stake
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row font-inter justify-center items-start space-x-5 bg-skin-fill-light  text-skin-accent sm:h-[90px] p-[16px] rounded-[8px] mb-[24px]">
            <div className="min-w-[18px] min-h-[18px] relative stroke-skin-accent mt-[5px]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-skin-accent stroke-skin-accent/[0.1]"
              >
                <path d="M12.9999 9.00001C12.9999 8.44772 12.5522 8.00001 11.9999 8.00001C11.4476 8.00001 10.9999 8.44772 10.9999 9.00001H12.9999ZM10.9999 14C10.9999 14.5523 11.4476 15 11.9999 15C12.5522 15 12.9999 14.5523 12.9999 14H10.9999ZM12.9999 17.5C12.9999 16.9477 12.5522 16.5 11.9999 16.5C11.4476 16.5 10.9999 16.9477 10.9999 17.5H12.9999ZM10.9999 18C10.9999 18.5523 11.4476 19 11.9999 19C12.5522 19 12.9999 18.5523 12.9999 18H10.9999ZM2.23192 19.016L3.12314 19.4696L3.12329 19.4693L2.23192 19.016ZM10.3499 3.05201L11.2413 3.50528L11.2414 3.50506L10.3499 3.05201ZM13.6519 3.05201L12.7602 3.50455L12.7605 3.50524L13.6519 3.05201ZM21.7689 19.016L22.6609 18.564L22.6603 18.5628L21.7689 19.016ZM10.9999 9.00001V14H12.9999V9.00001H10.9999ZM10.9999 17.5V18H12.9999V17.5H10.9999ZM3.12329 19.4693L11.2413 3.50528L9.45855 2.59873L1.34055 18.5627L3.12329 19.4693ZM11.2414 3.50506C11.5841 2.83081 12.4189 2.832 12.7602 3.50455L14.5437 2.59946C13.461 0.466009 10.5418 0.467201 9.45843 2.59896L11.2414 3.50506ZM12.7605 3.50524L20.8775 19.4692L22.6603 18.5628L14.5433 2.59877L12.7605 3.50524ZM20.8769 19.468C21.2739 20.2514 20.6841 21 20.1159 21V23C22.4037 23 23.626 20.4686 22.6609 18.564L20.8769 19.468ZM20.1159 21H3.88292V23H20.1159V21ZM3.88292 21C3.31447 21 2.72549 20.2509 3.12314 19.4696L1.34069 18.5624C0.370342 20.4691 1.59736 23 3.88292 23V21Z" />
              </svg>
            </div>

            <p className="inline flex-wrap text-[12px] sm:text-[14px]">
              A fee of approximately 0.5% is charged for redeeming 1USD. Please{" "}
              <Link href={nav[1].pages[0].asPath}>
                <a className="underline hover:opacity-[0.9]">stake</a>
              </Link>{" "}
              1USD to receive rewards.
            </p>
          </div>

          {((redeemLockedUntil > 0 &&
            moment.unix(redeemLockedUntil).valueOf() <=
              moment.unix(currentBlockTime).valueOf()) ||
            redeemLockedUntil === 0) && (
            <div className="redeem-button flex">
              <Button
                action={() => onRedeem()}
                disabled={
                  isLoading ||
                  disconnected ||
                  Number(inputValueTo) === 0 ||
                  Number(inputValueFrom) > realmBalance
                }
                isLoading={isLoading && !disconnected}
              >
                Redeem
              </Button>
            </div>
          )}

          {redeemLockedUntil > 0 &&
            moment.unix(redeemLockedUntil).valueOf() >
              moment.unix(currentBlockTime).valueOf() &&
            lastDeposit > 0 &&
            redeemLockedUntil > 0 &&
            currentBlockTime > 0 && (
              <div className="flex w-full justify-between items-center text-sm px-16">
                <span className="text-skin-base text-lg pr-2">
                  You can redeem in:
                </span>
                <div
                  className="relative radial-progress bg-skin-accent/[0.1] bg-opacity-[0.3] scale-125 text-skin-accent opacity-[0.8]"
                  style={style}
                >
                  <div className="absolute top-6 left-[15px] flex items-center space-2">
                    <div className="rounded-lg space-x-[2px] text-[13px]">
                      <div className="text-center">
                        {moment
                          .unix(redeemLockedUntil - currentBlockTime)
                          .utc()
                          .format("HH")}
                        :
                        {moment
                          .unix(redeemLockedUntil - currentBlockTime)
                          .utc()
                          .format("mm")}
                        :
                        {moment
                          .unix(redeemLockedUntil - currentBlockTime)
                          .utc()
                          .format("ss")}
                      </div>
                    </div>
                    <span
                      className="absolute top-5 left-[8px]
                       text-skin-base text-[16px]"
                    >
                      h:m:s
                    </span>
                  </div>
                </div>
              </div>
            )}
        </>
      )}

      <BlockModal
        buttonTitle="I understand"
        isOpen={warningIsOpen}
        clickAction={() => {
          setWarningIsOpen(!warningIsOpen);
          cleanFields();
        }}
      >
        <div className="flex flex-row font-inter justify-center items-start space-x-5 bg-skin-fill text-skin-base p-[16px] rounded-[8px] mb-[24px]">
          <div className="min-w-[20px] min-h-[20px] sm:min-w-[24px] sm:min-h-[24px] relative">
            <Image
              src="/warning.svg"
              alt="warning"
              layout="fill"
              placeholder="blur"
              blurDataURL="/warning.svg"
            />
          </div>
        </div>

        <p className="flex justify-center items-center w-full flex-wrap text-[14px] sm:text-[18px] pb-[24px]">
          Please, try with a smaller amount.
        </p>
      </BlockModal>
    </BoxContent>
  );
};

export default Mint;
