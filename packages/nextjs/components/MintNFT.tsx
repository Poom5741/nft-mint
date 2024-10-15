import { useEffect, useState } from "react";
import ipfsMetadataURIs from "./../metadataURIs";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Adjust the path as needed

export const MintNFT = () => {
  const { address: connectedAddress } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [nextTokenId, setNextTokenId] = useState(0); // Next available token ID to mint
  const [metadataURI, setMetadataURI] = useState(""); // Metadata URI for the next NFT

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

  // Mint NFT with the next available metadata URI
  const handleMintNFT = async () => {
    if (nextTokenId >= ipfsMetadataURIs.length) {
      alert("All NFTs have been minted!");
      return;
    }

    setIsMinting(true);

    try {
      console.log("Minting NFT with Metadata URI:", metadataURI);

      // Call the mintNFT function with the IPFS metadata URI
      const result = await writeContractAsync({
        functionName: "mintNFT",
        args: [metadataURI], // Pass the IPFS metadata URI
        value: parseEther("0.01"), // Mint price (0.01 ETH)
      });

      console.log("Transaction result:", result);

      if (result) {
        console.log("Transaction sent! Waiting for confirmation...");
      }
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

      {/* Display information about the next NFT to be minted */}
      <div className="text-sm mb-4">
        <p>Next available NFT: #{nextTokenId}</p>
        <p>Metadata URI: {metadataURI}</p>
      </div>

      {/* Button to trigger the minting process */}
      <button className="btn btn-primary" onClick={handleMintNFT} disabled={isMinting || isPending}>
        {isMinting || isPending ? <span className="loading loading-spinner loading-sm"></span> : "Mint NFT"}
      </button>
    </div>
  );
};
