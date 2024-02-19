import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Option = {
  href: string;
  title: string;
};

type Props = {
  title: string;
  options: Option[];
};

export default function DropdownLink({ title, options }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative">
      <Link href="#">
        <a
          className={`${
            isOpen ? "text-skin-accent" : "text-skin-base"
          } hover:text-skin-accent`}
          onClick={toggleDropdown}
        >
          <div className="flex flex-row gap-[13px]">
            {title}
            <div className="relative w-[25px] h-[25px]">
              <Image
                layout="fill"
                src={isOpen ? "/chevron-up.svg" : "/chevron-down.svg"}
                alt={`${isOpen ? "dropdown open" : "dropwdown closed"}`}
              />
            </div>
          </div>
        </a>
      </Link>

      <div
        className={`
            ${isOpen === true ? "flex" : "hidden"}
            flex-col
            absolute 
            top-[30px] left-0
            p-[16px]
            bg-skin-inverted
            shadow-innerbox
            w-[196px]
            rounded-[8px]
            backdrop-blur-16px
          `}
      >
        {options.map((item, index) => (
          <Link href={item.href} key={index}>
            <a
              className={`text-skin-base hover:text-skin-accent ${
                item === options.slice(-1)[0] ? "mb-0" : "mb-[16px]"
              }`}
              onClick={toggleDropdown}
              target="blank"
            >
              {item.title}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
