import type { NextPage } from "next";
import { useRouter } from "next/router";
import { nav } from "../utils/constants";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      if (router.asPath === "/") router.push(nav[0].pages[0].asPath);
    }
  }, [router]);

  return <></>;
};

export default Home;
