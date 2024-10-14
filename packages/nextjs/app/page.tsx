"use client";

import type { NextPage } from "next";
import { MintNFT } from "~~/components/MintNFT";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <MintNFT />
      </div>
    </>
  );
};

export default Home;
