import React from "react";

interface ChildreProps {
  children?: React.ReactNode;
}

const Modal = ({ children }: ChildreProps) => {
  return (
    <>
      <div className="fixed top-0 left-0 bottom-0 right-0 w-full h-screen z-50 overflow-hidden bg-skin-base bg-opacity-20 backdrop-blur-[4px]">
        <div className="relative top-16 flex justify-center max-h-[900px]">
          <div className="transition duration-500 ease-in-out w-[320px] sm:w-[400px] bg-skin-inverted p-[24px] rounded-3xl shadow-default">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
