import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Button from "../components/Button";

type Props = {
  children?: any;
  buttonTitle: string;
  isOpen: boolean;
  clickAction: any;
};

export default function BlockModal({
  children,
  buttonTitle,
  isOpen,
  clickAction,
}: Props) {
  const onConfirm = useCallback(() => {
    clickAction();
  }, [clickAction]);

  return isOpen ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-black bg-opacity-20 flex flex-col items-center justify-center backdrop-blur-[16px] transition-opacity">
      <div className="w-[320px] sm:w-[400px] sm:mt-[-250px] bg-darker p-[24px] rounded-xl shadow-default">
        {children}
        <Button action={() => onConfirm()}>{buttonTitle}</Button>
      </div>
    </div>
  ) : (
    <></>
  );
}
