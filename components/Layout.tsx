import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import { ToastContainer } from "react-toastify";
import BlockModal from "./BlockModal";
import { StateContext } from "../context/StateContext";
import { lastApr } from "../utils/stats";
import "tw-elements/dist/css/index.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Theme } from "../utils/constants";
import Tour from "../components/Tour";

type Props = {
  children?: any;
  title?: string;
};

export default function Layout({ children }: Props) {
  const { theme, redeemFee, totalStaked, totalSupply, isLoading } =
    useContext(StateContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apr, setApr] = useState(0);
  const [background, setBackground] = useState("");
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
      className="fill-skin-base scale-[1.2]"
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
      className="fill-skin-base/[0.7] scale-[1.1]"
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
      href: "https://twitter.com/onering_tools",
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

  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = "en-us";
    const currentApr = lastApr();
    setApr(currentApr);

    const isStored = localStorage.getItem("modal");

    if (isStored) {
      return setIsModalVisible(false);
    }

    localStorage.setItem("modal", "true");
    setIsModalVisible(true);
  }, []);

  return (
    <div className={`${theme}`}>
      <div
        className={`${
          theme === Theme.light
            ? "bg-rivendell"
            : theme === Theme.dark
            ? "bg-tower"
            : "bg-solanaTower"
        } flex flex-col min-h-screen min-w-screen justify-between items-center bg-top bg-fixed bg-no-repeat flex-shrink-0 font-futuraPT snap-none z-0`}
      >
        <header className="z-50">
          <Navigation />
        </header>

        <ToastContainer
          containerId="toast-notification"
          position="top-right"
          autoClose={6000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <main
          className={`
            pt-10 sm:pt-20
            pb-10
            flex-1
            transition-all
            flex
            flex-col
            items-center
            w-[100%]
            min-w-[320px]
            max-w-[1920px]
            
            px-[12px]
            sm:px-[24px]
            md:px-[24px] 
            lg:px-[96px] 
            xl:px-[106px]
            2xl:px-[140px]
            flex-shrink-0
          `}
        >
          {router &&
            router.pathname !== "/" &&
            router.pathname !== "/faq" &&
            router.pathname !== "/stats" && (
              <>
                <div
                  className="
              flex flex-row w-[100%] font-inter justify-center items-center space-x-2 text-skin-accent text-[12px]
              sm:w-[448px] sm:text-[14px] pb-4"
                >
                  <div className="min-w-[18px] min-h-[18px] sm:min-w-[18px] sm:min-h-[18px] relative">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9999 9.00001C12.9999 8.44772 12.5522 8.00001 11.9999 8.00001C11.4476 8.00001 10.9999 8.44772 10.9999 9.00001H12.9999ZM10.9999 14C10.9999 14.5523 11.4476 15 11.9999 15C12.5522 15 12.9999 14.5523 12.9999 14H10.9999ZM12.9999 17.5C12.9999 16.9477 12.5522 16.5 11.9999 16.5C11.4476 16.5 10.9999 16.9477 10.9999 17.5H12.9999ZM10.9999 18C10.9999 18.5523 11.4476 19 11.9999 19C12.5522 19 12.9999 18.5523 12.9999 18H10.9999ZM2.23192 19.016L3.12314 19.4696L3.12329 19.4693L2.23192 19.016ZM10.3499 3.05201L11.2413 3.50528L11.2414 3.50506L10.3499 3.05201ZM13.6519 3.05201L12.7602 3.50455L12.7605 3.50524L13.6519 3.05201ZM21.7689 19.016L22.6609 18.564L22.6603 18.5628L21.7689 19.016ZM10.9999 9.00001V14H12.9999V9.00001H10.9999ZM10.9999 17.5V18H12.9999V17.5H10.9999ZM3.12329 19.4693L11.2413 3.50528L9.45855 2.59873L1.34055 18.5627L3.12329 19.4693ZM11.2414 3.50506C11.5841 2.83081 12.4189 2.832 12.7602 3.50455L14.5437 2.59946C13.461 0.466009 10.5418 0.467201 9.45843 2.59896L11.2414 3.50506ZM12.7605 3.50524L20.8775 19.4692L22.6603 18.5628L14.5433 2.59877L12.7605 3.50524ZM20.8769 19.468C21.2739 20.2514 20.6841 21 20.1159 21V23C22.4037 23 23.626 20.4686 22.6609 18.564L20.8769 19.468ZM20.1159 21H3.88292V23H20.1159V21ZM3.88292 21C3.31447 21 2.72549 20.2509 3.12314 19.4696L1.34069 18.5624C0.370342 20.4691 1.59736 23 3.88292 23V21Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <p className="flex flex-wrap">
                    The site is currently in Beta test.
                  </p>
                </div>
              </>
            )}
          {children}
        </main>

        <footer
          className="
          w-full
          h-20
          flex justify-center sm:items-center
        "
        >
          <div className="flex flex-row w-[64%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[26%] 2xl:w-[20%] justify-between">
            {footerItems.map((item, index) => (
              <Link href={item.href} key={index} passHref={true}>
                <a className="hover:opacity-70" target="blank">
                  <div className="relative w-[22px] h-[22px]">{item.image}</div>
                </a>
              </Link>
            ))}
          </div>
        </footer>
        <BlockModal
          buttonTitle="I understand"
          clickAction={() => {
            setIsModalVisible(false);
          }}
          isOpen={isModalVisible}
        >
          <div className="flex flex-col justify-center items-center py-4">
            <h1 className="text-ringorange text-[18px] self-center pb-3">
              Please note that the following fees are charged
            </h1>
            <ul className="text-white bullet list-disc leading-[40px] self-start pl-2 sm:pl-12">
              <li>less than 0.2% third party withdrawal fee</li>
              <li>{redeemFee}% fee for redeeming 1USD</li>
            </ul>
          </div>
        </BlockModal>
      </div>
      {!isModalVisible && (
        <div className="hidden xl:flex">
          <Tour />
        </div>
      )}
    </div>
  );
}
