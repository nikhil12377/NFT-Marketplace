const { assert, expect } = require("chai");
const { network, deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NFT Marketplace Tests", () => {
      let NftMarketplace,
        BasicNft,
        deployer,
        player,
        playerConnectedNftMarketplace;
      let PRICE = ethers.utils.parseEther("0.1");
      let TOKEN_ID = 0;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        player = (await getNamedAccounts()).player;
        await deployments.fixture(["all"]);
        NftMarketplace = await ethers.getContract("NftMarketPlace");
        playerConnectedNftMarketplace = await ethers.getContract(
          "NftMarketPlace",
          player
        );
        BasicNft = await ethers.getContract("BasicNft");

        await BasicNft.mintNft();
        await BasicNft.approve(NftMarketplace.address, TOKEN_ID);
      });

      it("Lists and can be bought", async () => {
        NftMarketplace.listItem(BasicNft.address, TOKEN_ID, PRICE);
        await playerConnectedNftMarketplace.buyItem(
          BasicNft.address,
          TOKEN_ID,
          { value: PRICE }
        );
        const owner = await BasicNft.ownerOf(TOKEN_ID);
        const deployerProceeds = await NftMarketplace.getProceeds(deployer);
        assert(owner.toString() == player);
        assert(deployerProceeds.toString() == PRICE.toString());
      });

      it("Cancels item", async () => {
        NftMarketplace.listItem(BasicNft.address, TOKEN_ID, PRICE);
        const itemBeforeCancel = await NftMarketplace.getListing(
          BasicNft.address,
          TOKEN_ID
        );
        await NftMarketplace.cancelItem(BasicNft.address, TOKEN_ID);
        const itemAfterCancel = await NftMarketplace.getListing(
          BasicNft.address,
          TOKEN_ID
        );

        assert(itemBeforeCancel != itemAfterCancel);
      });

      it("Updates the price of the NFT in the Marketplace", async () => {
        NftMarketplace.listItem(BasicNft.address, TOKEN_ID, PRICE);
        const newPrice = ethers.utils.parseEther("0.2");
        await NftMarketplace.updateListing(
          BasicNft.address,
          TOKEN_ID,
          newPrice
        );
        const item = await NftMarketplace.getListing(
          BasicNft.address,
          TOKEN_ID
        );
        const tempPrice = item.price;
        assert(newPrice == tempPrice.toString());
      });

      it("Withdraw proceeds", async () => {
        NftMarketplace.listItem(BasicNft.address, TOKEN_ID, PRICE);
        await playerConnectedNftMarketplace.buyItem(
          BasicNft.address,
          TOKEN_ID,
          { value: PRICE }
        );
        const proceeds = await NftMarketplace.getProceeds(deployer);
        await NftMarketplace.withdrawProceeds();
        const newProceeds = await NftMarketplace.getProceeds(deployer);

        assert(proceeds.toString() != "0");
        assert(newProceeds.toString() == "0");
      });
    });
