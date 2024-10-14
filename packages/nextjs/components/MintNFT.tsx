import { useState } from "react";
// Import the uploadNFT function from the updated script
import { uploadNFT } from "../../../uploadToPinata";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const MintNFT = () => {
  const { address: connectedAddress } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  // Hook for writing to the smart contract (assumed contract name is "NFTMint")
  const { writeContractAsync } = useScaffoldWriteContract("NFTMint");

  // Auto-generate metadata and mint NFT
  const handleAutoMintNFT = async () => {
    setIsMinting(true);

    try {
      // Step 1: Define NFT metadata (auto-generated)
      const nftMetadata = {
        name: `NFT #${Date.now()}`, // Unique name based on timestamp
        description: "This is an auto-generated NFT with metadata uploaded to IPFS.",
        attributes: [
          {
            trait_type: "Coolness",
            value: "Super Cool",
          },
        ],
      };

      // Step 2: Upload the image and metadata to Pinata
      const filePath = `./photo/1.png`; // Example image file
      const tokenURI = await uploadNFT(filePath, nftMetadata);
      console.log("Metadata uploaded. IPFS URI:", tokenURI);

      // Step 3: Call the mintNFT function with the IPFS metadata URI
      await writeContractAsync(
        {
          functionName: "mintNFT",
          args: [tokenURI], // Pass the IPFS metadata URI
          value: parseEther("0.01"), // Mint price (0.01 ETH)
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );

      console.log("NFT Minted successfully!");
    } catch (e) {
      console.error("Error minting NFT", e);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="bg-base-300 p-6 rounded-lg max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold mb-2">Mint Your NFT</h2>

      {/* Show connected wallet address and balance */}
      <div className="text-sm font-semibold mb-2">
        Address: <Address address={connectedAddress} />
      </div>

      <div className="text-sm font-semibold mb-4">
        Balance: <Balance address={connectedAddress} />
      </div>

      {/* Button to trigger the automated minting process */}
      <button className="btn btn-primary" onClick={handleAutoMintNFT} disabled={isMinting}>
        {isMinting ? <span className="loading loading-spinner loading-sm"></span> : "Auto Mint NFT"}
      </button>
    </div>
  );
};
