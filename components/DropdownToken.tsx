import Image from "next/image";
import { useState, useContext, useEffect, useCallback } from "react";
import { StateContext } from "../context/StateContext";
import { tokens, InputType } from "../utils/constants";

type Props = {
  options: string[];
  type?: InputType;
  id: string;
};

export default function DropdownToken({ options = [], type, id }: Props) {
  const [tokenInfo, setTokenInfo] = useState<any>({});
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const {
    selectedTokenFrom,
    setSelectedTokenFrom,
    selectedTokenTo,
    setSelectedTokenTo,
  } = useContext(StateContext);

  const filterOptions = useCallback(() => {
    const opts = tokens.filter((token) =>
      options.find((e) => e === token.title)
    );

    setFilteredOptions(opts);
  }, [options]);

  const onSelect = useCallback(
    (option: any) => {
      if (option && type === InputType.From) {
        setSelectedTokenFrom(option.contract);
      }

      if (option && type === InputType.To) {
        setSelectedTokenTo(option.contract);
      }
    },
    [type, setSelectedTokenFrom, setSelectedTokenTo]
  );

  useEffect(() => {
    return filterOptions();
  }, [options, filterOptions]);

  useEffect(() => {
    if (selectedTokenFrom || selectedTokenTo) {
      let info = null;
      if (type === InputType.From) {
        info = tokens.find((item) => item.contract === selectedTokenFrom);
      }

      if (type === InputType.To) {
        info = tokens.find((item) => item.contract === selectedTokenTo);
      }

      return setTokenInfo(info);
    }
  }, [type, selectedTokenFrom, selectedTokenTo]);

  return (
    <div className="dropdown relative font-futuraPT">
      <button
        data-bs-toggle="dropdown"
        className="p-2 px-3 text-skin-base dropdown-toggle"
        disabled={filteredOptions.length === 1}
      >
        {tokenInfo && tokenInfo.title && (
          <div className="flex flex-row justify-end items-center gap-[1px] w-[100px] sm:gap-[3px] sm:w-[121px]">
            <div className="w-[1px] h-[24px] bg-skin-base mr-[10px] sm:mr-[18px]" />

            {tokenInfo.image !== "" && (
              <div className="relative w-[18px] h-[18px] mr-[3px] sm:w-[24px] sm:h-[24px] sm:mr-[6px]">
                <Image
                  src={tokenInfo.image}
                  alt="token"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL="/oneusd.svg"
                />
              </div>
            )}
            <span className="text-skin-base w-[40px] text-center text-[14px] sm:text-[16px]">
              {tokenInfo.title}
            </span>
          </div>
        )}
      </button>

      <div
        className={`
            dropdown-menu
            flex-col
            p-[16px]
            bg-skin-base
            shadow-dropdown
            w-[132px]
            rounded-[8px]
            backdrop-blur-[16px]
            z-40
            hidden
          `}
      >
        {filteredOptions.map((option, index) => (
          <button
            key={index}
            className={`
              flex
              flex-row
              items-center
              text-skin-base
              hover:text-skin-hover
              space-x-[10px]
              ${
                option === filteredOptions.slice(-1)[0] ? "mb-0" : "mb-[16px]"
              }`}
            onClick={() => onSelect(option)}
          >
            <div className="relative w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]">
              <Image
                src={option!.image}
                layout="fill"
                alt="option"
                placeholder="blur"
                blurDataURL={option!.image}
              />
            </div>
            <span className="ml-2">{option!.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
