"use client";

import type { NextPage } from "next";
import ImageSlideShow from "~~/components/ImageSlideShow";
import { MintNFT } from "~~/components/MintNFT";

const Home: NextPage = () => {
  const images = Array.from({ length: 20 }, (_, i) => `/nft-images/${i + 1}.png`);
  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        <MintNFT />
        <ImageSlideShow images={images} />
      </div>
    </>
  );
};

export default Home;
