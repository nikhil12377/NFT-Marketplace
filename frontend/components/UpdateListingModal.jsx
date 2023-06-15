import { Input, Modal, useNotification } from "@web3uikit/core";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketPlaceAbi from "../constants/NftMarketPlace.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  marketPlaceAddress,
  isVisible,
  setIsVisible,
}) {
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("");
  const dispatch = useNotification();

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketPlaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
  });

  const handleUpdateListingSucces = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Listing Updated",
      title: "Listing Updated - Please Refresh (and move blocks)",
      position: "topR",
    });
    setPriceToUpdateListingWith("0");
  };
  return (
    <Modal
      isVisible={isVisible}
      onCloseButtonPressed={() => {
        setIsVisible(false);
        setPriceToUpdateListingWith("");
      }}
      onOk={() => {
        updateListing({
          onError: (error) => {
            console.log(error);
          },
          onSuccess: handleUpdateListingSucces,
        });
      }}
      onCancel={() => {
        setIsVisible(false);
        setPriceToUpdateListingWith("");
      }}
    >
      <Input
        label="Update listing price in L1 Currency (ETH)"
        name="New listing price"
        type="number"
        value={priceToUpdateListingWith}
        onChange={(event) => {
          setPriceToUpdateListingWith(event.target.value);
        }}
      />
    </Modal>
  );
}
