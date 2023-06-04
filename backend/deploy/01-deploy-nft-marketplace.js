const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat.config");
const { verify } = require("../utils/verify");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [];

  log(
    "-------------------------------------------------------------------------------------"
  );
  log("Deploying NFT Marketplace...");
  const nftMarketplace = await deploy("NftMarketPlace", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("Successfully Deployed!");

  log("Contract Address: ", nftMarketplace.address);

  log(
    "-----------------------------------------------------------------------------------"
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    try {
      log("Verifying...");
      verify(nftMarketplace.address, args);
      log("Verified!");
    } catch (error) {
      log(error);
    }
  }
};

module.exports.tags = ["all", "nftmarketplace"];
