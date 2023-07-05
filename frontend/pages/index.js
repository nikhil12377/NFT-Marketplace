import "../styles/Home.module.css";
import NFTBox from "../components/NFTBox";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMappings from "../constants/networkMappings.json";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEM from "../constants/subGraphQueries";

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketPlaceAddress = networkMappings[chainString].NftMarketPlace[0];

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEM);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>loading...</div>
          ) : (
            listedNfts.activeItems.map((nft, index) => {
              console.log(nft);
              const { price, nftAddress, tokenId, seller } = nft;
              return (
                <NFTBox
                  key={index}
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketPlaceAddress={marketPlaceAddress}
                  seller={seller}
                />
              );
            })
          )
        ) : (
          <div>Connect your account</div>
        )}
      </div>
    </div>
  );
}
