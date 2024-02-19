import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import { FlexBoxContent } from "../components/BoxContent";
import DropdownChart from "../components/DropdownChart";
import Loading from "../components/Loading";
import { StateContext } from "../context/StateContext";
import truncate from "../utils/truncate";
import { ChartType, DecimalsType, ChartDays, Theme } from "../utils/constants";
import moment from "moment";

import {
  defaults,
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ScriptableContext,
  ArcElement,
  BarElement,
  Legend,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Filler,
  Tooltip
);

type supplyItem = {
  amount: number;
  createdAt: number;
};

type apyItem = {
  amount: number;
  deduct: number;
  createdAt: number;
};

const Stats: NextPage = () => {
  const [chartSelected, setChartSelected] = useState<ChartType>(
    ChartType.Minted
  );

  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: any[];
  }>({ labels: [], datasets: [] });

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) =>
            `${context.label}: ${context.formattedValue} ${
              chartSelected === ChartType.APY ? "%" : "$1USD"
            }`,
        },
      },
    },
  };

  defaults.font.family = "Futura PT";

  const doughnutOptions = {
    responsive: true,
    showAllTooltips: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed} %`,
        },
      },
    },
    onClick: (evt: any, item: any) => {
      switch (item[0].index) {
        case 0:
          window.open(
            "https://app.quarry.so/rewarders/rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk/quarries/H6TWopq51MkjYqtCy8xTRJrzm88esDWoNVpL87Akybwn/deposit",
            "_newtab"
          );
          break;
        case 1:
          window.open("https://tulip.garden/lend", "_newtab");
          break;
        case 2:
          window.open(
            "https://app.quarry.so/rewarders/rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk/quarries/6SUsK6XFMK3E1f7a1P8JGwUrxXNDiEL1wTM15ozghVJ1/deposit",
            "_newtab"
          );
          break;
      }
    },
  };

  const {
    theme,
    totalStaked,
    totalSupply,
    isLoading,
    supplyHistory,
    apyHistory,
    totalRevenue,
    totalYield,
    currentApy,
    chartDaysSelected,
    setChartDaysSelected,
  } = useContext(StateContext);

  const filterChartData = useCallback(() => {
    let data: number[] = [];
    let labels: string[] = [];

    switch (chartSelected) {
      case ChartType.Minted:
        labels = supplyHistory.map((mint: supplyItem) =>
          moment.unix(mint.createdAt).utc().format("DD/MM")
        );
        data = supplyHistory.map((mint: supplyItem) => mint.amount);
        break;
      case ChartType.APY:
        labels = apyHistory.map((apy: apyItem) =>
          moment.unix(apy.createdAt).utc().format("DD/MM")
        );
        data = apyHistory.map((apy: apyItem) => apy.amount * apy.deduct);
        break;
      case ChartType.Distribution:
        labels = [" USDC-USH"];
        data = [100];
        break;
    }

    if (chartSelected === ChartType.Distribution) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Dataset",
            data: data,
            backgroundColor: [
              "rgba(149, 113, 247, 0.5)",
              // "rgba(148, 255, 196, 1)",
              // "rgba(16, 107, 244, 0.69)",
              // "rgba(190, 94, 87, 1)",
            ],
            hoverOffset: 4,
          },
        ],
      });

      return;
    }

    setChartData({
      labels,
      datasets: [
        {
          data: data,
          fill: true,
          borderColor: theme === Theme.solana ? "#9945FF" : "#FF5D00",
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createRadialGradient(
              1000,
              -100,
              0,
              500,
              -100,
              600
            );
            gradient.addColorStop(
              0,
              theme === Theme.solana
                ? "rgba(20,241,149,0.5)"
                : "rgba(255, 93, 0, 0.64)"
            );
            gradient.addColorStop(
              1,
              theme === Theme.solana
                ? "rgba(153,69,255, 0.1)"
                : "rgba(236, 6, 1, 0)"
            );
            return gradient;
          },
          tension: 0.3,
          toolbar: true,
        },
      ],
    });
  }, [chartSelected, supplyHistory, apyHistory, theme]);

  useEffect(() => {
    filterChartData();
  }, [chartSelected, supplyHistory, apyHistory, theme]);

  useEffect(() => {
    setChartSelected(ChartType.Minted);
  }, []);

  return (
    <div className="flex flex-col space-y-5 w-[100%] lg:w-[948px]">
      <FlexBoxContent>
        <div
          className="
            flex justify-between flex-col mb-8 
            lg:flex-row lg:mb-0
          "
        >
          <div className="flex flex-col pb-6">
            <div className="text-skin-base/[0.7] font-inter">Total Minted</div>
            {isLoading ? (
              <div className="flex h-12 pl-1">
                <Loading />
              </div>
            ) : (
              <div className="text-[28px] text-skin-base h-12">
                $1USD{" "}
                {truncate({ value: totalSupply, decimals: DecimalsType.two })}
              </div>
            )}

            <div className="flex flex-row space-x-2">
              <div className="text-[14px] text-skin-inverted mt-2  py-2 px-3 bg-skin-accent rounded-xl">
                <span className="font-inter">Rewards:</span>{" "}
                {truncate({ value: currentApy, decimals: DecimalsType.two })}%
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:items-end text-skin-base">
            <DropdownChart
              label="Chart"
              selected={chartSelected}
              setSelected={setChartSelected}
              options={[
                ChartType.Minted,
                ChartType.APY,
                ChartType.Distribution,
              ]}
            />

            {chartSelected !== ChartType.Distribution && (
              <div className="flex flex-row justify-start space-x-2 lg:justify-between items-center text-[10px] mt-5 font-inter">
                <button
                  className={`${
                    chartDaysSelected === ChartDays.seven
                      ? "bg-skin-accent shadow-md text-skin-inverted border-skin-accent/[0.5]"
                      : "border-skin-body text-skin-base hover:bg-skin-accent hover:text-skin-inverted hover:shadow-md"
                  } px-[11px] py-1 rounded-xl border-[1px]`}
                  onClick={() =>
                    chartDaysSelected === ChartDays.seven
                      ? {}
                      : setChartDaysSelected(ChartDays.seven)
                  }
                >
                  W
                </button>
                <button
                  className={`${
                    chartDaysSelected === ChartDays.fifteen
                      ? "bg-skin-accent shadow-md text-skin-inverted border-skin-accent/[0.5]"
                      : "border-skin-body text-skin-base hover:bg-skin-accent hover:text-skin-inverted hover:shadow-md"
                  } px-[11px] py-1 rounded-xl border-[1px]`}
                  onClick={() =>
                    chartDaysSelected === ChartDays.fifteen
                      ? {}
                      : setChartDaysSelected(ChartDays.fifteen)
                  }
                >
                  2 W
                </button>
                <button
                  className={`${
                    chartDaysSelected === ChartDays.thirdy
                      ? "bg-skin-accent shadow-md text-skin-inverted border-skin-accent/[0.5]"
                      : "border-skin-body text-skin-base hover:bg-skin-accent hover:text-skin-inverted hover:shadow-md"
                  } px-[11px] py-1 rounded-xl border-[1px]`}
                  onClick={() =>
                    chartDaysSelected === ChartDays.thirdy
                      ? {}
                      : setChartDaysSelected(ChartDays.thirdy)
                  }
                >
                  M
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`lg:h-[448px] ${
            chartSelected === ChartType.Distribution && "px-[24.8%]"
          }`}
        >
          {chartSelected === ChartType.Distribution &&
            chartData.labels.length > 0 && (
              <Doughnut data={chartData} options={doughnutOptions} />
            )}
          {chartSelected !== ChartType.Distribution &&
            chartData.labels.length > 0 && (
              <Line data={chartData} options={lineOptions} />
            )}
        </div>

        <div
          className="
            flex justify-between
            flex-col gap-6 mt-10 px-0
            md:flex-row md:items-center md:px-5"
        >
          <div className="flex flex-col">
            <h1 className="font-inter text-skin-base/[0.8] text-md">
              Protocol Revenue
            </h1>
            {isLoading ? (
              <div className="flex h-10 pl-1">
                <Loading />
              </div>
            ) : (
              <p className="text-skin-base text-[26px]">
                $
                {truncate({
                  value: totalRevenue,
                  decimals: DecimalsType.two,
                })}
              </p>
            )}
            <div className="h-[1px] md:hidden mt-2 bg-skin-accent/[0.2] rounded-[8px]" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-inter text-skin-base/[0.8] text-md">
              Total Staked
            </h1>

            {isLoading ? (
              <div className="flex h-10 pl-1">
                <Loading />
              </div>
            ) : (
              <p className="text-skin-base text-[26px]">
                $1USD{" "}
                {truncate({ value: totalStaked, decimals: DecimalsType.two })}
              </p>
            )}
            <div className="h-[1px] md:hidden mt-2 bg-skin-accent/[0.2] rounded-[8px]" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-inter text-skin-base/[0.8] text-md">
              Generated yield
            </h1>

            {isLoading ? (
              <div className="flex h-10 pl-1">
                <Loading />
              </div>
            ) : (
              <p className="text-skin-base text-[26px]">
                $
                {truncate({
                  value: totalYield,
                  decimals: DecimalsType.two,
                })}
              </p>
            )}
          </div>
        </div>
      </FlexBoxContent>
    </div>
  );
};

export default Stats;
