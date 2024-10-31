import React, { useEffect, useState } from "react";
import Image from "next/image";

type MintPreviewCardProps = {
  tokenId: number;
  metadataURI: string;
};

export const MintPreviewCard: React.FC<MintPreviewCardProps> = ({ tokenId, metadataURI }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadataUrl = metadataURI.replace("ipfs://", "https://tomato-academic-dragon-340.mypinata.cloud/ipfs/");
        const response = await fetch(metadataUrl);
        const data = await response.json();
        setMetadata(data);

        const imageUrlFromMetadata = data.image.replace(
          "ipfs://",
          "https://tomato-academic-dragon-340.mypinata.cloud/ipfs/",
        );
        setImageUrl(imageUrlFromMetadata);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, [metadataURI]);

  return (
    <div className="card bg-base-300 shadow-lg p-4 w-full h-auto text-base-content rounded-lg">
      <figure className="flex justify-center items-center p-4">
        {imageUrl ? (
          <Image src={imageUrl} alt={`NFT #${tokenId}`} width={400} height={400} className="rounded-lg object-cover" />
        ) : (
          <p>Loading image...</p>
        )}
      </figure>
      <div className="card-body text-center">
        {metadata && <p className="text-lg font-bold text-primary-content">{metadata.name}</p>}
      </div>
    </div>
  );
};

export default MintPreviewCard;
