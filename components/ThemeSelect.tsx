import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Theme } from "../utils/constants";
import { StateContext } from "../context/StateContext";

const light = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 stroke-skin-base hover:stroke-skin-accent"
    width="24"
    height="24"
  >
    <path
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      fill="none"
      strokeWidth="2px"
    ></path>
    <path
      d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
      fill="none"
      strokeWidth="2px"
    ></path>
  </svg>
);

const system = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6 stroke-skin-base"
    width="24"
    height="24"
  >
    <path
      d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
      strokeWidth="2px"
      strokeLinejoin="round"
      fillOpacity="0.2"
      fill="#38BDF8"
    ></path>
    <path
      d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
      strokeWidth="2px"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    ></path>
  </svg>
);

const dark = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6 fill-skin-base hover:fill-skin-accent"
    width="24"
    height="24"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
      className="fill-transparent"
      fillOpacity="0"
      fill="#000000"
    ></path>
    <path d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
    ></path>
  </svg>
);

const solana = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    viewBox="0 0 128 128"
    className="w-6 h-6 fill-skin-base hover:fill-skin-accent"
  >
    <path d="M93.94 42.63H13.78l20.28-20.22h80.16L93.94 42.63zM93.94 105.59H13.78l20.28-20.21h80.16M34.06 74.11h80.16L93.94 53.89H13.78" />
  </svg>
);

export default function ThemeSelect() {
  const { theme, setTheme } = useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false);
  const [options, _] = useState<{ image: React.ReactElement; theme: Theme }[]>([
    { image: light, theme: Theme.light },
    { image: dark, theme: Theme.dark },
    { image: solana, theme: Theme.solana },
  ]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  const ref = useDetectClickOutside({ onTriggered: closeDropdown });

  const changeTheme = useCallback(
    (selectedTheme: Theme) => {
      setTheme(selectedTheme);
      localStorage.setItem("theme", selectedTheme);
      document.documentElement.classList.remove("dark");

      switch (selectedTheme) {
        case Theme.light:
          document.documentElement.classList.remove("dark");
          break;
        case Theme.dark:
          document.documentElement.classList.add("dark");
          break;
        case Theme.solana:
          document.documentElement.classList.add("dark");
          break;
      }

      setIsOpen(false);
    },
    [setTheme]
  );

  useEffect(() => {
    document.documentElement.lang = "en-us";

    switch (localStorage.theme as Theme) {
      case Theme.light:
        changeTheme(Theme.light);
        break;
      case Theme.dark:
        changeTheme(Theme.dark);
        break;
      case Theme.solana:
        changeTheme(Theme.solana);
        break;
      default:
        changeTheme(Theme.light);
        break;
    }
  }, [changeTheme]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggleDropdown}>
        <div className="flex flex-row gap-[13px]">
          <div className="relative w-[24px] h-[24px]">
            {options.find((option) => option.theme === theme)?.image}
          </div>
        </div>
      </button>

      <div
        className={`
            ${isOpen === true ? "flex" : "hidden"}
            flex-col
            absolute 
            top-[55px] right-0
            py-[16px]
            bg-skin-inverted
            border-skin-base/[0.1]
            
            w-[196px]
            rounded-[8px]
            backdrop-blur-16px
            shadow-2xl
            space-y-2
            z-30
            border-[2px]
          `}
      >
        {options.map((item, index) => (
          <button
            onClick={() => changeTheme(item.theme)}
            key={index}
            className={`flex flex-row items-center gap-3 px-2 py-1 leading-12 hover:bg-skin-accent/[0.75]`}
          >
            <div
              className={`${
                item.theme === Theme.solana && "p-[2px]"
              } w-[24px] h-[24px]`}
            >
              {item.image}
            </div>
            <span
              className={`${
                item.theme === theme ? "text-skin-accent" : "text-skin-base"
              }`}
            >
              {item.theme.valueOf()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
