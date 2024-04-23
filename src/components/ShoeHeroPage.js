import React, { useContext, useState } from "react";
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
  Facebook,
  Instagram,
  TwitterX,
  Whatsapp,
} from "react-bootstrap-icons";
import ShopContext from "../context/cart/shop-context";

function ShoeHeroPage() {
  const { cartItem } = useContext(ShopContext);
  let shoes = [
    {
      color: "bg-teal-300",
      image: NikeShoeTeal,
      name: `Nike Retro Teal`,
      description: ` Men's revolution 6 Next Nature`,
      brand: "Nike",
    },
    {
      color: "bg-indigo-300",
      image: NikeAirMax,
      name: `Nike Retro Air Max`,
      description: `Retro Air Max shoes blend comfort, style, and innovation.`,
      brand: "Nike",
    },
    {
      color: "bg-neutral-400",
      image: AdidasYeezys350,
      name: `Adidas Yeezy's boost 350`,
      description: `Adidas shoes blend comfort, style, and innovation.`,
      brand: "Adidas",
    },
    {
      color: "bg-zinc-400",
      image: AdidasYeezysSlide,
      name: `Adidas Yeezy's Slide Onyx`,
      description: `Adidas shoes blend comfort, style, and innovation.`,
      brand: "Adidas",
    },
    {
      color: "bg-slate-500",
      image: AdidasYeezys45DarkSlate,
      name: `Adidas Yeezy's 450 Dark Slate`,
      description: `Adidas shoes blend comfort, style, and innovation.`,
      brand: "Adidas",
    },
    {
      color: "bg-red-400",
      image: NikeShoeRed,
      name: `Nike High Top Sneakers`,
      description: `Air Jordans represent basketball greatness Whether you’re hitting the court or the streets it continue to make iconic statements.`,
      brand: "Nike",
    },
    {
      color: "bg-blue-500",
      image: NikeShoeBlue,
      name: `Air Jordan`,
      description: ` Air Jordans represent basketball greatness`,
      brand: "Nike",
    },
    {
      color: "bg-teal-400",
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
    <div className="md:px-0 bg-white/0 ">
      <div className=" font-bold col-span-full row-span-1 text-45xl py-5 justify-center grid md:text-8xl">
        ONLINE STORE
      </div>
      <div
        key={shoes[i].name}
        className={
          shoes
            ? `${shoes[i].color} shadow-2xl rounded-3xl p-4 scale-x-90 scale-y-80 gap-10  flex justify-between `
            : "bg-neutral-100 shadow-2xl p-5 rounded-2xl flex "
        }
      >
        <div className=" relative group w-1/2 flex h-60  duration-500 drop-shadow-4xl bg-center bg-cover md:h-96 brightness-120 ">
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
          <div className="flex justify-center  py-2 absolute bottom-0 overflow-x-clip left-[30%] right-[20%] ">
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

        <div className="md:w-1/2 flex md:flex-row flex-col justify-between">
          <div className="flex flex-col py-24 gap-6 relative">
            <span className="text-zinc-900 text-5xl md:text-9xl drop-shadow-3xl font-extrabold">
              <strong>{shoes[i].brand}</strong>{" "}
            </span>
            <div>
              <span className="text-4xl text-zinc-900 font-black font-serif">
                {shoes[i].name}
              </span>
              <p className="text-white w-4/5 text-lg text-clip md:text-md text-left font-extralight">
                {shoes[i].description}
              </p>
            </div>

            <button className="rounded-full w-52 p-2 ring-1 animate-pulse  font-sans shadow-lg font-thin text-xl bg-white/45 hover:bg-transparent/10">
              Shop Now
            </button>
            <div className="flex justify-start md:justify-center gap-10 scale-60 md:scale-80 w-72 ">
              <Instagram size={35} />
              <TwitterX size={35} />
              <Facebook size={35} />
              <Whatsapp size={35} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex overflow-clip">
        {shoes.map((i, index) => {
          return (
            <div key={index}>
              {" "}
              <img src={i.image} alt="" />
              {i.brand}
            </div>
          );
        })}
        {cartItem.map((i, index) => {
          return (
            <div key={index}>
              {" "}
              <img src={i.item.image} alt="" />
              {i.item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShoeHeroPage;
