import { useEffect, useContext } from "react";
import { StateContext } from "../context/StateContext";
import DropdownToken from "./DropdownToken";
import { InputType } from "../utils/constants";

type Props = {
  options?: string[];
  max?: string;
  from?: boolean;
  type?: InputType;
  disabled?: boolean;
};

export default function Input({
  options = [],
  max,
  type,
  disabled = false,
}: Props) {
  const {
    inputValueFrom,
    setInputValueFrom,
    inputValueTo,
    setInputValueTo,
    inputValue,
    setInputValue,
    selectedTab,
  } = useContext(StateContext);

  const onInputChange = (value: string) => {
    // console.log(value);

    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      switch (type) {
        case InputType.From:
          setInputValueFrom(value);
          break;
        case InputType.To:
          setInputValueTo(value);
          break;
        default:
          setInputValue(value);
          break;
      }
    }

    return false;
  };

  function getValue() {
    switch (type) {
      case InputType.From:
        return inputValueFrom;
      case InputType.To:
        return inputValueTo;
      default:
        return inputValue;
    }
  }

  useEffect(() => {
    setInputValue("");
    setInputValueFrom("");
    setInputValueTo("");
  }, [setInputValueFrom, setInputValueTo, setInputValue, selectedTab]);

  return (
    <div className="relative max-h-[48px] w-full">
      <input
        className={`flex flex-row items-center w-full max-h-[48px] py-[12px] px-[16px] h-[48px] 
          shadow-buttonDisabled rounded-[8px] outline-0 text-[14px] sm:text-[16px] text-skin-base
          ${
            disabled
              ? "bg-skin-inverted placeholder-skin-base/[0.1] "
              : "bg-skin-body/[0.5] placeholder-skin-base/[0.3]"
          }`}
        type="text"
        placeholder="Set amount"
        value={getValue()}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={disabled}
      />

      <div className="flex flex-row items-center absolute top-[3.5px] right-[0px] sm:right-[5px]">
        {max && (
          <button
            onClick={() => onInputChange(max)}
            className="py-[1px] px-[8px] bg-skin-accent/[0.5] rounded-[16px] font-futuraPT text-[10px] sm:text-[12px] text-skin-base hover:opacity-75 mr-[-18px]"
          >
            MAX
          </button>
        )}
        <DropdownToken
          options={options}
          type={type}
          id={`dropdown-${type?.valueOf()}`}
        />
      </div>
    </div>
  );
}
