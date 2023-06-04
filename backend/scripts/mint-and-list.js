const { network, ethers } = require("hardhat");

async function mintAndList() {
  const PRICE = ethers.utils.parseEther("0.1");
  const basicNft = await ethers.getContract("BasicNft");
  const nftMarketplace = await ethers.getContract("NftMarketPlace");

  console.log("Minting...");
  const nftTx = await basicNft.mintNft();
  const nftTxReciept = await nftTx.wait(1);
  const tokenId = await nftTxReciept.events[0].args.tokenId;

  console.log("Approving NFT...");
  const approveNftTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approveNftTx.wait(1);

  console.log("Listing NFT...");
  const listingTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    PRICE
  );
  await listingTx.wait(1);
  console.log("Listed!");

  return [basicNft.address, tokenId];
}

module.exports = { mintAndList };

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
