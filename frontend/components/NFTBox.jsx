import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketPlaceAbi from "../constants/NftMarketPlace.json";
import basicNftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "@web3uikit/core";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

const truncateStr = (fullstr, strLen) => {
  if (fullstr.length <= strLen) return fullstr;

  const seperator = "...";
  const seperatorLength = seperator.length;
  const charToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charToShow / 2);
  const backChars = Math.floor(charToShow / 2);
  return (
    fullstr.substring(0, frontChars) +
    seperator +
    fullstr.substring(fullstr.length - backChars)
  );
};

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketPlaceAddress,
  seller,
}) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowMoal] = useState(false);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: basicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketPlaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });

  async function updateUI() {
    const tokenURI = await getTokenURI();
    console.log(`The tokenURI is ${tokenURI}`);
    if (tokenURI) {
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      try {
        const tokenURIResponse = await (await fetch(requestURL)).json();
        setImageURI(tokenURIResponse.image);
        setTokenName(tokenURIResponse.name);
        setTokenDescription(tokenURIResponse.description);
      } catch (error) {}
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByUser =
    seller.toLowerCase() === account || seller === undefined;

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowMoal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: handleBuySuccess,
        });
  };

  const handleBuySuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Item bought!",
      title: "Item Bought",
      position: "topR",
    });
  };

  return (
    <div>
      {imageURI ? (
        <div>
          <UpdateListingModal
            nftAddress={nftAddress}
            tokenId={tokenId}
            marketPlaceAddress={marketPlaceAddress}
            isVisible={showModal}
            setIsVisible={setShowMoal}
          />
          <Card
            title={tokenName}
            description={tokenDescription}
            onClick={() => handleCardClick()}
          >
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">
                  Owned by{" "}
                  {isOwnedByUser ? "You" : truncateStr(seller || "", 15)}
                </div>
                <Image
                  loader={() => imageURI}
                  src={imageURI}
                  height="200"
                  width="200"
                />
                <div>{ethers.utils.formatUnits(price, "ether")} ETH</div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
