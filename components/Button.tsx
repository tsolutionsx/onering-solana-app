import React, { ReactNode } from "react";

import Loading from "../components/Loading";

type Props = {
  children?: ReactNode;
  action: Function;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function Button({
  children,
  action,
  disabled = false,
  isLoading = false,
}: Props) {
  return (
    <button
      onClick={() => action()}
      className={`
        flex 
        justify-center 
        items-center 
        w-full 
        px-[24px] 
        py-[8px] 
        h-[40px]
        text-skin-inverted
        ${
          disabled &&
          "shadow-buttonDisabled cursor-not-allowed bg-skin-button-accent/[0.3]  text-skin-base/[0.2]"
        }
        font-futuraPT 
        line-[24px] 
        font-[16px] 
        rounded-[8px]
        ${
          !disabled &&
          // "bg-solanagreen hover:bg-gradient-to-b from-buttonFrom to-buttonTo"
          "bg-skin-accent hover:bg-gradient-to-r hover:from-skin-gradient3 hover:to-skin-gradient4 shadow-xl"
        }
      `}
      disabled={disabled}
    >
      {isLoading ? <Loading /> : children}
    </button>
  );
}
