import React, { useEffect, useState } from "react";
import Image from "next/image";

type MintPreviewCardProps = {
  tokenId: number;
  metadataURI: string;
};

export const MintPreviewCard: React.FC<MintPreviewCardProps> = ({ tokenId, metadataURI }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [metadata, setMetadata] = useState<any>(null);

  // Fetch metadata from the provided URI
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Replace the ipfs:// with your Pinata link format
        const metadataUrl = metadataURI.replace("ipfs://", "https://tomato-academic-dragon-340.mypinata.cloud/ipfs/");
        const response = await fetch(metadataUrl);
        const data = await response.json();
        setMetadata(data);

        // Convert the image IPFS URL to Pinata URL
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
    <div className="card bg-base-100 shadow-xl w-full lg:w-[330px] flex flex-col justify-between mx-auto lg:mx-0 lg:my-0">
      <figure className="flex justify-center items-center h-full p-4">
        {/* Show the image if it's available */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`NFT #${tokenId}`}
            width={300}
            height={300}
            className="rounded-lg object-contain"
            layout="intrinsic"
          />
        ) : (
          <p>Loading image...</p>
        )}
      </figure>
      <div className="card-body text-center">
        {/* Display other metadata information */}
        {metadata && (
          <>
            <p className="text-lg font-bold">{metadata.name}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MintPreviewCard;
