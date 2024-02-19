import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function BoxContent({ children }: Props) {
  return (
    <div
      className={`
        flex flex-col w-full h-full justify-center items-center shadow-default
        bg-gradient-to-tr from-skin-gradient1 to-skin-gradient2 rounded-[32px] text-skin-base self-center
        p-[2px]
        sm:w-[448px]
        bg-opacity-80
      `}
    >
      <div
        className="
          flex flex-col w-full h-[100%] 
          bg-skin-inverted/95
          rounded-[30px] text-base self-center px-[24px]
          py-[30px]"
      >
        {children}
      </div>
    </div>
  );
}

export function FlexBoxContent({ children }: Props) {
  return (
    <div
      className="w-full
       rounded-[32px] p-[2px] self-center
       bg-gradient-to-tr from-skin-gradient1 to-skin-gradient2 backdrop-blur-[20px]
    "
    >
      <div
        className="
          flex flex-col w-full h-[100%] 
          bg-skin-inverted/95
          rounded-[30px] self-center px-[24px]
          py-[30px] text-skin-base font-futuraPT"
      >
        {children}
      </div>
    </div>
  );
}

export function CustomBoxContent({ children }: Props) {
  return (
    <div className="flex flex-col w-full shadow-default bg-dark rounded-[32px] p-[24px] text-white self-center px-[24px] py-[30px] group">
      {children}
    </div>
  );
}
