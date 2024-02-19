import type { Connection } from "@solana/web3.js";
import type { TransactionEnvelope } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import {
  confirmTransactionLike,
  SolanaProvider,
} from "@saberhq/solana-contrib";
import {
  OneRingSDK,
  RealmWrapper,
  PoolWrapper,
  VaultWrapper,
  UserWrapper,
} from "onering-solana-sdk";
import showError from "./sdkError";
import Notification from "../../components/Notification";

export type SDKContext = {
  oneRingSDK: OneRingSDK;
  realmWrapper: RealmWrapper;
  poolWrapper: PoolWrapper;
  vaultWrapper?: VaultWrapper;
  userWrapper?: UserWrapper;
  totalSupply: number;
  balance: number;
  realmBalance: number;
  rewards: number;
  redeemFee: number;
  apy: number;
  lastDeposit: number;
  redeemLockedUntil: number;
  totalStaked: number;
  connection: Connection;
  token?: string;
};

type InitializeProps = {
  wallet: any;
  sendTransaction: any;
  connection: Connection;
  setIsLoading: any;
  token?: string;
};

type UserProps = {
  wallet: any;
  SDK: SDKContext;
  setIsLoading: any;
};

type MintRedeemProps = {
  SDK: SDKContext;
  amount: number;
  setIsLoading: any;
};

type RedeemProps = {
  SDK: SDKContext;
  amount: number;
  setIsLoading: any;
};

async function transactionConfirmationHandler(
  tx: TransactionEnvelope,
  message: string
) {
  const txPending = await tx.send();
  Notification({
    title: "Transaction submitted",
    message: `Your ${message} transaction was successfully submitted.`,
    link: txPending.generateSolanaExplorerLink(),
  });

  const txReceipt = await confirmTransactionLike(txPending);
  Notification({
    type: "success",
    title: "Transaction confirmed",
    message: `Your ${message} transaction is confirmed successfully.`,
    link: txReceipt.generateSolanaExplorerLink(),
  });
}

export async function initialize({
  wallet,
  connection,
  setIsLoading,
  token,
}: InitializeProps) {
  setIsLoading(true);
  const provider = SolanaProvider.init({
    connection: connection,
    wallet: wallet,
    opts: {
      preflightCommitment: "confirmed",
      commitment: "confirmed",
    },
  });

  try {
    const oneRingSDK = OneRingSDK.load({ provider });

    const realmWrapper = new RealmWrapper(
      oneRingSDK,
      new PublicKey(process.env.NEXT_PUBLIC_REALM_ADDRESS as string)
    );

    const realmData = await realmWrapper.fetchRealm();

    const poolWrapper = new PoolWrapper(
      oneRingSDK,
      new PublicKey(process.env.NEXT_PUBLIC_POOL_ADDRESS as string)
    );

    const poolData = await poolWrapper.fetchPool();
    const totalStaked = poolData.totalLpUiAmount * poolData.lpIndexBasisPoints;

    let sdk: SDKContext = {
      oneRingSDK,
      realmWrapper,
      poolWrapper,
      totalSupply: realmData.collatTotalSupply,
      balance: 0,
      realmBalance: 0,
      rewards: 0,
      redeemFee: realmData.redemptionFeeBasisPoints * 100,
      apy: 0,
      lastDeposit: 0,
      redeemLockedUntil: 0,
      totalStaked: totalStaked,
      connection: connection,
      token: "",
    };

    setIsLoading(false);
    return sdk;
  } catch (e) {
    setIsLoading(false);
    showError({ e: e });
  }
}

export async function fetchUserData({ wallet, SDK, setIsLoading }: UserProps) {
  setIsLoading(true);
  const sdk = { ...SDK };

  try {
    const provider = SolanaProvider.init({
      connection: sdk.connection,
      wallet: wallet,
      opts: {
        preflightCommitment: "confirmed",
        commitment: "confirmed",
      },
    });

    const oneRingSDK = OneRingSDK.load({ provider });

    const userWrapper = new UserWrapper(oneRingSDK, wallet.publicKey);

    const vaultAddress = process.env.NEXT_PUBLIC_USDC_VAULT_ADDRESS;
    // sdk.token === ''
    //   ? process.env.NEXT_PUBLIC_USDC_VAULT_ADDRESS
    //   : sdk.token === process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS
    //   ? process.env.NEXT_PUBLIC_USDC_VAULT_ADDRESS
    //   : process.env.NEXT_PUBLIC_USDT_VAULT_ADDRESS

    const vaultWrapper = new VaultWrapper(
      sdk.oneRingSDK,
      new PublicKey(vaultAddress as string)
    );

    const tokenBanlance = await userWrapper.getTokenBalance(
      // new PublicKey(sdk.token as string),
      new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS as string)
    );

    const realmBalance = await userWrapper.getTokenBalance(
      new PublicKey(process.env.NEXT_PUBLIC_1USD_MINT_ADDRESS as string)
    );

    const depositReceiptData = await userWrapper.fetchDepositReceipt(
      sdk.realmWrapper
    );

    const realmData = await sdk.realmWrapper.fetchRealm();
    const poolData = await sdk.poolWrapper.fetchPool();

    const redeemLockedUntil = depositReceiptData?.lastDepositTs
      ? (depositReceiptData?.lastDepositTs as number) +
        realmData.redemptionDelay
      : 0;

    const stakeReceiptData = await userWrapper.fetchStakeReceipt(
      sdk.realmWrapper,
      sdk.poolWrapper
    );

    const rewards = stakeReceiptData ? stakeReceiptData.rewardUiAmount : 0;

    sdk.vaultWrapper = vaultWrapper;
    sdk.userWrapper = userWrapper;
    sdk.balance = tokenBanlance;
    sdk.realmBalance = realmBalance;
    sdk.rewards = rewards;
    sdk.redeemFee = realmData.redemptionFeeBasisPoints * 100;
    sdk.apy = poolData.apyBasisPoints * 100;
    sdk.lastDeposit = depositReceiptData?.lastDepositTs as number;
    sdk.redeemLockedUntil = redeemLockedUntil;
    setIsLoading(false);

    return sdk;
  } catch (e) {
    console.log(e);

    setIsLoading(false);
  }
}

export async function mint({ SDK, amount, setIsLoading }: MintRedeemProps) {
  setIsLoading(true);

  try {
    const tx = await SDK.userWrapper?.deposit({
      realm: SDK.realmWrapper,
      vault: SDK.vaultWrapper!,
      amount,
    });

    await transactionConfirmationHandler(tx as TransactionEnvelope, "mint");

    setIsLoading(false);
  } catch (e) {
    showError({ e: e, notificate: true });
    setIsLoading(false);
  }
}

export async function previewRedeemAmount({
  SDK,
  amount,
  setIsLoading,
}: RedeemProps) {
  setIsLoading(true);
  try {
    if (!SDK?.userWrapper) throw Error("Connect your wallet.");
    const { outAmount } = await SDK.userWrapper.redeem({
      realm: SDK?.realmWrapper as RealmWrapper,
      vault: SDK?.vaultWrapper as VaultWrapper,
      amount,
    });

    setIsLoading(false);
    return outAmount;
  } catch (e) {
    showError({ e: e, notificate: true });
    setIsLoading(false);
  }
}

export async function redeem({ SDK, amount, setIsLoading }: RedeemProps) {
  setIsLoading(true);
  try {
    if (!SDK?.userWrapper) throw Error("Connect your wallet.");

    // TODO: debounced input for simulated outAmount
    const { txReqs, outAmount } = await SDK.userWrapper.redeem({
      realm: SDK?.realmWrapper as RealmWrapper,
      vault: SDK?.vaultWrapper as VaultWrapper,
      amount,
    });

    const txPendings = await SDK.userWrapper.provider.sendAll(txReqs);

    // Notification({
    //   title: 'Transaction submitted',
    //   message: `Your redemption transaction was successfully submitted.`,
    //   link: txPendings[0].generateSolanaExplorerLink(),
    // })

    const txReceipt = await confirmTransactionLike(txPendings[0]);
    Notification({
      type: "success",
      title: "Transaction confirmed",
      message: `Your redemption transaction is confirmed successfully.`,
      link: txReceipt.generateSolanaExplorerLink(),
    });

    // await transactionConfirmationHandler(tx as TransactionEnvelope, 'redemption')

    setIsLoading(false);
  } catch (e) {
    showError({ e: e, notificate: true });
    setIsLoading(false);
  }
}

export async function mintAndStake({
  SDK,
  amount,
  setIsLoading,
}: MintRedeemProps) {
  setIsLoading(true);

  try {
    const tx = await SDK?.userWrapper?.depositAndStake({
      realm: SDK.realmWrapper,
      pool: SDK.poolWrapper,
      vault: SDK.vaultWrapper as VaultWrapper,
      amount,
    });

    await transactionConfirmationHandler(
      tx as TransactionEnvelope,
      "mint & stake"
    );
    setIsLoading(false);
  } catch (e) {
    showError({ e: e, notificate: true });
    setIsLoading(false);
  }
}

export async function stake({ SDK, amount, setIsLoading }: MintRedeemProps) {
  setIsLoading(true);

  try {
    const tx = await SDK?.userWrapper?.stake({
      realm: SDK.realmWrapper,
      pool: SDK.poolWrapper,
      amount,
    });

    await transactionConfirmationHandler(tx as TransactionEnvelope, "stake");

    setIsLoading(false);
  } catch (e) {
    showError({ e: e, notificate: true });
    setIsLoading(false);
  }
}

export async function unstake({ SDK, amount, setIsLoading }: MintRedeemProps) {
  setIsLoading(true);
  try {
    const tx = await SDK?.userWrapper?.unstake({
      realm: SDK.realmWrapper,
      pool: SDK.poolWrapper,
      amount,
    });

    await transactionConfirmationHandler(tx as TransactionEnvelope, "unstake");

    setIsLoading(false);
  } catch (e) {
    showError({ e: e, notificate: true });
    setIsLoading(false);
  }
}
