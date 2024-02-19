import { useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { ChartType } from "../utils/constants";

type Props = {
  label: string;
  selected: ChartType;
  setSelected: any;
  options: ChartType[];
};

export default function DropdownChart({
  selected,
  setSelected,
  options,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: () => setIsOpen(false) });

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function setOption(option: ChartType) {
    setSelected(option);
    setIsOpen(false);
  }

  const chevronDown = (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[25px] h-[25px]"
    >
      <path
        d="m8 10 4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );

  const chevronUp = (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[25px] h-[25px]"
    >
      <path
        d="m8 14 4-4 4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );

  useEffect(() => {
    setSelected(selected);
    setIsOpen(false);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* <p className="font-inter font-bold text-[14px] mr-2 text-end">{label}</p> */}
      <button
        className={`
          shadow-xl
          stroke-skin-base
          py-1 px-3 rounded-[8px]
          w-[128px]
          text-sm
          border-[1px]
          border-skin-inverted
          
          ${
            isOpen
              ? "bg-skin-accent stroke-skin-inverted text-skin-inverted"
              : "border-skin-body text-skin-base hover:bg-skin-accent hover:text-skin-inverted hover:stroke-skin-inverted"
          }
        `}
        onClick={toggleDropdown}
      >
        <div className="flex flex-row justify-evenly items-center">
          <span>{selected.valueOf()}</span>
          <div className="flex flex-1"></div>
          {isOpen ? chevronUp : chevronDown}
        </div>
      </button>

      <div
        className={`
            ${isOpen === true ? "flex" : "hidden"}
            flex-col
            absolute 
            top-[50px] left-0
            bg-skin-inverted
            shadow-lightDropdown
            w-[128px]
            rounded-[8px]
            backdrop-blur-16px
            py-[10px]
            border-2 border-skin-inverted 
            text-sm
          `}
      >
        {options.map((item, index) => (
          <button
            key={index}
            className={`text-skin-base hover:bg-skin-accent hover:text-skin-inverted text-start px-[16px] py-2 ${
              item === options.slice(-1)[0] ? "mb-0" : "mb-[10px]"
            }`}
            onClick={() => setOption(item)}
          >
            {item.valueOf()}
          </button>
        ))}
      </div>
    </div>
  );
}
