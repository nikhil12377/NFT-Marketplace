const { ethers } = require("hardhat");
const { mintAndList } = require("./mint-and-list");

async function buyNFT() {
  const signers = await ethers.getSigners();
  const buyer = signers[1];

  let nftAddress, tokenId;

  const values = await mintAndList();
  nftAddress = values[0];
  tokenId = values[1];
  console.log(nftAddress);

  const nftMarketplace = await ethers.getContract("NftMarketPlace", buyer);
  console.log("Buying...");
  const buyTx = await nftMarketplace.buyItem(nftAddress, tokenId);
  await buyTx.wait(1);
  console.log("Bought the NFT!");
}

buyNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
