export default function Faq() {
  return (
    <div className="text-skin-base text-xl bg-skin-inverted/[80%] rounded-xl px-12 py-10">
      <h1 className="text-skin-accent text-4xl">FAQs</h1>

      <h2 className="text-skin-accent mt-10">
        What currency can I use to mint 1USD?
      </h2>
      <p className="font-inter text-lg">
        Currently we are only supporting USDC, although users can use our SWAP
        to convert any of their tokens to USDC.
      </p>

      <h2 className="text-skin-accent mt-10">
        Do we have to stake 1USD to earn Yields?
      </h2>
      <p className="font-inter text-lg">
        Yes, this is really important. Users who don't stake their 1USD won't
        receive Yields.
      </p>

      <h2 className="text-skin-accent mt-10">Are my Yields auto-compounded?</h2>
      <p className="font-inter text-lg">
        Yes, Auto-Compound is done on a weekly basis.
      </p>
      <h2 className="text-skin-accent mt-10">Why can't I redeem my 1USD?</h2>
      <p className="font-inter text-lg">
        This is usually due to a 24 hour waiting period before you can redeem it
        back to USDC. The timer resets in case you mint more during this period.
      </p>
      <h2 className="text-skin-accent mt-10">
        Why is my transaction failing?{" "}
      </h2>
      <p className="font-inter text-lg">
        This is mainly due to Solana Network congestion issues. Please wait for
        some time and try again. If it still fails, contact any of the admins on
        Discord or Telegram.{" "}
        <span className="font-bold text-skin-accent">REMEMBER:</span> ADMINS
        NEVER DM FIRST!
      </p>
      <h2 className="text-skin-accent mt-10">
        Is there a Lock period for my Funds?
      </h2>
      <p className="font-inter text-lg">
        There is no lock period whatsoever. However, we would advise you to use
        the calculator on the site to determine your breakeven period or how
        much you stand to earn for a custom period of your choosing.
      </p>
      <h2 className="text-skin-accent mt-10">Is there a fee?</h2>
      <p className="font-inter text-lg">
        There is a redemption fee of 0.3% by the protocol (other than what DEXs
        charge for withdrawal, which is usually 0.2%).
      </p>
      <h2 className="text-skin-accent mt-10">What's a performance fee?</h2>
      <p className="font-inter text-lg">
        The performance fee is 20% which is taken off your YIELD (NOT CAPITAL)
        as a revenue for the protocol.
      </p>
      <h2 className="text-skin-accent mt-10">
        What are the Routers when I try to SWAP?
      </h2>
      <p className="font-inter text-lg">
        Our protocol scans the market and displays you the best options in terms
        of returns. You can choose freely from given options.
      </p>
    </div>
  );
}
