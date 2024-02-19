import {
  useState,
  createContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";
import {
  nav,
  TabType,
  tokens,
  ChartDays,
  Theme,
  Tour,
} from "../utils/constants";
import type { SDKContext } from "../helpers/sdk";
import { initialize, fetchUserData } from "../helpers/sdk";
import type { supplyHistoryItem, apyHistoryItem } from "../utils/types";
import stats from "../pages/api/stats";

export const StateContext = createContext({
  inputValueFrom: "",
  setInputValueFrom: (value: string) => {},

  inputValueTo: "",
  setInputValueTo: (value: string) => {},

  inputValue: "",
  setInputValue: (value: string) => {},

  selectedTab: "",
  setSelectedTab: (value: string) => {},

  disconnected: false,
  setDisconnected: (value: boolean) => {},

  selectedTokenFrom: "",
  setSelectedTokenFrom: (value: string) => {},

  selectedTokenTo: "",
  setSelectedTokenTo: (value: string) => {},

  stableBalance: 0,
  setStableBalance: (value: number) => {},

  realmBalance: 0,
  setRealmBalance: (value: number) => {},

  rewards: 0,
  setRewards: (value: number) => {},

  redeemFee: 0,
  setRedeemFee: (value: number) => {},

  apy: 0,
  setApy: (value: number) => {},

  lastDeposit: 0,
  setLastDeposit: (value: number) => {},

  redeemLockedUntil: 0,
  setRedeemLockedUntil: (value: number) => {},

  SDK: {},
  setSDK: (value: SDKContext) => {},

  isLoading: false,
  setIsLoading: (value: boolean) => {},

  shouldUpdateBalance: false,
  setShouldUpdateBalance: (value: boolean) => {},

  totalStaked: 0,
  setTotalStaked: (value: number) => {},

  totalSupply: 0,
  setTotalSupply: (value: number) => {},

  supplyHistory: [],
  setSupplyHistory: (value: []) => {},

  apyHistory: [],
  setApyHistory: (value: []) => {},

  totalRevenue: 0,
  setTotalRevenue: (value: number) => {},

  totalYield: 0,
  setTotalYield: (value: number) => {},

  currentApy: 0,
  setCurrentApy: (value: number) => {},

  chartDaysSelected: ChartDays.seven,
  setChartDaysSelected: (value: ChartDays) => {},

  theme: Theme.light,
  setTheme: (value: Theme) => {},

  showTour: Tour.closed,
  setShowTour: (value: Tour) => {},
});

type Props = {
  children?: ReactNode;
};

export const StateProvider = ({ children }: Props) => {
  const [inputValueFrom, setInputValueFrom] = useState("");
  const [inputValueTo, setInputValueTo] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [disconnected, setDisconnected] = useState(true);
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedTokenFrom, setSelectedTokenFrom] = useState("");
  const [selectedTokenTo, setSelectedTokenTo] = useState("");
  const [stableBalance, setStableBalance] = useState(0);
  const [realmBalance, setRealmBalance] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [redeemFee, setRedeemFee] = useState(0);
  const [apy, setApy] = useState(0);
  const [lastDeposit, setLastDeposit] = useState(0);
  const [redeemLockedUntil, setRedeemLockedUntil] = useState(0);
  const [SDK, setSDK] = useState<Partial<SDKContext>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [shouldUpdateBalance, setShouldUpdateBalance] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [supplyHistory, setSupplyHistory] = useState([]);
  const [apyHistory, setApyHistory] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalYield, setTotalYield] = useState<number>(0);
  const [currentApy, setCurrentApy] = useState(0);
  const [chartDaysSelected, setChartDaysSelected] = useState<ChartDays>(
    ChartDays.seven
  );
  const [theme, setTheme] = useState(Theme.light);
  const [showTour, setShowTour] = useState(Tour.closed);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();
  const router = useRouter();

  const initializeSDK = useCallback(
    async ({ token }: any) => {
      const sdk = await initialize({
        wallet: wallet,
        sendTransaction: sendTransaction,
        connection: connection,
        setIsLoading: setIsLoading,
        token: token,
      });

      if (sdk) {
        setSDK({
          oneRingSDK: sdk.oneRingSDK,
          realmWrapper: sdk.realmWrapper,
          poolWrapper: sdk.poolWrapper,
          vaultWrapper: sdk.vaultWrapper,
          userWrapper: sdk.userWrapper,
          connection: sdk.connection,
        });

        setStableBalance(sdk.balance as number);
        setRealmBalance(sdk.realmBalance as number);
        setRewards(sdk.rewards as number);
        setRedeemFee(sdk.redeemFee as number);
        setApy(sdk.apy as number);
        setLastDeposit(sdk.lastDeposit as number);
        setRedeemLockedUntil(sdk.redeemLockedUntil as number);
        setTotalStaked(sdk.totalStaked);
        setTotalSupply(sdk.totalSupply);
      }

      if ((sdk?.balance as number) > 0) return setIsLoading(false);

      setTimeout(() => {
        setInitialized(true);
        setIsLoading(false);
      }, 2000);
    },
    [connection, wallet, publicKey, setSDK]
  );

  const updateBalance = useCallback(async () => {
    setIsLoading(true);

    try {
      if (SDK.userWrapper) {
        if (router.pathname === "/mint/[tab]" && selectedTab === TabType.Mint) {
          const tokenBanlance = await SDK.userWrapper.getTokenBalance(
            new PublicKey(selectedTokenFrom as string)
          );
          setStableBalance(tokenBanlance);
        }

        const realmTokenBalance = await SDK.userWrapper.getTokenBalance(
          new PublicKey(process.env.NEXT_PUBLIC_1USD_MINT_ADDRESS as string)
        );

        if (SDK.realmWrapper && SDK.poolWrapper) {
          const realmData = await SDK.realmWrapper.fetchRealm();
          const poolData = await SDK.poolWrapper.fetchPool();

          const totalStaked =
            poolData.totalLpUiAmount * poolData.lpIndexBasisPoints;

          const depositReceiptData = await SDK.userWrapper.fetchDepositReceipt(
            SDK.realmWrapper
          );

          const redeemLockedUntil =
            (depositReceiptData?.lastDepositTs as number) +
            realmData.redemptionDelay;

          const stakeReceiptData = await SDK.userWrapper.fetchStakeReceipt(
            SDK.realmWrapper,
            SDK.poolWrapper
          );

          const rewardsBalance = stakeReceiptData
            ? stakeReceiptData.rewardUiAmount
            : 0;

          setRealmBalance(realmTokenBalance as number);
          setRewards(rewardsBalance as number);
          setRedeemFee((realmData.redemptionFeeBasisPoints * 100) as number);
          setApy((poolData.apyBasisPoints * 100) as number);
          setLastDeposit(depositReceiptData?.lastDepositTs as number);
          setRedeemLockedUntil(redeemLockedUntil);
          setTotalStaked(totalStaked);
          setTotalSupply(realmData.collatTotalSupply);
        }
      }

      setShouldUpdateBalance(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }, [SDK, setStableBalance]);

  useEffect(() => {
    setDisconnected(!publicKey);
  }, [publicKey, setDisconnected]);

  useEffect(() => {
    if (shouldUpdateBalance) {
      updateBalance();
    }
  }, [shouldUpdateBalance]);

  const checkNavigation = useCallback(() => {
    if (router.pathname !== "/" && router.isReady) {
      const path = nav.find((item) => router.pathname === item.pathname);

      if (path) {
        const page = path.pages.find((page) => page.asPath === router.asPath);

        if (!page) router.push(path.pages[0].asPath);

        if (page && page?.tab) {
          setSelectedTab(page.tab as string);
        }

        if (router.query.from && !router.query.to) {
          setSelectedTokenFrom(router.query.from as string);
          setSelectedTokenTo(path.collateral as string);
        }

        if (!router.query.from && router.query.to) {
          setSelectedTokenFrom(path.collateral as string);
          setSelectedTokenTo(router.query.to as string);
        }

        if (!router.query.from && !router.query.to) {
          setSelectedTokenFrom(path.collateral as string);
        }
      }
    }
  }, [router, nav]);

  useEffect(() => {
    checkNavigation();
  }, [router]);

  const updateURL = useCallback(() => {
    let newQuery: any = { ...router.query };

    if (router.query.from) newQuery.from = selectedTokenFrom;
    if (router.query.to) newQuery.to = selectedTokenTo;

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  }, [router, nav, selectedTab, selectedTokenFrom, selectedTokenTo]);

  useEffect(() => {
    if (
      (selectedTokenFrom && selectedTokenFrom !== router.query.from) ||
      (selectedTokenTo && selectedTokenTo !== router.query.to)
    ) {
      updateURL();
    }

    // if (
    //   (selectedTokenFrom && selectedTokenFrom !== router.query.from) ||
    //   (selectedTokenTo && selectedTokenTo !== router.query.to)
    // ) {
    //   const token =
    //     selectedTab === TabType.Mint.valueOf() ||
    //     selectedTab === TabType.Redeem.valueOf()
    //       ? router.query.from
    //         ? selectedTokenFrom
    //         : selectedTokenTo
    //       : tokens[0].contract;

    //   initializeSDK({
    //     token,
    //   });
    // }
  }, [selectedTokenFrom, selectedTokenTo, wallet.connected]);

  const updateURLByTab = useCallback(() => {
    const path = nav.find((item) => item.pathname === router.pathname);

    if (path) {
      const page = path.pages.find((page) => page.asPath === router.asPath);

      if (selectedTab && selectedTab !== page?.tab) {
        const newPage = path.pages.find((page) => page.tab === selectedTab);
        router.push(newPage?.asPath || "/", undefined, { shallow: true });
      }
    }
  }, [router, selectedTab, nav]);

  useEffect(() => {
    updateURLByTab();
  }, [selectedTab]);

  const getUserData = useCallback(async () => {
    const sdk = await fetchUserData({
      wallet: wallet,
      SDK: SDK as SDKContext,
      setIsLoading: setIsLoading,
    });

    if (sdk) {
      setSDK({
        oneRingSDK: sdk.oneRingSDK,
        realmWrapper: sdk.realmWrapper,
        poolWrapper: sdk.poolWrapper,
        vaultWrapper: sdk.vaultWrapper,
        userWrapper: sdk.userWrapper,
        connection: sdk.connection,
      });
      setStableBalance(sdk.balance as number);
      setRealmBalance(sdk.realmBalance as number);
      setRewards(sdk.rewards as number);
      setRedeemFee(sdk.redeemFee as number);
      setLastDeposit(sdk.lastDeposit as number);
      setRedeemLockedUntil(sdk.redeemLockedUntil as number);
    }
  }, [wallet, SDK, fetchUserData, setIsLoading, setSDK]);

  useEffect(() => {
    if (wallet.connected && initialized) getUserData();
  }, [wallet.connected, initialized]);

  const getStats = useCallback(async () => {
    const requestStats = await fetch(
      `/api/stats?limit=${chartDaysSelected.valueOf()}`
    );
    const stats = await requestStats.json();
    const currentApyItem = stats.apyHistory[stats.apyHistory.length - 1];

    setSupplyHistory(stats.supplyHistory);
    setApyHistory(stats.apyHistory);
    setTotalRevenue(stats.revenueAmount);
    setTotalYield(stats.yieldAmount);
    setCurrentApy(currentApyItem.amount * currentApyItem.deduct);
  }, [
    chartDaysSelected,
    setSupplyHistory,
    setApyHistory,
    setTotalRevenue,
    setTotalYield,
  ]);

  useEffect(() => {
    getStats();
  }, [chartDaysSelected]);

  useEffect(() => {
    initializeSDK({ token: tokens[0].contract });
    getStats();
  }, []);

  return (
    <StateContext.Provider
      value={{
        inputValueFrom,
        setInputValueFrom,
        inputValueTo,
        setInputValueTo,
        inputValue,
        setInputValue,
        selectedTab,
        setSelectedTab,
        disconnected,
        setDisconnected,
        selectedTokenFrom,
        setSelectedTokenFrom,
        selectedTokenTo,
        setSelectedTokenTo,
        stableBalance,
        setStableBalance,
        realmBalance,
        setRealmBalance,
        rewards,
        setRewards,
        redeemFee,
        setRedeemFee,
        apy,
        setApy,
        lastDeposit,
        setLastDeposit,
        redeemLockedUntil,
        setRedeemLockedUntil,
        SDK,
        setSDK,
        isLoading,
        setIsLoading,
        shouldUpdateBalance,
        setShouldUpdateBalance,
        totalStaked,
        setTotalStaked,
        totalSupply,
        setTotalSupply,
        supplyHistory,
        setSupplyHistory,
        apyHistory,
        setApyHistory,
        totalRevenue,
        setTotalRevenue,
        totalYield,
        setTotalYield,
        currentApy,
        setCurrentApy,
        chartDaysSelected,
        setChartDaysSelected,
        theme,
        setTheme,
        showTour,
        setShowTour,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
