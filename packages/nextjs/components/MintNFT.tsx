import { useEffect, useState } from "react";
import ipfsMetadataURIs from "./../metadataURIs";
import { MintPreviewCard } from "./MintPreviewCard";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Import the MintPreviewCard

export const MintNFT = () => {
  const { address: connectedAddress } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [nextTokenId, setNextTokenId] = useState(0); // Next available token ID to mint
  const [metadataURI, setMetadataURI] = useState(""); // Metadata URI for the next NFT
  const [mintAmount, setMintAmount] = useState(1); // Number of NFTs to mint

  // Hook for reading the current token ID from the smart contract
  const { data: currentTokenId } = useScaffoldReadContract({
    contractName: "NFTMint",
    functionName: "currentTokenId", // Assumes the smart contract has a public `currentTokenId` function
  });

  // Hook for writing to the smart contract
  const { writeContractAsync, isPending } = useScaffoldWriteContract("NFTMint");

  // Effect to update the next token ID and corresponding metadata URI
  useEffect(() => {
    if (currentTokenId !== undefined && currentTokenId < ipfsMetadataURIs.length) {
      setNextTokenId(Number(currentTokenId) + 1); // Next token ID to mint
      setMetadataURI(ipfsMetadataURIs[Number(currentTokenId)]); // Corresponding metadata URI
    }
  }, [currentTokenId]);

  // Mint multiple NFTs with the next available metadata URIs
  const handleMintNFT = async () => {
    if (nextTokenId + mintAmount - 1 >= ipfsMetadataURIs.length) {
      alert("Not enough NFTs left to mint this many!");
      return;
    }

    setIsMinting(true);

    try {
      // Loop to mint the selected number of NFTs
      for (let i = 0; i < mintAmount; i++) {
        const tokenId = nextTokenId + i;
        const tokenURI = ipfsMetadataURIs[tokenId];
        console.log(`Minting NFT #${tokenId} with Metadata URI:`, tokenURI);

        // Call the mintNFT function with the IPFS metadata URI for each NFT
        const result = await writeContractAsync({
          functionName: "mintNFT",
          args: [tokenURI], // Pass the IPFS metadata URI
          value: parseEther("0.01"), // Mint price (0.01 ETH) per NFT
        });

        console.log(`Transaction result for NFT #${tokenId}:`, result);
      }

      console.log("All NFTs minted successfully!");
    } catch (e) {
      console.error("Error minting NFTs", e);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-8 p-8 h-full">
      {/* Minting Card */}
      <div className="bg-base-300 p-6 rounded-lg w-full lg:w-1/2 h-full flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-2">Mint Your NFTs</h2>

          {/* Show connected wallet address and balance */}
          <div className="text-sm font-semibold mb-2">
            Address: <Address address={connectedAddress} />
          </div>

          <div className="text-sm font-semibold mb-4">
            Balance: <Balance address={connectedAddress} />
          </div>

          {/* Display information about the next NFT to be minted */}
          <div className="text-sm mb-4">
            <p>Next available NFT: #{nextTokenId}</p>
          </div>

          {/* Daisy UI Slider and Input to select minting amount */}
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1}
              max={10}
              value={mintAmount}
              className="range range-primary"
              step={1} // Increments of 1
              onChange={e => setMintAmount(Number(e.target.value))}
            />
            <input
              type="number"
              min={1}
              max={10}
              value={mintAmount}
              className="input input-bordered w-20 text-center"
              onChange={e => setMintAmount(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Button to trigger the minting process */}
        <button
          className={`btn btn-primary mt-4 w-full ${isMinting || isPending ? "loading" : ""}`}
          onClick={handleMintNFT}
          disabled={isMinting || isPending}
        >
          {isMinting || isPending ? "Minting..." : `Mint ${mintAmount} NFT${mintAmount > 1 ? "s" : ""}`}
        </button>
      </div>

      {/* Mint Preview Card */}
      <div className="h-full flex-grow">
        <MintPreviewCard tokenId={nextTokenId} metadataURI={metadataURI} />
      </div>
    </div>
  );
};

export default MintNFT;
