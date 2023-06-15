import { Form, useNotification } from "@web3uikit/core";
import "../styles/Home.module.css";
import { ethers } from "ethers";
import basicNftAbi from "../constants/BasicNft.json";
import nftMarketPlaceAbi from "../constants/NftMarketPlace.json";
import networkMappings from "../constants/networkMappings.json";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default function SellNFT() {
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : "31337";
  const marketPlaceAddress = networkMappings[chainString].NftMarketPlace[0];
  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract();
  async function approveAndList(data) {
    console.log("Approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    console.log(nftAddress);
    console.log(tokenId);
    console.log(price);

    const approveOptions = {
      abi: basicNftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketPlaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: async (tx) => {
        await tx.wait(1);
        handleApproveSuccess(nftAddress, tokenId, price);
      },
      onError: (error) => console.log(error),
    });
  }

  const handleApproveSuccess = async (nftAddress, tokenId, price) => {
    console.log("Listing...");
    const listingOptions = {
      abi: nftMarketPlaceAbi,
      contractAddress: marketPlaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listingOptions,
      onSuccess: handleListSuccess,
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleListSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Item Listed!",
      title: "Item Listed",
      position: "topR",
    });
  };
  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (in ETH)",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "price",
          },
        ]}
        title="Sell Your NFT"
        id="Main Func"
      />
    </div>
  );
}
