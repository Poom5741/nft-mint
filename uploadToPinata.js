const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
require("dotenv").config();

// Load your Pinata API keys from .env
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Function to upload a file to Pinata
async function uploadFileToPinata(filePath) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();

  // Read the file and append to form data
  const fileStream = fs.createReadStream(filePath);
  data.append("file", fileStream);

  try {
    const response = await axios.post(url, data, {
      maxBodyLength: "Infinity", // For large file support
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    console.log(
      `File ${filePath} successfully uploaded to IPFS! IPFS Hash:`,
      response.data.IpfsHash
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error(`Error uploading file ${filePath} to Pinata:`, error);
    throw new Error("File upload failed");
  }
}

// Function to upload metadata to Pinata
async function uploadMetadataToPinata(metadata) {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  try {
    const response = await axios.post(url, metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    console.log(
      "Metadata successfully uploaded to IPFS! IPFS Hash:",
      response.data.IpfsHash
    );
    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw new Error("Metadata upload failed");
  }
}

// Function to handle the entire NFT upload (both file and metadata)
async function uploadNFT(filePath, nftMetadata) {
  try {
    // Step 1: Upload the image to Pinata and get the IPFS hash
    const fileHash = await uploadFileToPinata(filePath);
    console.log(`File uploaded. IPFS Hash: ipfs://${fileHash}`);

    // Step 2: Create metadata and set the image URI to the uploaded file
    const metadata = {
      ...nftMetadata, // Spread metadata passed from the MintNFT component
      image: `ipfs://${fileHash}`, // Attach the image IPFS hash to the metadata
    };

    // Step 3: Upload the metadata to Pinata and get the IPFS hash
    const metadataURI = await uploadMetadataToPinata(metadata);

    // Step 4: Return the IPFS URI of the metadata for minting
    return metadataURI;
  } catch (error) {
    console.error("Error during NFT upload process:", error);
    throw new Error("NFT upload failed");
  }
}

// Export the upload function to be used in the MintNFT component
module.exports = {
  uploadNFT,
};
