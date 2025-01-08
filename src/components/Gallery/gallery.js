import React from "react";
// import Masonry from './Masonry';
import GridMotion from "./GridMotion";
import SplitText from "./SplitText";
import SpotlightCard from "./SpotlightCard";

function gallery() {
  //the photos from back end will go here
  const items = Array(28)
    .fill()
    .map((_, index) => <div>Item {index + 1}</div>);

  const handleAnimationComplete = () => {
    //dummmy function
  };

  //items are taken from the backend
  const GalleryElements = [
    {
      img: "https://via.placeholder.com/300x200",
      heading: "Sunset Over the Hills",
      description:
        "A breathtaking view of the sun setting over lush green hills.",
    },
    {
      img: "https://via.placeholder.com/300x200",
      heading: "Tranquil Lake",
      description:
        "The still waters of a lake reflecting the surrounding trees.",
    },
    {
      img: "https://via.placeholder.com/300x200",
      heading: "City Skyline",
      description: "A bustling city skyline glowing under the night sky.",
    },
    {
      img: "https://via.placeholder.com/300x200",
      heading: "Golden Sands",
      description: "Golden sand dunes stretching into the horizon.",
    },
    {
      img: "https://via.placeholder.com/300x200",
      heading: "Forest Trail",
      description: "A serene trail winding through a dense forest.",
    },
    {
      img: "https://via.placeholder.com/300x200",
      heading: "Mountain Peak",
      description: "A majestic mountain peak covered in snow.",
    },
  ];

  return (
    <>
      <div className="relative flex fustify-center items-center overflow-hidden ">
        <div
          className="relative flex justify-center items-center overflow-hidden bg-white h-screen w-screen"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        >
          <GridMotion items={items} />
        </div>

        <div className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black">
          <SplitText
            text="Gallery!"
            className="text-[10rem] font-semibold text-center"
            delay={150}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-around gap-6 p-6">
        {GalleryElements.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between border rounded-lg shadow-md w-[40vw] h-[400px] bg-white"
          >
            <SpotlightCard
              className="custom-spotlight-card w-full h-full"
              spotlightColor="rgba(0, 0, 0, 0.6)"
            >
              <div className="flex items-center p-4">
                {/* Make sure the image's container has enough height and width */}
                <div className="w-full h-[300px]">
                  <img
                    src={item.img} // Correct source dynamically
                    alt={item.heading}
                    className="rounded-lg w-full h-full object-cover absolute" // Ensure image is responsive and fits container
                  />
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-lg font-bold">{item.heading}</h2>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </>
  );
}

export default gallery;
