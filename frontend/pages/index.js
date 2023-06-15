import "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      {isWeb3Enabled ? (
        <div className="flex flex-wrap">
          <NFTBox
            price="1000000000000000000"
            nftAddress="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
            tokenId="0"
            marketPlaceAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3"
            seller="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
          />
        </div>
      ) : (
        <div>Connect your account</div>
      )}
    </div>
  );
}
