import { useEffect, useState } from "react";
import ipfsMetadataURIs from "./../metadataURIs";
import { MintPreviewCard } from "./MintPreviewCard";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const MintNFT = () => {
  const { isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [nextTokenId, setNextTokenId] = useState(0);
  const [metadataURI, setMetadataURI] = useState("");
  const [mintAmount, setMintAmount] = useState(1);

  const { data: currentTokenId } = useScaffoldReadContract({
    contractName: "NFTMint",
    functionName: "currentTokenId",
  });

  const { writeContractAsync, isPending } = useScaffoldWriteContract("NFTMint");

  useEffect(() => {
    if (currentTokenId !== undefined && currentTokenId < ipfsMetadataURIs.length) {
      setNextTokenId(Number(currentTokenId) + 1);
      setMetadataURI(ipfsMetadataURIs[Number(currentTokenId)]);
    }
  }, [currentTokenId]);

  const handleMintNFT = async () => {
    if (nextTokenId + mintAmount - 1 >= ipfsMetadataURIs.length) {
      alert("Not enough NFTs left to mint this many!");
      return;
    }
    setIsMinting(true);
    try {
      for (let i = 0; i < mintAmount; i++) {
        const tokenId = nextTokenId + i;
        const tokenURI = ipfsMetadataURIs[tokenId];
        await writeContractAsync({
          functionName: "mintNFT",
          args: [tokenURI],
          value: parseEther("0.01"),
        });
      }
      console.log("All NFTs minted successfully!");
    } catch (e) {
      console.error("Error minting NFTs", e);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-10 p-8 h-screen w-full bg-base-200 text-base-content rounded-lg shadow-lg mx-auto">
      {/* Mint Preview Card */}
      <div className="lg:w-1/3 w-full max-w-lg">
        <MintPreviewCard tokenId={nextTokenId} metadataURI={metadataURI} />
      </div>

      {/* Minting Card */}
      <div className="bg-base-300 p-8 rounded-lg w-full lg:w-1/2 max-w-2xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-primary">Mint Your NFTs</h2>
          <RainbowKitCustomConnectButton />
        </div>

        <p className="text-lg font-semibold mb-4 text-secondary">
          Next available NFT: <span className="text-success">#{nextTokenId}</span>
        </p>

        <div className="text-lg font-semibold mb-4 text-accent">
          <p>
            Mint Price: <span className="text-success">0.01 ETH</span>
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="text-lg">Quantity:</label>
          <input
            type="number"
            min={1}
            max={10}
            value={mintAmount}
            className="input input-bordered w-20 text-center bg-neutral text-base-content"
            onChange={e => setMintAmount(Number(e.target.value))}
          />
        </div>

        <button
          className={`btn btn-accent w-full ${isMinting || isPending ? "loading" : ""}`}
          onClick={handleMintNFT}
          disabled={isMinting || isPending || !isConnected}
        >
          {isMinting || isPending ? "Minting..." : `Mint ${mintAmount} NFT${mintAmount > 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
};

export default MintNFT;
