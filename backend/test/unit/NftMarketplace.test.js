const { assert, expect } = require("chai");
const { network, deployments, getNamedAccounts } = require("hardhat");
const { ethers } = require("ethers");
const { developmentChains } = require("../../helper-hardhat.config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFT Marketplace Tests", () => {
      let NftMarketplace, BasicNft, deployer, player;
      let PRICE = ethers.utils.parseEther("0.1");
      let TOKEN_ID = 0;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        player = (await getNamedAccounts()).player;
        await deployments.fixture(["all"]);
        NftMarketplace = await ethers.Contract("NftMarketPlace");
        BasicNft = await ethers.Contract("BasicNft");
        await BasicNft.mintNft();
        await BasicNft.approve(NftMarketplace.address, TOKEN_ID);
      });

      it("Lists and can be bought", async () => {
        NftMarketplace.listItem(BasicNft.address, TOKEN_ID, PRICE);
        const playerConnectedNftMarketplace = await NftMarketplace.connect(
          player
        );
        await playerConnectedNftMarketplace.buyItem(
          BasicNft.address,
          TOKEN_ID,
          { value: PRICE }
        );
        const owner = await BasicNft.ownerOf(TOKEN_ID);
        const deployerProceeds = await NftMarketplace.getProceeds(deployer);

        assert(owner.toString() == player.address);
        assert(deployerProceeds.toString() == PRICE.toString());
      });
    });
