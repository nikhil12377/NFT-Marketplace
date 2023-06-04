const path = require("path");
const fs = require("fs");
const pinataSDK = require("@pinata/sdk");
require("dotenv").config();

const pinataAPIKey = process.env.PINATA_API_KEY;
const pinataAPISecret = process.env.PINATA_API_SECRET;
const pinata = new pinataSDK(pinataAPIKey, pinataAPISecret);

async function storeImages(imagePath) {
  const fullImagePath = path.resolve(imagePath);
  const files = fs.readdirSync(fullImagePath);
  let responses = [];
  for (fileIndex in files) {
    console.log(`working on ${files[fileIndex]}...`);
    const readableStreamForFile = fs.createReadStream(
      `${fullImagePath}/${files[fileIndex]}`
    );
    const options = {
      pinataMetadata: {
        name: files[fileIndex],
      },
    };
    try {
      const response = await pinata.pinFileToIPFS(
        readableStreamForFile,
        options
      );
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }

  return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { storeImages, storeTokenUriMetadata };
