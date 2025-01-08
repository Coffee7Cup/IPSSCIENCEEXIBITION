import React from "react";
// import Masonry from './Masonry';
import GridMotion from "./GridMotion";
import SplitText from "./SplitText";
import SpotlightCard from "./SpotlightCard";
import pic1 from '../../assets/1.jpg'
import pic2 from '../../assets/2.jpg'
import pic3 from '../../assets/3.jpg'
import pic4 from '../../assets/4.jpg'
import pic5 from '../../assets/5.jpg'
import pic6 from '../../assets/6.jpg'
import pic7 from '../../assets/7.jpg'

function gallery() {
  //the photos from back end will go here

  //UN COMMENT THIS 
  // const photos = [
  //   pic1,pic2,pic3,pic4,pic5,pic6,pic7,pic1,pic2,pic3,pic4,pic5,pic6,pic7,pic1,pic2,pic3,pic4,pic5,pic6,pic7
  // ]

  const items = Array(28)
    .fill()
    .map((_, index) => <div>Item {index + 1}</div>);

  // const items = photos.map((item) => (<div><img src={item} alt="iamge"/></div>))

  const handleAnimationComplete = () => {
    //dummmy function
  };

  //items are taken from the backend
  const GalleryElements = [
    {
      // img: "pic1",
      img: "https://via.placeholder.com/300x200",
      heading: "Sunset Over the Hills",
      description:
        "A breathtaking view of the sun setting over lush green hills.",
    },
    {
      // img: "pic2",
      img: "https://via.placeholder.com/300x200",
      heading: "Tranquil Lake",
      description:
        "The still waters of a lake reflecting the surrounding trees.",
    },
    {
      // img: "pic3",
      img: "https://via.placeholder.com/300x200",
      heading: "City Skyline",
      description: "A bustling city skyline glowing under the night sky.",
    },
    {
      // img: "pic4",
      img: "https://via.placeholder.com/300x200",
      heading: "Golden Sands",
      description: "Golden sand dunes stretching into the horizon.",
    },
    {
      // img: "pic5",
      img: "https://via.placeholder.com/300x200",
      heading: "Forest Trail",
      description: "A serene trail winding through a dense forest.",
    },
    {
      // img: "pic6",
      img: "https://via.placeholder.com/300x200",
      heading: "Mountain Peak",
      description: "A majestic mountain peak covered in snow.",
    },
    {
      // img: "pic7",
      img: "https://via.placeholder.com/300x200",
      heading: "Sunset Over the Hills",
      description: "A breathtaking view of the sun setting over lush green hills.",
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
      className="flex flex-col items-center justify-between border rounded-lg shadow-md w-full sm:w-[48%] md:w-[48%] lg:w-[48%] xl:w-[48%] h-[400px] bg-white"
    >
      <SpotlightCard
        className="custom-spotlight-card w-full h-full"
        spotlightColor="rgba(40, 70, 200, 0.6)"
      >
        <div className="flex items-center p-4">
          {/* Make sure the image's container has enough height and width */}
          <div className="w-full h-[300px]">
            <img
              src={item.img} // Correct source dynamically
              alt={item.heading}
              className="rounded-lg w-full h-[300px] object-cover" // Ensure image is responsive and fits container
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
