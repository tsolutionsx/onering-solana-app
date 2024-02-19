import { useContext } from "react";
import { StateContext } from "../context/StateContext";
import _ from "lodash";
import { TabType } from "../utils/constants";

type Props = {
  tabs: TabType[];
};

export default function ModeSelect({ tabs }: Props) {
  const { selectedTab, setSelectedTab } = useContext(StateContext);

  return (
    <div className="flex flex-row justify-center items-center p-[4px] w-auto h-[40px] bg-skin-inverted shadow-internal rounded-[8px] text-[14px] text-skin-base">
      {tabs.map((itemTab, index) => (
        <button
          key={index}
          onClick={() => setSelectedTab(itemTab.valueOf())}
          className={`
            w-full
            text-center
            h-[32px]
            ${
              itemTab === selectedTab &&
              "bg-skin-inverted shadow-lightDropdown py-[4px] rounded-[8px] text-skin-accent"
            }            
          `}
        >
          {_.upperFirst(itemTab.valueOf())}
        </button>
      ))}
    </div>
  );
}
