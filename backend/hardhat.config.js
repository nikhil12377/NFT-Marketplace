require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  // solidity: "0.8.9",
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
        // Runs: 100
        // BaiscNFT         1096701
        // NftMarketplace   734281

        // Runs: 200
        // BaiscNFT         1133706
        // NftMarketplace   737701

        // Runs: 500
        // BaiscNFT         1194731
        // NftMarketplace   743325

        // Runs: 1000
        // BaiscNFT         1233193
        // NftMarketplace   794260
      },
      { version: "0.6.6" },
      { version: "0.4.19" },
      { version: "0.6.12" },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainID: 31337,
      // forking: {
      //   url: process.env.MAINNET_RPC_PROVIDER,
      // },
      blockConfirmations: 1,
    },
    goerli: {
      chainID: 5,
      blockConfirmations: 6,
      url: process.env.GOERLI_RPC_PROVIDER,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    token: "ETH",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
};
