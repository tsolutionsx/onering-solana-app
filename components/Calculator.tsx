import { useContext, useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { StateContext } from "../context/StateContext";
import Image from "next/image";
import truncate from "../utils/truncate";
import { DecimalsType } from "../utils/constants";

type Props = {
  isMobile?: boolean;
};

const enum ValueType {
  Amount,
  Apy,
  Withdrawal,
  Redemption,
}

export default function Calculator({ isMobile = false }: Props) {
  const { redeemFee, disconnected, currentApy } = useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [breakeven, setBreakeven] = useState(0);
  const [earnings, setEarnings] = useState(0);

  const onInputChange = (value: string, type: ValueType) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      switch (type) {
        case ValueType.Amount:
          setAmount(value);
          break;
      }
    }

    return false;
  };

  const ref = useDetectClickOutside({ onTriggered: () => setIsOpen(false) });

  useEffect(() => {
    const amountValue = amount === "" ? 0 : Number(amount);
    const apyValue = currentApy;
    const annualEarnings = amountValue * (apyValue / 100);
    const fees = (redeemFee + 0.2) / 100;
    const breakevenTime = ((amountValue * fees) / annualEarnings) * 365;

    setBreakeven(
      isNaN(breakeven) ? 0 : Number.isFinite(breakevenTime) ? breakevenTime : 0
    );
    setEarnings(isNaN(annualEarnings) ? 0 : annualEarnings);
  }, [amount, redeemFee]);

  return (
    <div className="calculator relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center gap-2"
      >
        <svg
          className="w-[32px] h-[32px] stroke-skin-base hover:stroke-skin-accent"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute bg-skin-inverted backdrop-blur-[36px] border-[2px] border-skin-base/[0.1] shadow-2xl rounded-[8px] top-[53px] ${
            disconnected ? "left-[-50px]" : "left-0"
          } transition-all duration-500 ease-in-out`}
        >
          <div className="flex flex-col w-[340px] p-[24px]  relative">
            <div className="flex flex-row justify-between items-center text-skin-base">
              <span className="text-[18px]">Calculator</span>
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
            <div className="flex flex-col justify-center rounded-xl w-full h-[100px] mt-4 shadow-internal bg-skin-base/[0.1] px-4 py-2">
              <div className="text-xl text-skin-base">
                Breakeven Time: {breakeven.toFixed(1)} days
              </div>
              <div className="text-sm text-skin-base/[70%]">
                Annual Earnings: {earnings.toFixed(5)} $1USD
              </div>
            </div>
            <div className="pt-6 space-y-4">
              <div className="flex flex-row justify-start items-center space-x-3">
                <input
                  className="bg-skin-body shadow-internal placeholder-skin-base/[0.3] text-skin-base w-30 rounded-md px-2 py-2 text-sm outline-none"
                  type="text"
                  placeholder="1USD amount"
                  value={amount}
                  onChange={(e) =>
                    onInputChange(e.target.value, ValueType.Amount)
                  }
                />
                <span className="text-[12px] text-skin-base">1USD amount</span>
              </div>

              <div className="flex flex-row justify-start items-center space-x-3">
                <input
                  className="shadow-internal bg-skin-inverted placeholder-skin-base/[0.3] text-skin-base w-30 rounded-md px-2 py-2 text-sm outline-none"
                  type="text"
                  placeholder={truncate({
                    value: currentApy,
                    decimals: DecimalsType.two,
                  })}
                  value={truncate({
                    value: currentApy,
                    decimals: DecimalsType.two,
                  })}
                  disabled
                />
                <span className="text-[12px] text-skin-base">APY %</span>
              </div>

              <div className="flex flex-row justify-start items-center space-x-2">
                <input
                  className="shadow-internal bg-skin-inverted placeholder-skin-base/[0.5] text-skin-base w-12 rounded-md px-2 py-2 text-sm outline-none"
                  type="text"
                  placeholder="0.0"
                  value={redeemFee + 0.2}
                  disabled
                />
                <span className="text-[12px] text-skin-base">
                  Withdrawal Fee %
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
