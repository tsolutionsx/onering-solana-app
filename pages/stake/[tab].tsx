import { useContext, useCallback } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import type { SDKContext } from "../../helpers/sdk";
import BoxContent from "../../components/BoxContent";
import Button from "../../components/Button";
import ModeSelect from "../../components/ModeSelect";
import Input from "../../components/Input";
import { StateContext } from "../../context/StateContext";
import { DecimalsType, InputType, TabType } from "../../utils/constants";
import Loading from "../../components/Loading";
import { stake, unstake } from "../../helpers/sdk";
import truncate from "../../utils/truncate";

const Stake: NextPage = () => {
  const {
    selectedTab,
    disconnected,
    realmBalance,
    rewards,
    isLoading,
    SDK,
    inputValueFrom,
    apy,
    setIsLoading,
    setShouldUpdateBalance,
    setInputValueFrom,
  } = useContext(StateContext);

  const cleanFields = useCallback(() => {
    setInputValueFrom("");
  }, [setInputValueFrom]);

  const getMaxValue = () => {
    if (disconnected) return "";

    switch (selectedTab) {
      case TabType.Stake.valueOf():
        if (realmBalance)
          return truncate({ value: realmBalance, decimals: DecimalsType.six });
        return "";
      case TabType.Withdraw.valueOf():
        if (rewards)
          return truncate({ value: rewards, decimals: DecimalsType.six });
        return "";
      default:
        return "";
    }
  };

  const onStake = useCallback(async () => {
    await stake({
      SDK: SDK! as SDKContext,
      amount: Number(inputValueFrom),
      setIsLoading: setIsLoading,
    });

    setShouldUpdateBalance(true);
    cleanFields();
  }, [inputValueFrom, SDK, cleanFields, setIsLoading, setShouldUpdateBalance]);

  const onUnstake = useCallback(async () => {
    await unstake({
      SDK: SDK! as SDKContext,
      amount: Number(inputValueFrom),
      setIsLoading: setIsLoading,
    });

    setShouldUpdateBalance(true);
    cleanFields();
  }, [inputValueFrom, SDK, cleanFields, setIsLoading, setShouldUpdateBalance]);

  return (
    <BoxContent>
      <div className="flex flex-col gap-6 mb-10">
        <ModeSelect tabs={[TabType.Stake, TabType.Withdraw]} />
      </div>

      {selectedTab === TabType.Stake ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-skin-base font-futuraPT text-[24px]">
            Stake $1USD
          </h1>
          <h3 className="text-skin-accent font-inter text-[14px]">
            Earn Yield
          </h3>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-skin-base font-futuraPT text-[24px]">
            Unstake $1USD
          </h1>
          {/* <div className="flex flex-row justify-around items-start font-inter text-[14px] text-skin-base mt-5 space-x-5 px-3 hidden">
            <div className="min-w-[24px] min-h-[24px] relative">
              <Image
                src="/info.svg"
                alt="info"
                layout="fill"
                placeholder="blur"
                blurDataURL="/info.svg"
              />
            </div>

            <p className="flex flex-wrap">
              You will need to wait 7 days to validate your unstake, this is
              done to make sure the funds are removed safely. This also protects
              us from malicious behavior in the network. New unstake requests
              will reset the count.
            </p>
          </div> */}
        </div>
      )}

      <div className="flex flex-col gap-1 mt-10 mb-5">
        <div className="flex flex-row justify-between items-center font-inter px-1 pb-1 h-[18px]">
          {!disconnected && (
            <>
              <p className="text-skin-base text-[12px] sm:text-[14px]">
                Available to{" "}
                {selectedTab === TabType.Stake ? "stake" : "unstake"}:
              </p>

              {isLoading ? (
                <Loading />
              ) : (
                <p className="text-skin-base text-[12px] sm:text-[14px]">
                  {selectedTab === TabType.Stake.valueOf()
                    ? truncate({ value: realmBalance })
                    : truncate({ value: rewards })}
                  {" $1USD"}
                </p>
              )}
            </>
          )}
        </div>

        <Input options={["1USD"]} type={InputType.From} max={getMaxValue()} />
      </div>

      {/* {selectedTab === TabType.Stake && (
        <div className="flex flex-row justify-between items-center font-inter text-[12px] sm:text-[14px] pt-[40px] pb-[24px] px-1">
          <p className="text-dark dark:text-light/[48%]">Average APY:</p>
          {isLoading ? (
            <Loading />
          ) : (
            <p className="text-dark dark:text-light">{truncate({ value: apy })}%</p>
          )}
        </div>
      )} */}

      {selectedTab === TabType.Stake ? (
        <Button
          action={() => onStake()}
          disabled={
            isLoading ||
            disconnected ||
            Number(inputValueFrom) === 0 ||
            Number(inputValueFrom) > realmBalance
          }
          isLoading={isLoading}
        >
          Stake
        </Button>
      ) : (
        <>
          <div className="flex flex-row font-inter justify-center items-start space-x-5 text-skin-accent sm:h-[90px] p-[16px] rounded-[8px] mb-[24px]">
            <div className="min-w-[20px] min-h-[20px] sm:min-w-[24px] sm:min-h-[24px] relative mt-[5px]">
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
              If you unstake your $1USD you won't get any yields generated or
              rewards with your stablecoin mints.
            </p>
          </div>

          <Button
            action={() => onUnstake()}
            disabled={
              isLoading ||
              disconnected ||
              Number(inputValueFrom) === 0 ||
              Number(inputValueFrom) > rewards
            }
            isLoading={isLoading}
          >
            Unstake
          </Button>
        </>
      )}
    </BoxContent>
  );
};

export default Stake;
