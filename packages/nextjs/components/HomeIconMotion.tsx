import { useState } from "react";
import Image from "next/image";
import MintNFT from "./MintNFT";
import { motion } from "framer-motion";

// Import the MintNFT component

const HomeIconMotion = () => {
  const [showDetails, setShowDetails] = useState(false);

  // Animation for the panel coming into view
  const sidebarVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen relative">
      {/* Floating Image with onClick */}
      <motion.div
        animate={{
          y: [0, -20, 0], // up and down motion
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <Image
          src="https://tomato-academic-dragon-340.mypinata.cloud/ipfs/QmQbwntptx77vzjpjC4G3SGqCbovAAxn96Mi5MjGDgUTNm"
          alt="Floating Image"
          width={300}
          height={300}
          className="rounded-lg"
        />
      </motion.div>

      {/* Sidebar/Panel with MintNFT component */}
      {showDetails && (
        <motion.div
          className="fixed top-0 right-0 h-full w-1/3 bg-gray-900 text-white shadow-lg overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
        >
          {/* Scrollable content with padding */}
          <div className="p-8">
            {/* Render MintNFT component */}
            <MintNFT />

            {/* Close Button */}
            <button className="btn btn-secondary mt-4" onClick={() => setShowDetails(false)}>
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomeIconMotion;
