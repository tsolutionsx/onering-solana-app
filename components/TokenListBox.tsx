import Image from "next/image";
import React from "react";

import { ImageLoader } from "../utils/functions";

export default function TokenlistBox({ token, chooseToken }: any) {
  return (
    <div
      key={token.address}
      className="flex items-center justify-between py-1 cursor-pointer hover:bg-skin-inverted/[40%] px-2"
      onClick={() => chooseToken(token)}
    >
      <div className="flex items-center space-x-4">
        <Image
          loader={ImageLoader}
          src={token.logoURI ? token.logoURI : "/no-token.png"}
          alt={token.name}
          width={30}
          height={30}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <p className="text-skin-base">{token.symbol}</p>
          <p className="text-skin-base/[0.9] text-[12px]">{token.name}</p>
        </div>
      </div>
      {token.decimal && (
        <p className="text-skin-base/[0.9] text-[12px]">
          {(token.amount / 10 ** token.decimal).toFixed(token.decimal)}
        </p>
      )}
    </div>
  );
}
