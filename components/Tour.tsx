import { useRouter } from "next/router";
import Image from "next/image";
import { useCallback, useEffect, useContext } from "react";
import { StateContext } from "../context/StateContext";
import { Tour as TourState, nav } from "../utils/constants";
import { useTour } from "@reactour/tour";
import Button from "./Button";

export default function Tour() {
  const { disconnected, showTour, selectedTab, setShowTour } =
    useContext(StateContext);
  const { currentStep, setCurrentStep, setIsOpen, setSteps } = useTour();
  const router = useRouter();
  const start = useCallback(() => {
    if (router.isReady) {
      const steps = [
        {
          selector: ".connect",
          content: "Connect your wallet!",
        },
        {
          selector: ".mint",
          content: "Click on mint",
          actionAfter: () => {
            const page = nav.find((item) => item.title === "Mint");
            router.push(
              {
                pathname: page?.pages[0].asPath,
              },
              undefined,
              { shallow: true }
            );
          },
        },
        {
          selector: ".mint-input",
          content: "Deposit any stablecoin accepted by us!",
        },
        {
          selector: ".mint-button",
          content:
            "You can mint $1USD, the official stablecoin of the One Ring Protocol, fully backed by stablecoins. You can use $1USD to trade in other platforms, provide liquidity on DEXs or deposit on lending protocols. More usecases coming soon!",
        },
        {
          selector: ".mint-stake-button",
          content:
            "Or... you can mint and stake your $1USD to receive yield on your stablecoin deposits. You deposit and stake, we do the rest, always get you the best yield!",
        },
        {
          selector: ".redeem-tab",
          content: "Click on (Redeem) tab!",
          actionAfter: () => {
            const page = nav.find((item) => item.title === "Mint");
            router.push(
              {
                pathname: "/mint/redeem",
                query: page?.pages[2].query,
              },
              undefined,
              { shallow: true }
            );
          },
        },
        {
          selector: ".redeem-input",
          content: "Fill $1USD amount to be redeemed!",
        },
        {
          selector: ".redeem-button",
          content: "You can redeem your $1USD for any stable we support!",
        },
        {
          selector: ".calculator",
          content:
            "You can calculate how many days you would have to wait in order to break-even (you start with less due to swap fees in order to farm with your stablecoins)",
        },
        {
          selector: ".rewards",
          content: "Unstake at any time, no locks, no fees",
        },
        {
          selector: ".guide",
          content:
            "If you have any more questions feel free to check our official guide, documentation or reach us on our socials! One Ring to Yield Them All!",
          actionAfter: () => {
            localStorage.setItem("tour", TourState.end);
            setIsOpen(false);
            setShowTour(TourState.end);
          },
        },
        {
          selector: ".any",
          content: "end",
        },
      ];

      localStorage.setItem("tour", TourState.presenting);
      setShowTour(TourState.presenting);
      setSteps(steps);
      setIsOpen(true);
    }
  }, [router]);

  const finish = useCallback(() => {
    localStorage.setItem("tour", TourState.finished);
    setShowTour(TourState.finished);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (disconnected) {
      setCurrentStep(0);
    }
  }, [disconnected, currentStep]);

  useEffect(() => {
    const state = localStorage.getItem("tour");

    switch (state) {
      case null:
        setShowTour(TourState.begin);
        break;
      case TourState.presenting:
        setShowTour(TourState.begin);
        break;
      case TourState.end:
        setShowTour(TourState.end);
        break;
      case TourState.finished:
        setShowTour(TourState.finished);
        break;
      default:
        setShowTour(TourState.closed);
        break;
    }
  }, []);

  return (
    <div
      className={`${
        showTour === TourState.begin || showTour === TourState.end
          ? "fixed"
          : "hidden"
      } top-[64px] left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-skin-inverted bg-opacity-20 flex flex-col items-center justify-center backdrop-blur-[16px] transition-opacity`}
    >
      <div className="flex flex-col justify-center items-center text-center w-[320px] sm:w-[400px] sm:mt-[-250px] bg-skin-inverted p-[24px] rounded-xl shadow-default gap-5">
        {showTour === TourState.begin && (
          <>
            <div className="flex flex-row justify-center items-center gap-3">
              <div className="relative w-[38px] h-[38px]">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL="/logo.svg"
                />
              </div>

              <div className="relative w-[110px] pt-2 ">
                <svg
                  viewBox="0 0 79 16"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-skin-base"
                >
                  <path d="m6.155 0.0038154c-1.0549 5.4887e-4 -2.086 0.31355-2.9629 0.89943s-1.5602 1.4183-1.9635 2.3921c-0.40333 0.97377-0.50857 2.0451-0.30242 3.0787 0.20614 1.0335 0.71442 1.9828 1.4606 2.7278s1.6967 1.2522 2.7314 1.4576c1.0347 0.2054 2.1072 0.0997 3.0817-0.3037 0.97459-0.40345 1.8076-1.0865 2.3936-1.9627 0.5861-0.87627 0.8989-1.9064 0.8989-2.9603 0-0.70003-0.1381-1.3932-0.4064-2.0399-0.2682-0.64671-0.6614-1.2343-1.157-1.7292-0.49565-0.49486-1.084-0.88733-1.7316-1.155s-1.3415-0.4052-2.0423-0.40484zm0 9.7019c-1.3258 0-2.4005-1.9567-2.4005-4.3702 0-2.4135 1.0747-4.3702 2.4005-4.3702 1.3258 0 2.4005 1.9567 2.4005 4.3702 0 2.4135-1.0747 4.3702-2.4005 4.3702z" />
                  <path d="m48.159 5.4177v4.9193h2.9367v-10.001l-2.9367 5.0819z" />
                  <path d="m36.508 6.1716h1.2619c0.2147-1.3534-0.1008-2.7374-0.8809-3.8646s-1.9649-1.9107-3.3083-2.1881-2.742-0.027017-3.9055 0.6989c-1.1635 0.72592-2.0023 1.8717-2.3422 3.1992s-0.1548 2.7349 0.5169 3.9297c0.6716 1.1948 1.7783 2.0852 3.0899 2.4863 1.3117 0.401 2.7277 0.2819 3.9537-0.3326 1.2261-0.61459 2.168-1.6773 2.6302-2.9675h-2.895c-0.4479 0.93644-1.2336 1.5592-2.1305 1.5592-1.1775 0-2.1638-1.0724-2.445-2.5207h6.4548zm-6.452-1.6714c0.2778-1.4482 1.2658-2.5201 2.445-2.5201 1.1791 0 2.1632 1.0719 2.4449 2.5201h-4.8899z" />
                  <path d="m77.444 6.1716h-4.0915l-0.5556 0.96142h1.5614c-0.3767 1.5165-1.2125 2.5734-2.1855 2.5734-1.3258 0-2.401-1.9567-2.401-4.3702s1.0752-4.3702 2.401-4.3702c0.813 0 1.5298 0.73716 1.9644 1.8629h2.7461c-0.4628-0.86899-1.1572-1.5931-2.0065-2.0922-0.8493-0.49911-1.8202-0.75373-2.8054-0.73567-0.9852 0.018052-1.9461 0.30807-2.7765 0.83796-0.8304 0.52989-1.4978 1.279-1.9283 2.1643-0.4306 0.88536-0.6075 1.8725-0.5112 2.8521s0.4621 1.9134 1.0569 2.6982c0.5947 0.78476 1.3953 1.3898 2.313 1.7482 0.9177 0.3584 1.9168 0.4561 2.8866 0.2824l-0.9391 3.7652v1.6508l4.6199-7.9933h-0.0044c0.3306-0.56579 0.553-1.1881 0.6557-1.8351z" />
                  <path d="m47.82 0.33921c-2.3894 0-3.8258 0.93477-4.5254 2.146v-2.1465h-1.4631l-1.4731 2.5484v7.446h2.9362v-4.9958c0-1.1696 1.2441-2.3314 2.9867-2.3314 0.1131 1.4e-4 0.226 0.0083 0.3379 0.02442l1.5403-2.6644c-0.1126-0.015345-0.2259-0.024242-0.3395-0.026645z" />
                  <path d="m61.376 10.386h2.9367l-0.0033-6.6611c0-1.7802-1.4486-3.3305-3.2296-3.3305-1.667 0-3.4579 1.2495-4.526 2.3658v-2.3686h-1.463l-1.4743 2.5484v7.446h2.9357v-4.9958c0-1.1696 1.2447-2.3342 2.9867-2.3342 1.507 0 1.8338 1.1657 1.8338 2.3342v4.9958h0.0033z" />
                  <path d="m21.702 10.333h2.9367v-6.6611c0-1.7802-1.4486-3.3305-3.2301-3.3305-1.667 0-3.458 1.2501-4.526 2.3658v-2.3686h-1.4631l-1.4775 2.5484v7.446h2.9356v-4.9958c0-1.1696 1.2447-2.3314 2.9868-2.3314 1.507 0 1.8337 1.1657 1.8337 2.3314v4.9958h0.0039z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl text-skin-base">
              Welcome to our quick tour!
            </p>
            <p className="text-xl text-skin-base/40">
              It's time to learn how to use our dapp, so let's take a ride!
            </p>
            <div className="flex flex-col w-full gap-1">
              <Button action={start}>START TOUR</Button>
              <button onClick={finish}>skip</button>
            </div>
          </>
        )}
        {showTour === TourState.end && (
          <>
            <div className="flex flex-row justify-center items-center gap-3">
              <div className="relative w-[38px] h-[38px]">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  layout="fill"
                  placeholder="blur"
                  blurDataURL="/logo.svg"
                />
              </div>

              <div className="relative w-[110px] pt-2 ">
                <svg
                  viewBox="0 0 79 16"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-skin-base"
                >
                  <path d="m6.155 0.0038154c-1.0549 5.4887e-4 -2.086 0.31355-2.9629 0.89943s-1.5602 1.4183-1.9635 2.3921c-0.40333 0.97377-0.50857 2.0451-0.30242 3.0787 0.20614 1.0335 0.71442 1.9828 1.4606 2.7278s1.6967 1.2522 2.7314 1.4576c1.0347 0.2054 2.1072 0.0997 3.0817-0.3037 0.97459-0.40345 1.8076-1.0865 2.3936-1.9627 0.5861-0.87627 0.8989-1.9064 0.8989-2.9603 0-0.70003-0.1381-1.3932-0.4064-2.0399-0.2682-0.64671-0.6614-1.2343-1.157-1.7292-0.49565-0.49486-1.084-0.88733-1.7316-1.155s-1.3415-0.4052-2.0423-0.40484zm0 9.7019c-1.3258 0-2.4005-1.9567-2.4005-4.3702 0-2.4135 1.0747-4.3702 2.4005-4.3702 1.3258 0 2.4005 1.9567 2.4005 4.3702 0 2.4135-1.0747 4.3702-2.4005 4.3702z" />
                  <path d="m48.159 5.4177v4.9193h2.9367v-10.001l-2.9367 5.0819z" />
                  <path d="m36.508 6.1716h1.2619c0.2147-1.3534-0.1008-2.7374-0.8809-3.8646s-1.9649-1.9107-3.3083-2.1881-2.742-0.027017-3.9055 0.6989c-1.1635 0.72592-2.0023 1.8717-2.3422 3.1992s-0.1548 2.7349 0.5169 3.9297c0.6716 1.1948 1.7783 2.0852 3.0899 2.4863 1.3117 0.401 2.7277 0.2819 3.9537-0.3326 1.2261-0.61459 2.168-1.6773 2.6302-2.9675h-2.895c-0.4479 0.93644-1.2336 1.5592-2.1305 1.5592-1.1775 0-2.1638-1.0724-2.445-2.5207h6.4548zm-6.452-1.6714c0.2778-1.4482 1.2658-2.5201 2.445-2.5201 1.1791 0 2.1632 1.0719 2.4449 2.5201h-4.8899z" />
                  <path d="m77.444 6.1716h-4.0915l-0.5556 0.96142h1.5614c-0.3767 1.5165-1.2125 2.5734-2.1855 2.5734-1.3258 0-2.401-1.9567-2.401-4.3702s1.0752-4.3702 2.401-4.3702c0.813 0 1.5298 0.73716 1.9644 1.8629h2.7461c-0.4628-0.86899-1.1572-1.5931-2.0065-2.0922-0.8493-0.49911-1.8202-0.75373-2.8054-0.73567-0.9852 0.018052-1.9461 0.30807-2.7765 0.83796-0.8304 0.52989-1.4978 1.279-1.9283 2.1643-0.4306 0.88536-0.6075 1.8725-0.5112 2.8521s0.4621 1.9134 1.0569 2.6982c0.5947 0.78476 1.3953 1.3898 2.313 1.7482 0.9177 0.3584 1.9168 0.4561 2.8866 0.2824l-0.9391 3.7652v1.6508l4.6199-7.9933h-0.0044c0.3306-0.56579 0.553-1.1881 0.6557-1.8351z" />
                  <path d="m47.82 0.33921c-2.3894 0-3.8258 0.93477-4.5254 2.146v-2.1465h-1.4631l-1.4731 2.5484v7.446h2.9362v-4.9958c0-1.1696 1.2441-2.3314 2.9867-2.3314 0.1131 1.4e-4 0.226 0.0083 0.3379 0.02442l1.5403-2.6644c-0.1126-0.015345-0.2259-0.024242-0.3395-0.026645z" />
                  <path d="m61.376 10.386h2.9367l-0.0033-6.6611c0-1.7802-1.4486-3.3305-3.2296-3.3305-1.667 0-3.4579 1.2495-4.526 2.3658v-2.3686h-1.463l-1.4743 2.5484v7.446h2.9357v-4.9958c0-1.1696 1.2447-2.3342 2.9867-2.3342 1.507 0 1.8338 1.1657 1.8338 2.3342v4.9958h0.0033z" />
                  <path d="m21.702 10.333h2.9367v-6.6611c0-1.7802-1.4486-3.3305-3.2301-3.3305-1.667 0-3.458 1.2501-4.526 2.3658v-2.3686h-1.4631l-1.4775 2.5484v7.446h2.9356v-4.9958c0-1.1696 1.2447-2.3314 2.9868-2.3314 1.507 0 1.8337 1.1657 1.8337 2.3314v4.9958h0.0039z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl text-skin-base">
              Congrats, the tour guide is completed!
            </p>
            <p className="text-xl text-skin-base/40">
              Now you're more than able to use the dapp.
            </p>
            <div className="flex flex-col w-full gap-1">
              <Button action={finish}>Complete</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
