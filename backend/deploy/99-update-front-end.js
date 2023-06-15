const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractFiles = "../frontend/constants/networkMappings.json";
const frontendABILocation = "../frontend/constants/";

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating frontend");
    await updateContractAddresses();
    await updateABI();
    console.log("Done!");
  }
};

async function updateABI() {
  const nftMarketplace = await ethers.getContract("NftMarketPlace");
  fs.writeFileSync(
    `${frontendABILocation}NftMarketPlace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );

  const BasicNft = await ethers.getContract("BasicNft");
  fs.writeFileSync(
    `${frontendABILocation}BasicNft.json`,
    BasicNft.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const nftMarketplace = await ethers.getContract("NftMarketPlace");
  const chainId = network.config.chainId.toString();
  let contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractFiles, "utf8")
  );

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftMarketPlace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["NftMarketPlace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { NftMarketPlace: [nftMarketplace.address] };
  }

  fs.writeFileSync(frontEndContractFiles, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
