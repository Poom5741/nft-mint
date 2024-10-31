import Image from "next/image";
import { motion } from "framer-motion";

interface ImageSlideShowProps {
  images: string[];
}

const ImageSlideShow = ({ images }: ImageSlideShowProps) => {
  const rows = [
    { images: images.slice(0, 6), direction: "left" },
    { images: images.slice(6, 12), direction: "right" },
    { images: images.slice(12, 18), direction: "left" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden py-4">
      {rows.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className={`flex items-center ${row.direction === "left" ? "justify-start" : "justify-end"}`}
          initial={{ x: row.direction === "left" ? "-20%" : "20%" }} // Start from a slightly larger offset
          animate={{ x: row.direction === "left" ? "20%" : "-20%" }} // Slide to the other side but not completely
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 5, // Adjusted duration for a slower, more fluid motion
            ease: "linear", // Smooth easing to create a gentle back-and-forth motion
          }}
        >
          {row.images.map((src, index) => (
            <div key={index} className="w-[300px] h-[300px] mx-1 flex-shrink-0">
              <Image
                src={src}
                alt={`NFT Image ${index + 1}`}
                width={250}
                height={250}
                className="rounded-lg object-cover"
              />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default ImageSlideShow;
