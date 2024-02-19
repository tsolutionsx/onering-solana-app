import { stats, mint, swap, stake, info, book } from "./svgs";
export const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

export const LINKS = {
  address: `https://explorer.solana.com/address/${process.env.NEXT_PUBLIC_1USD_MINT_ADDRESS}`,
};

export const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

export const RECEIPT_SABER_USDH_USDC =
  "8KX1kALnWPJ6PA7UVbsCVJ1iLvjUM2qctRnZgJQWCZMs";
export const RECEIPT_SABER_PAI_USDC =
  "4CnQZpdTm5vVKXTLvTZKd2CLK1qNF4sfVSN5H3ixp5Am";

export const enum InputType {
  From,
  To,
  SecondaryFrom,
  SecondaryTo,
}

export const enum TabType {
  Mint = "mint",
  Redeem = "redeem",
  Stake = "stake",
  Withdraw = "unstake",
}

export const enum ChartType {
  Minted = "1USD Minted",
  Staked = "1USD Staked",
  APY = "APY",
  Distribution = "Distribution",
}

export const enum DecimalsType {
  two = 2,
  six = 6,
}

export const enum ChartDays {
  seven = 7,
  fifteen = 15,
  thirdy = 30,
}

export const enum Theme {
  light = "light",
  dark = "dark",
  solana = "solana",
}

export const enum Tour {
  closed = "closed",
  begin = "begin",
  presenting = "presenting",
  end = "end",
  finished = "finished",
}

export const tokens = [
  {
    title: "USDC",
    image: "/usdc.svg",
    contract: process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS,
  },
  {
    title: "USDT",
    image: "/usdt.svg",
    contract: process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS,
  },
  {
    title: "1USD",
    image: "/oneusd.svg",
    contract: process.env.NEXT_PUBLIC_1USD_MINT_ADDRESS,
  },
  { title: "RING", image: "/logo.svg", contract: null },
  { title: "RING-XYZ", image: "/logo.svg", contract: null },
];

export const tabs = ["mint", "redeem", "stake", "unstake"];

export const nav: {
  title: string;
  pathname: string;
  collateral?: string;
  image: any;
  pages: {
    asPath: string;
    tab?: string;
    query?: any;
    target?: string;
  }[];
  class?: string;
}[] = [
  {
    title: "Stats",
    pathname: "/stats",
    image: stats,
    pages: [
      {
        asPath: `/stats`,
        query: {},
      },
    ],
  },
  {
    title: "Mint",
    pathname: "/mint/[tab]",
    collateral: tokens[2].contract as string,
    image: mint,
    pages: [
      {
        asPath: `/mint/${tabs[0]}?from=${tokens[0].contract}`,
        tab: tabs[0],
        query: {
          from: tokens[0].contract,
        },
      },
      {
        asPath: `/mint/${tabs[0]}?from=${tokens[1].contract}`,
        tab: tabs[0],
        query: {
          from: tokens[1].contract,
        },
      },

      {
        asPath: `/mint/${tabs[1]}?to=${tokens[0].contract}`,
        tab: tabs[1],
        query: {
          to: tokens[0].contract,
        },
      },

      {
        asPath: `/mint/${tabs[1]}?to=${tokens[1].contract}`,
        tab: tabs[1],
        query: {
          to: tokens[1].contract,
        },
      },
    ],
    class: "mint",
  },
  {
    title: "Stake",
    pathname: "/stake/[tab]",
    collateral: tokens[2].contract as string,
    image: stake,
    pages: [
      {
        asPath: `/stake/${tabs[2]}`,
        tab: tabs[2],
        query: {},
      },
      {
        asPath: `/stake/${tabs[3]}`,
        tab: tabs[3],
        query: {},
      },
    ],
  },
  {
    title: "Swap",
    pathname: "/swap",
    image: swap,
    pages: [
      {
        asPath: `/swap`,
        query: {},
      },
    ],
  },
  {
    title: "FAQ",
    pathname: "/faq",
    image: info,
    pages: [
      {
        asPath: `/faq`,
        query: {},
      },
    ],
  },
  {
    title: "Guide",
    pathname: "/guide",
    image: book,
    pages: [
      {
        asPath: `https://medium.com/oneringfinance/introducing-onering-solana-4b46c6399419`,
        query: {},
        target: "blank",
      },
    ],
    class: "guide",
  },
];
