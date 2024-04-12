import React, { useContext } from "react";
import Product from "./product";
import modelImage1 from "../images/Body-skirt.jpg";
import modelImage2 from "../images/istockphoto-463378191-612x612.jpg";
import ShopContext from "../context/cart/shop-context";

export default function ShopProducts() {
  const { products } = useContext(ShopContext);

  const shopProducts = products;
  let prod = [];
  const prods = shopProducts?.slice(-2);
  prods?.map((prods) => {
    return prod.push(prods);
  });
  return (
    <>
      <div className=" px-5 md:px-20 bg-white text-black grid gap-4 ">
        <div className="font-bold col-span-full row-span-1 text-45xl py-8 justify-center grid md:text-8xl">
          SHOP PRODUCTS
        </div>
        <div className="col-span-full grid grid-flow-dense gap-4 md:grid-cols-4">
          {shopProducts.map((i) => {
            return (
              <Product
                key={i.key}
                image={i.item.image}
                title={i.item.title}
                currentprice={i.item.currentprice}
                prevprice={i.item.prevprice}
                discount={i.item.discount}
                quantity={i.item.quantity}
                products={i}
              />
            );
          })}
          <img
            className="col-span-2 row-span-2 h-700 object-contain bg-slate-300"
            src={modelImage1}
            alt=""
          />
          {prod.map((i) => {
            return (
              <Product
                key={i.key}
                image={i.item.image}
                title={i.item.title}
                currentprice={i.item.currentprice}
                prevprice={i.item.prevprice}
                discount={i.item.discount}
                quantity={i.item.quantity}
                products={i}
              />
            );
          })}
          <img src={modelImage2} alt="" className="col-span-2 object-cover" />
        </div>
        <p className="col-span-full row-span-1 text-center text-2xl underline underline-offset-8 h-24 md:text-lg">
          {" "}
          SEE ALL PRODUCTS
        </p>
      </div>
    </>
  );
}
