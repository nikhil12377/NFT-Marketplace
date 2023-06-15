const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT Tests", () => {
      let BasicNft;
      const TOKEN_ID = 0;
      beforeEach(async () => {
        await deployments.fixture(["basicNft"]);
        BasicNft = await ethers.getContract("BasicNft");
      });

      it("Constructor", async () => {
        const counter = await BasicNft.getTokenCounter();
        assert(counter.toString() == "0");
      });

      it("NFT Minted", async () => {
        await BasicNft.mintNft();
        const tokenUri = await BasicNft.tokenURI(TOKEN_ID);
        const counter = await BasicNft.getTokenCounter();
        assert(counter.toString() == "1");
        assert(
          tokenUri.toString() ==
            "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
        );
      });

      it("Token doesn't exists", async () => {
        await expect(BasicNft.tokenURI(TOKEN_ID)).to.be.revertedWith(
          "ERC721Metadata: URI query for nonexistent token"
        );
      });
    });
