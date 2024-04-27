import React, { useState } from "react";
import NikeShoeTeal from "../images/Nike-Air-jordan-teal.png";
import NikeShoeBlue from "../images/NIKE_AIR_JORDAN_1_RETRO_HIGH_RARE_AIR_SOAR_BLUE-no-bg.png";
import NikeShoeRed from "../images/NIKE_AIR_JORDAN_1_RETRO_MID_CHICAGO-no-bg.png";
import NikeShoeAirforce from "../images/Nike-Air-Force-no-bg.png";
import NikeAirMax from "../images/Nike-air-max-Purple-no-bg.png";
import AdidasYeezys350 from "../images/adidas-yeezy-boost-350-no-bg.png";
import AdidasYeezysSlide from "../images/adidas-yeezy-slide-onyx-no-bg.png";
import AdidasYeezys45DarkSlate from "../images/Adidas-Yeezy-450-Dark-Slate-no-bg.png";
import {
  ChevronCompactLeft,
  ChevronCompactRight,
  Dot,
} from "react-bootstrap-icons";
// import ShopContext from "../context/cart/shop-context";
// import { useNavigate } from "react-router-dom";

function ShoeHeroPage() {
  // const navigate = useNavigate();
  // const { products } = useContext(ShopContext);
  let shoes = [
    {
      color: "teal",
      image: NikeShoeTeal,
      name: `Nike Retro Teal`,
      description: ` Men's revolution 6 Next Nature`,
      brand: "Nike",
    },
    {
      color: "indigo",
      image: NikeAirMax,
      name: `Nike Retro Air Max`,
      description: `Retro Air Max shoes blend comfort, style, and innovation.`,
      brand: "Nike",
    },
    {
      color: "neutral",
      image: AdidasYeezys350,
      name: `Adidas Yeezy's boost 350`,
      description: `Adidas shoes blend comfort, style, and innovation.`,
      brand: "Adidas",
    },
    {
      color: "zinc",
      image: AdidasYeezysSlide,
      name: `Adidas Yeezy's Slide Onyx`,
      description: `Adidas shoes blend comfort, style, and innovation.`,
      brand: "Adidas",
    },
    {
      color: "slate",
      image: AdidasYeezys45DarkSlate,
      name: `Adidas Yeezy's 450 Dark Slate`,
      description: `Adidas shoes blend comfort, style, and innovation.`,
      brand: "Adidas",
    },
    {
      color: "red",
      image: NikeShoeRed,
      name: `Nike High Top Sneakers`,
      description: `Air Jordans represent basketball greatness Whether you’re hitting the court or the streets it continue to make iconic statements.`,
      brand: "Nike",
    },
    {
      color: "blue",
      image: NikeShoeBlue,
      name: `Air Jordan`,
      description: ` Air Jordans represent basketball greatness`,
      brand: "Nike",
    },
    {
      color: "teal",
      image: NikeShoeAirforce,
      name: `Nike Air Force`,
      description: ` fashion staple, combining heritage, innovation, and style. Whether you’re hitting the court or the streets, these sneakers continue to make a powerful statement.`,
      brand: "Nike",
    },
  ];
  const [i, setCurrentShoe] = useState(0);

  const prevSlide = () => {
    const isFirstIndex = i === 0;
    const newIndex = isFirstIndex ? shoes.length - 1 : i - 1;
    setCurrentShoe(newIndex);
  };
  const nextSlide = () => {
    const isLastIndex = i === shoes.length - 1;
    const newIndex = isLastIndex ? 0 : i + 1;
    setCurrentShoe(newIndex);
  };
  const goToSlide = (key) => {
    setCurrentShoe(key);
  };

  return (
    <div
      className={`md:pb-10 bg-gray-200 gap-5  flex  flex-col  items-center `}
    >
      <div
        key={shoes[i].name}
        className={`bg-neutral-0  p-4 gap-10   flex md:flex-row  flex-col justify-between w-full `}
      >
        <div className=" relative group md:w-1/2 flex h-60  items-center justify-center duration-500 drop-shadow-4xl bg-center bg-cover md:h-96 brightness-120 ">
          <ChevronCompactLeft
            onClick={prevSlide}
            size={40}
            className="hidden group-hover:block  absolute left-0 translate-x-0 translate-y-[-50%] p-2 bg-black/20 top-[50%] self-center text-white cursor-default rounded-full"
          />
          <img
            src={shoes[i].image}
            className="animate-wiggle object-contain justify-center"
            alt="Nike shoe "
          />
          <ChevronCompactRight
            onClick={nextSlide}
            size={40}
            className="hidden group-hover:block absolute right-0  translate-x-0 translate-y-[-50%] p-2 bg-black/20 top-[50%] self-center text-white cursor-default rounded-full"
          />
          <div className="flex justify-center  py-2 absolute bottom-0 top-[100%] overflow-x-clip left-[30%] right-[20%] ">
            {shoes.map((shoe, index) => {
              return (
                <Dot
                  className=" hover:text-white/85"
                  size={30}
                  onClick={() => goToSlide(index)}
                  key={index}
                />
              );
            })}
          </div>
        </div>

        <div className="md:w-1/2 flex md:flex-row flex-col justify-betweeen">
          <div className="flex flex-col py-6 justify-around gap-6 relative">
            <span className="text-zinc-900 text-5xl md:text-9xl drop-shadow-3xl font-extrabold">
              <strong>{shoes[i].brand}</strong>{" "}
            </span>
            <div className="flex flex-col gap-4 pb-4 relative">
              <div>
                <span className="md:text-4xl text-2xl text-zinc-900 font-black font-serif">
                  {shoes[i].name}
                </span>
                <p className="text-black text-lg md:text-md text-left text-wrap font-extralight">
                  {shoes[i].description}
                </p>
              </div>
              <button className="rounded-full md:self-start self-center w-52 p-2 animate-pulse  font-sans shadow-lg font-thin text-xl bg-white/45 hover:bg-transparent/10">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoeHeroPage;
