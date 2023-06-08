const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractFiles = "../frontend/constants/networkMappings.json";

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating frontend");
    await updateContractAddresses();
  }
};

async function updateContractAddresses() {
  const nftMarketplace = await ethers.getContract("NftMarketPlace");
  const chainId = network.config.chainID;
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractFiles, "utf-8")
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
    contractAddresses[chainId]["NftMarketPlace"] = [nftMarketplace.address];
  }

  fs.writeFileSync(frontEndContractFiles, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
