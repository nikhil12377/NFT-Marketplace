import { ConnectButton } from "@web3uikit/web3";
import Link from "next/link";

export const Header = () => {
  return (
    <nav className="p-3 flex justify-between flex-row">
      <h1 className="py-2 text-white px-4 font-bold text-3xl">
        NFT Marketplace
      </h1>
      <div className="flex flex-row content-center">
        <Link href="/">
          <a className="mr-4 p-3 text-xl text-white font-bold">Home</a>
        </Link>
        <Link href="/sell-nft">
          <a className="mr-4 p-3 text-xl text-white font-bold">Sell NFT</a>
        </Link>
        <div className="ml-auto py-2 px-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};
