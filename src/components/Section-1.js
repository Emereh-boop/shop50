import React from "react";
import bagImage1 from "../images/pexels-photo-1942880.jpeg";
import bagImage2 from "../images/istockphoto-500157629-612x612.jpg";
import bagImage3 from "../images/gettyimages-533746941-612x612.jpg";
// import downArrowImg from "../images/down-arrow.png";

export default function Section1(props) {
  // const ref3 = props.ref3;
  // const scrollToTop = () => {
  //   ref3.current?.scrollIntoView({ behavior: "smooth" });
  // };
  return (
    <div className="w-svw grid grid-cols-2 grid-flow-row-dense bg-amber-50 justify-between gap-10 px-3 md:p-20 py-3 md:grid-cols-4">
      <div className="flex col-span-full text-5xl justify-center md:text-clip md:text-9xl">
        BAGHARMONY
      </div>
      <div className=" w-auto rounded-xl shadow-2xl bg-white  md:flex md:col-span-full gap-5 p-10 justify-evenly grid-cols-2 col-span-full">
        <div className="flex flex-col justify-around h-96 md:w-80 text-sm">
          <p className="text-xl md:text-base text-center md:text-start">
            UNVEIL A WORLD OF ELEGANGE WITH OUR CURATED COLLECTION OF BAG THAT
            SUIT EVERY STYLE AND OCASSION.
          </p>
          <img
            className="h-3/4 w-full object-cover rounded-sm"
            src={bagImage1}
            alt=""
          />
        </div>
        <div className="flex flex-col order-3 md:order-none justify-around  h-96 md:w-80 text-lg">
          <img
            className="h-4/5 w-full object-cover rounded-sm"
            src={bagImage2}
            alt=""
          />
          {/* <div className="text-center md:block hidden">
            <p>SEE MORE</p>
            <img
              className=" h-5 w-5  md:mx-36"
              id="img"
              onMouseOver={scrollToTop}
              src={downArrowImg}
              alt=""
            />
          </div> */}
        </div>
        <div className="flex flex-col justify-around  h-96 md:w-80 text-2xl">
          <p className=" text-center text-3xl underline underline-offset-8">
            SHOP NOW
          </p>
          <img
            className="h-4/5 w-full object-cover md:rounded-sm"
            src={bagImage3}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
