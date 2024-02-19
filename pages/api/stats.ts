import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import type { supplyHistoryItem, apyHistoryItem } from "../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const supplyRef = collection(db, "stats-supply-history");
  const supplyQuery = query(
    supplyRef,
    orderBy("createdAt", "desc"),
    limit(Number(req.query.limit))
  );
  const statsSupplyHistory = await getDocs(supplyQuery);

  const apyRef = collection(db, "stats-apy-history");
  const apyQuery = query(
    apyRef,
    orderBy("createdAt", "desc"),
    limit(Number(req.query.limit))
  );
  const statsApyHistory = await getDocs(apyQuery);

  const revenuedRef = collection(db, "stats-revenue-amount");
  const statsRevenue = await getDocs(revenuedRef);

  const yieldRef = collection(db, "stats-yield-amount");
  const statsYield = await getDocs(yieldRef);

  const mintedHistory: supplyHistoryItem[] = statsSupplyHistory.docs.map(
    (doc) => {
      const data = doc.data();

      return {
        amount: data.amount,
        createdAt: data.createdAt,
      };
    }
  );

  const apyHistory: apyHistoryItem[] = statsApyHistory.docs.map((doc) => {
    const data = doc.data();

    return {
      amount: data.amount,
      deduct: data.deduct,
      createdAt: data.createdAt,
    };
  });

  const revenueAmount: number = statsRevenue.docs[0].data().amount;
  const yieldAmount: number = statsYield.docs[0].data().amount;

  mintedHistory.sort((a, b) => a.createdAt - b.createdAt);
  apyHistory.sort((a, b) => a.createdAt - b.createdAt);

  res.status(200).json({
    supplyHistory: mintedHistory,
    apyHistory: apyHistory,
    revenueAmount,
    yieldAmount,
  });
};
