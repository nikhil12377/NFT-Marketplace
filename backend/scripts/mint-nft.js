const { network, ethers } = require("hardhat");

async function mintAndList() {
  const PRICE = ethers.utils.parseEther("0.1");
  const basicNft = await ethers.getContract("BasicNft");
  const nftMarketplace = await ethers.getContract("NftMarketPlace");

  console.log("Minting...");
  const nftTx = await basicNft.mintNft();
  const nftTxReciept = await nftTx.wait(1);
  const tokenId = await nftTxReciept.events[0].args.tokenId;

  console.log(basicNft.address);
  console.log(tokenId.toString());
}

module.exports = { mintAndList };

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
