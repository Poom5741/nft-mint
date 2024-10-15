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
    return null;
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
    return null;
  }
}

// Main function to upload multiple files and their metadata
async function main() {
  const metadataURIs = [];

  for (let i = 1; i <= 10; i++) {
    const filePath = `./photo/${i}.png`; // File path for each image (1.png to 10.png)

    // Upload the file to Pinata and get the file's IPFS hash
    const fileHash = await uploadFileToPinata(filePath);

    if (fileHash) {
      // Create metadata for each NFT
      const metadata = {
        name: `My Cool NFT ${i}`,
        description: `This is an amazing piece of digital art for NFT ${i}`,
        image: `ipfs://${fileHash}`, // Use the file hash in metadata
        attributes: [
          {
            trait_type: "Background",
            value: "Blue",
          },
          {
            trait_type: "Eyes",
            value: "Green",
          },
        ],
      };

      // Upload the metadata to Pinata and get the metadata's IPFS hash
      const metadataHash = await uploadMetadataToPinata(metadata);

      // Push the metadata URI to the array
      if (metadataHash) {
        metadataURIs.push(metadataHash);
      }
    }
  }

  // Create and write the metadataURIs array to metadataURIs.js file
  const content = `const ipfsMetadataURIs = ${JSON.stringify(
    metadataURIs,
    null,
    2
  )};\n\nmodule.exports = ipfsMetadataURIs;`;
  fs.writeFileSync("./metadataURIs.js", content, "utf8");
  console.log("IPFS Metadata URIs have been saved to metadataURIs.js");
}

// Execute the main function
main().catch((error) => {
  console.error("Error in the upload process:", error);
});
