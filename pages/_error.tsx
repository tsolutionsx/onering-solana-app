import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import BoxContent from "../components/BoxContent";

const NotFound: NextPage = () => {
  return (
    <BoxContent>
      <div className="flex flex-col justify-center items-center w-auto h-96 font-futuraPT text-xl text-light gap-3 bg-darker rounded-full shadow-internal">
        <div className="relative w-[48px] h-[48px]">
          <Image src="/warning.svg" layout="fill" alt="warning" />
        </div>
        <span className="mb-[20px]">404: Page Not Found</span>
        <Link href="/">
          <a className="text-solanagreen hover:underline">Go back home</a>
        </Link>
      </div>
    </BoxContent>
  );
};

export default NotFound;
