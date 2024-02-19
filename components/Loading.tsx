export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      <div className="loader flex space-x-[5px]">
        <div className="w-[5px] h-[5px] animate-bounce">
          <div className="w-[5px] h-[5px] bg-skin-base/[60%] rounded-sm animate-pulse" />
        </div>
        <div className="w-[5px] h-[5px] animate-bounce">
          <div className="w-[5px] h-[5px] bg-skin-base/[60%] rounded-sm animate-pulse" />
        </div>
        <div className="w-[5px] h-[5px] animate-bounce">
          <div className="w-[5px] h-[5px] bg-skin-base/[60%] rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
