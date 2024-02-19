import { useState, useEffect, useContext } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { StateContext } from "../context/StateContext";
import { nav, Theme } from "../utils/constants";
import Rewards from "./Rewards";
import ThemeSelect from "./ThemeSelect";
import Calculator from "./Calculator";
import { solana } from "../utils/svgs";

export default function Navigation() {
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const { disconnected, rewards, isLoading, theme } = useContext(StateContext);
  const [offset, setOffset] = useState(0);
  const [rewardsIsOpen, setRewardsIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const social1 = (
    <svg
      fill="none"
      viewBox="0 0 24 20"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-skin-base"
    >
      <path
        d="m23.643 2.937c-0.835 0.37-1.732 0.62-2.675 0.733 0.973-0.58221 1.7009-1.4985 2.048-2.578-0.9142 0.54299-1.9147 0.9252-2.958 1.13-0.7016-0.74913-1.6309-1.2457-2.6437-1.4125-1.0127-0.16685-2.0522 0.005317-2.9571 0.48978-0.9048 0.48446-1.6244 1.2541-2.047 2.1894-0.4227 0.93535-0.5247 1.984-0.2902 2.9833-1.8523-0.093-3.6644-0.57445-5.3186-1.4131-1.6542-0.83865-3.1136-2.0158-4.2834-3.4549-0.4 0.69-0.63 1.49-0.63 2.342-4.5e-4 0.767 0.18843 1.5222 0.54988 2.1987 0.36144 0.67649 0.88428 1.2533 1.5221 1.6793-0.73972-0.02354-1.4631-0.22342-2.11-0.583v0.06c-7e-5 1.0757 0.37203 2.1184 1.0532 2.951 0.68115 0.8326 1.6294 1.4039 2.6838 1.617-0.68622 0.1857-1.4057 0.2131-2.104 0.08 0.2975 0.9256 0.877 1.735 1.6574 2.3149s1.7226 0.9013 2.6946 0.9191c-1.6502 1.2954-3.6881 1.9981-5.786 1.995-0.37162 1e-4 -0.74292-0.0216-1.112-0.065 2.1295 1.3692 4.6083 2.0958 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-0.2-5e-3 -0.402-0.014-0.602 0.9113-0.65903 1.6979-1.4751 2.323-2.41l2e-3 -3e-3z"
        fillOpacity=".68"
      />
    </svg>
  );

  const social2 = (
    <svg
      fill="none"
      viewBox="0 0 22 19"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-skin-base"
    >
      <path
        d="m1.513 8.1788c5.905-2.681 9.8434-4.449 11.813-5.3022 5.6265-2.4383 6.7946-2.8622 7.556-2.8763 0.1688-0.0035184 0.5435 0.040462 0.7849 0.24629 0.1622 0.14589 0.2658 0.34996 0.2904 0.57174 0.041 0.2746 0.0523 0.55312 0.0337 0.83035-0.3055 3.339-1.6256 11.438-2.2958 15.178-0.2836 1.5815-0.844 2.1111-1.3842 2.1638-0.9319 0.088-1.6865-0.4714-2.5254-1.0959-0.2212-0.1636-0.4474-0.3308-0.6837-0.4926-0.9319-0.6369-1.651-1.147-2.3718-1.659l-0.0577-0.0408c-0.641-0.4545-1.2882-0.9133-2.0913-1.465-1.7219-1.1822-1.0027-1.907-0.0405-2.8711 0.1553-0.1565 0.3174-0.3201 0.476-0.4908 0.0709-0.0774 0.417-0.4134 0.9066-0.88662 1.5699-1.52 4.5984-4.4561 4.676-4.7956 0.0118-0.05629 0.0237-0.26388-0.0945-0.37295-0.1182-0.11083-0.2937-0.07213-0.4203-0.04222-0.179 0.04222-3.0268 2.0037-8.5436 5.8863-0.8086 0.577-1.5412 0.8585-2.1979 0.8444-0.72251-0.0158-2.1135-0.4257-3.1483-0.7758-0.15193-0.0528-0.30048-0.1003-0.44397-0.1478-1.05-0.343-1.8232-0.59632-1.7455-1.2402 0.045579-0.37999 0.54864-0.76878 1.5075-1.1664z"
        fillOpacity=".68"
      />
    </svg>
  );

  const social3 = (
    <svg
      fill="none"
      viewBox="0 0 20 16"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-skin-base"
    >
      <path
        d="m2.3722 3.264c0.01226-0.12173-0.00415-0.24465-0.04791-0.3589-0.04376-0.11426-0.11365-0.21669-0.20409-0.2991l-1.868-2.267v-0.339h5.798l4.482 9.905 3.94-9.905h5.528v0.339l-1.597 1.541c-0.0676 0.05225-0.1198 0.12189-0.151 0.2015s-0.0402 0.16619-0.026 0.2505v11.334c-0.0142 0.0843-0.0052 0.1709 0.026 0.2505s0.0834 0.1493 0.151 0.2015l1.56 1.542v0.34h-7.844v-0.339l1.616-1.58c0.159-0.16 0.159-0.207 0.159-0.451v-9.162l-4.492 11.494h-0.606l-5.23-11.494v7.704c-0.043 0.323 0.064 0.65 0.29 0.884l2.101 2.568v0.338h-5.957v-0.338l2.1-2.568c0.11112-0.1159 0.19358-0.2563 0.24081-0.4098 0.04722-0.1534 0.05791-0.3158 0.03119-0.4742v-8.908z"
        fillOpacity=".68"
      />
    </svg>
  );

  const social4 = (
    <svg
      fill="none"
      viewBox="0 -1 24 18"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-skin-base"
    >
      <path
        d="m20.317 1.492c-1.53-0.69-3.17-1.2-4.885-1.49-0.0153-0.0029321-0.0311-0.0010425-0.0453 0.0054073-0.0141 0.0064498-0.0259 0.017141-0.0337 0.030593-0.21 0.369-0.444 0.85-0.608 1.23-1.8189-0.27176-3.6681-0.27176-5.487 0-0.18266-0.42114-0.38865-0.83177-0.617-1.23-0.00774-0.013617-0.01945-0.02455-0.03356-0.03134-0.01412-0.0067896-0.02997-0.0091131-0.04544-0.0066602-1.714 0.29-3.354 0.8-4.885 1.491-0.01317 0.00553-0.02433 0.01495-0.032 0.027-3.112 4.575-3.965 9.037-3.546 13.443 0.0011662 0.0108 0.0045152 0.0212 0.0098452 0.0307 0.005329 0.0094 0.012527 0.0177 0.021155 0.0243 1.8164 1.3224 3.8423 2.3298 5.993 2.98 0.015 0.0046 0.03103 0.0046 0.04602 0 0.01498-0.0047 0.02822-0.0137 0.03798-0.026 0.462-0.62 0.874-1.275 1.226-1.963 0.021-0.04 1e-3 -0.088-0.041-0.104-0.64599-0.2433-1.2719-0.5368-1.872-0.878-0.01078-0.0062-0.01987-0.0149-0.02644-0.0254-0.00657-0.0106-0.01043-0.0226-0.01122-0.0349-8e-4 -0.0124 0.0015-0.0248 0.00668-0.0361s0.01307-0.0211 0.02298-0.0286c0.126-0.093 0.252-0.19 0.372-0.287 0.01081-0.0087 0.02382-0.0143 0.03759-0.016 0.01377-0.0018 0.02776 3e-4 0.04041 6e-3 3.927 1.764 8.18 1.764 12.061 0 0.0127-0.0061 0.0268-0.0084 0.0408-0.0068 0.0139 0.0016 0.0272 7e-3 0.0382 0.0158 0.12 0.098 0.245 0.195 0.372 0.288 0.01 0.0073 0.018 0.017 0.0234 0.0282 0.0053 0.0112 0.0078 0.0235 0.0072 0.0359s-0.0043 0.0244-0.0107 0.0351c-0.0063 0.0106-0.0153 0.0195-0.0259 0.0258-0.598 0.344-1.22 0.635-1.873 0.877-0.0101 0.0036-0.0192 0.0094-0.0268 0.0168-0.0077 0.0075-0.0136 0.0165-0.0175 0.0264-0.0039 0.01-0.0056 0.0206-5e-3 0.0313 5e-4 0.0106 0.0034 0.021 0.0083 0.0305 0.36 0.687 0.772 1.341 1.225 1.962 0.0094 0.0127 0.0225 0.0223 0.0375 0.0273 0.0151 5e-3 0.0313 0.0052 0.0465 7e-4 2.1543-0.6484 4.1836-1.6562 6.002-2.981 0.0088-0.0062 0.0163-0.0142 0.0218-0.0235 0.0055-0.0094 9e-3 -0.0197 0.0102-0.0305 0.5-5.094-0.838-9.52-3.549-13.442-0.0067-0.01274-0.0177-0.02268-0.031-0.028zm-12.297 10.786c-1.182 0-2.157-1.069-2.157-2.38 0-1.312 0.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-0.95603 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312 0.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-0.946 2.38-2.157 2.38z"
        fillOpacity=".68"
      />
    </svg>
  );

  const social5 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 2 60 60"
      className="fill-skin-base/[0.7] scale-[0.9]"
    >
      <g>
        <path d="M13.487964.025067 C6.015456.130506.010218 6.212755 0 13.686 v32.628 c-.00225 5.535029 3.331107 10.525988 8.44479 12.644192 5.113684 2.118204 10.999884.946194 14.91221-2.969192 l9.287-9.289c.22107 7.469981 6.395528 13.380372 13.868036 13.274933 C53.984544 59.869494 59.989782 53.787245 60 46.314 V13.686c.00225-5.535028-3.331107-10.525988-8.44479-12.644192 C46.441525-1.076396 40.555325.095614 36.643 4.011 L27.356 13.3C27.13493 5.830018 20.960472-.080372 13.487964.025067z"></path>
        <ellipse rx="13.686" ry="13.686" cx="13.686" cy="46.314"></ellipse>
      </g>
    </svg>
  );

  const social6 = (
    <svg
      viewBox="0 0 24 20"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-skin-base/[0.7] scale-[0.9]"
    >
      <path
        d="m9.0469 0.54045c-0.41043-0.7206-1.4768-0.7206-1.8869 0l-7.0558 12.493c-0.32828 0.6407 0.16399 1.3613 0.9024 1.3613h4.7584v4.7246c0 0.4806 0.41043 0.881 0.9027 0.881h2.7893c0.49227 0 0.90241-0.4004 0.90241-0.881v-4.7246h-1.3125c-0.57442 0-0.98455-0.4004-1.0667-0.881 0-0.1601 0-0.3202 0.08214-0.4821l3.9382-6.9669-2.9536-5.5239z"
        fillOpacity="1"
      />
      <path
        d="m15.015 0.54045c0.4076-0.7206 1.4668-0.7206 1.8741 0l7.008 12.493c0.3261 0.6407-0.1629 1.3613-0.8963 1.3613h-4.6448v4.7246c0 0.4806-0.4074 0.881-0.8972 0.881h-2.9327c-0.489 0-0.8963-0.4004-0.8963-0.881v-4.7246h1.3039c0.5702 0 0.9776-0.4004 1.0592-0.881 0-0.1601 0-0.3202-0.0816-0.4821l-3.9112-6.9651 3.0149-5.5257z"
        fillOpacity=".68"
      />
    </svg>
  );

  const footerItems = [
    {
      image: social1,
      title: "twitter",
      href: "https://twitter.com/Onering_Finance",
    },
    {
      image: social2,
      title: "telegram",
      href: "https://t.me/OneRing_Finance",
    },
    {
      image: social3,
      title: "medium",
      href: "https://medium.com/oneringfinance",
    },
    {
      image: social4,
      title: "discord",
      href: "https://discord.com/invite/qVTkQ3N6rp",
    },
    {
      image: social5,
      title: "nomics",
      href: "https://nomics.com/assets/ring6-onering",
    },
    {
      image: social6,
      title: "linktree",
      href: "https://linktr.ee/OneRing_Finance",
    },
  ];

  useEffect(() => {
    setSelected(router.pathname);
    setIsOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex h-[64px] justify-center w-full">
      <div
        className={`flex w-full justify-between items-center px-[24px] fixed ${
          offset > 2
            ? "bg-skin-inverted shadow-lg transition-opacity"
            : "bg-skin-inverted/90 shadow-lg transition-opacity"
          // : "transition-opacity"
        }`}
      >
        <div className="flex w-full h-[64px] items-center">
          {/* Logo */}
          <Link href="https://onering.tools">
            <a target="_blank" rel="noopener noreferrer">
              <div className="flex flex-row items-center gap-3 w-[170px]">
                <div className="relative w-[28px] h-[28px]">
                  <svg
                    width="28"
                    height="24"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25.8314 4.86338C24.735 3.26866 23.6387 2.07262 22.4426 1.27526C20.1502 -0.219785 17.4591 -0.419125 13.9707 0.776914C11.6783 1.4746 8.78786 3.468 6.19644 6.15909C3.90403 8.4515 2.10997 11.1426 1.0136 13.8337C-0.182435 16.6244 -0.282105 19.2158 0.515254 21.1096C1.41228 23.103 3.50535 24 5.49875 24C6.09677 24 6.79446 23.9003 7.39248 23.701C10.0836 23.0033 12.7747 20.9102 14.5687 19.3155C14.6684 19.2158 14.768 19.0165 14.768 18.8172C14.768 18.6178 14.6684 18.5182 14.5687 18.3188C14.3694 18.0198 13.9707 17.9201 13.572 18.2191C11.0803 20.1129 8.88753 21.2092 6.89413 21.3089C6.29611 19.4152 6.69479 17.0231 7.9905 14.4317C8.68819 13.136 9.58521 11.8403 10.6816 10.6442C11.778 9.4482 12.974 8.4515 14.3694 7.65414C14.768 7.4548 14.768 6.95645 14.5687 6.65744C14.469 6.4581 14.3694 6.35843 14.17 6.35843C13.9707 6.25876 13.7714 6.35843 13.572 6.4581C12.077 7.35513 10.6816 8.35183 9.48555 9.64754C8.18984 10.9432 7.19314 12.3386 6.29611 13.8337C5.19974 15.8271 4.50205 17.8205 4.40238 19.6145C4.30271 20.1129 4.0037 20.3122 3.80436 20.3122C3.50535 20.4119 3.10667 20.3122 2.90733 20.0132C2.0103 18.8172 2.0103 16.8238 2.90733 14.332C3.80436 12.0396 5.39908 9.54786 7.49215 7.55447C9.58521 5.4614 11.9773 3.86668 14.2697 2.96965C15.4657 2.57097 16.5621 2.27196 17.4591 2.27196C18.8545 2.27196 19.9509 2.77031 20.5489 3.66734C22.343 6.55777 21.3463 9.84687 19.2532 13.734C19.1535 13.9333 19.1535 14.1327 19.1535 14.332C19.2532 14.5314 19.3529 14.631 19.4525 14.7307C19.7515 14.93 20.1502 14.93 20.4492 14.5314C21.5456 13.0363 22.4426 11.4416 23.0407 9.94654C23.1403 9.84687 23.1403 9.64754 23.3397 9.64754C23.4393 9.54786 23.6387 9.54786 23.7383 9.54786C24.137 9.54786 24.3364 9.7472 24.5357 10.0462C24.735 10.4449 24.8347 11.1426 24.8347 11.9399C24.8347 12.6376 24.735 13.435 24.5357 14.332C23.838 17.4218 21.7449 20.8106 19.3529 22.9036C19.1535 23.0033 19.1535 23.2026 19.1535 23.402C19.1535 23.6013 19.2532 23.701 19.3529 23.8007C19.4525 23.9003 19.6519 24 19.7515 24C19.9509 24 20.1502 24 20.2499 23.9003C23.4393 21.4086 25.9311 17.8205 26.9278 14.4317C27.8248 10.9432 27.4261 7.25546 25.8314 4.86338Z"
                      fill="url(#paint0_linear_713_941)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_713_941"
                        x1="0.433824"
                        y1="12.0396"
                        x2="27.1205"
                        y2="12.0396"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          stopColor={`${
                            theme === Theme.solana ? "#9945FF" : "#EB0000"
                          }`}
                        />
                        <stop
                          offset="1"
                          stopColor={`${
                            theme === Theme.solana ? "#14F195" : "#FF5D00"
                          }`}
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="relative w-[80px] h-[28px] mt-[18px]">
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
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex h-[64px] items-center space-x-14 text-skin-base">
            {nav.map((item, index) => (
              <Link href={item.pages[0].asPath} key={index}>
                <a
                  className={`${item.class} flex items-center ${
                    item.pathname === selected && "text-skin-hover"
                  } hover:text-skin-hover`}
                  onClick={() =>
                    !item.pages[0].target && setSelected(item.pathname)
                  }
                  target={item.pages[0].target}
                >
                  {item.image}
                  {item.title}
                </a>
              </Link>
            ))}
          </div>

          <div
            className={`hidden xl:flex flex-row justify-end items-center gap-2 w-full ${
              disconnected ? "wallet-button" : "wallet-button-connected"
            }`}
          >
            <Calculator />
            <div className="mr-3">
              <Rewards />
            </div>
            {router.pathname !== "/" && (
              <div className={`connect ${theme === Theme.solana && "solana"}`}>
                <WalletMultiButton />
              </div>
            )}
            <Link href="https://evm.onering.tools">
              <a className="ml-3 mt-[1px] text-skin-base hover:text-skin-accent">
                Try Fantom
              </a>
            </Link>
            <div className="ml-3 mt-2">
              <ThemeSelect />
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:hidden justify-center">
        <div className="text-light/50">
          {/* Mobile Menu */}
          <button
            className="flex xl:hidden absolute top-5 right-4 outline-none"
            aria-label="menu"
            onClick={() => setIsOpen(true)}
          >
            <svg
              className="stroke-skin-base hover:stroke-skin-accent"
              fill="none"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <div
            className={`
              fixed 
              bottom-0 
              flex 
              flex-col 
              max-w-full 
              bg-clip-padding 
              outline-none 
              top-0 right-0 
              rounded-tl-lg
              transition-all delay-150 duration-300 overflow-hidden
              font-futuraPT
              text-[18px]
              shadow-2xl
              backdrop-blur-[16px]
              bg-skin-inverted
              py-4
              ${isOpen ? "w-[300px]" : "w-0"}
            `}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="offcanvas-header flex items-center justify-between border-b-[1px] border-skin-accent pb-4 mx-4">
              <h5
                className="offcanvas-title  text-skin-base"
                id="offcanvasRightLabel"
              >
                Menu
              </h5>

              <button
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="stroke-skin-base hover:stroke-skin-accent"
                  fill="none"
                  width="24"
                  height="24"
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="offcanvas-body flex flex-col flex-grow p-4 overflow-y-auto gap-4">
              {nav.map((item, index) => (
                <Link href={item.pages[0].asPath} key={index}>
                  <a
                    className={`px-2 text-skin-base ${
                      item.pathname === selected && "text-skin-accent"
                    } hover:text-skin-accent`}
                    onClick={() => setSelected(item.title)}
                  >
                    <div className="flex items-center gap-2">
                      {item.image}
                      {item.title}
                    </div>
                  </a>
                </Link>
              ))}

              {!disconnected && (
                <>
                  <span className="px-2">Rewards</span>
                  <Rewards isMobile />
                </>
              )}
              <div
                className={`flex justify-between items-center ${
                  disconnected ? "wallet-button" : "wallet-button-connected"
                }`}
              >
                <WalletMultiButton />
                <ThemeSelect />
                <div className="w-1" />
              </div>

              <Link href="https://evm.onering.tools">
                <a className="ml-3 mt-[1px] text-skin-base hover:text-skin-accent">
                  Try Fantom
                </a>
              </Link>
            </div>
            <div className="offcanvas-footer bg-gradient-to-r from-skin-gradien3 to-skin-gradient4">
              <div
                className="
                  flex flex-row justify-between px-7 mt-[1px] pt-4 
                  bg-skin-inverted
                  h-[70px]
                "
              >
                {footerItems.map((item, index) => (
                  <Link href={item.href} key={index} passHref={true}>
                    <a className="hover:opacity-70" target="blank">
                      <div
                        className={`relative ${
                          item.title === "discord" || item.title === "linktree"
                            ? "w-[22px] sm:w-[26px]"
                            : "w-[18px] sm:w-[22px]"
                        } h-[20px] sm:h-[22px]`}
                      >
                        {item.image}
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
