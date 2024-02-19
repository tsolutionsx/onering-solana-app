export default function Stats() {
  const stats = [
    { title: "RING price", value: 5 },
    { title: "Supply", value: 50000000 },
    { title: "Market cap", value: 250 },
  ];
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center font-inter text-[14px] sm:text-[16px] space-y-2 sm:space-y-0 sm:space-x-5 pb-[80px]">
      {stats.map((item, index) => (
        <div
          key={index}
          className="flex flex-row justify-center items-center space-x-2"
        >
          <p className="text-light/[48%]">{item.title}</p>
          <p className="text-light">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
