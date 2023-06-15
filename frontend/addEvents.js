const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMappings.json");

let chainId = process.env.chainId || 31337;

const contractAddress = contractAddresses[chainId]["NftMarketPlace"][0];

async function main() {}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
