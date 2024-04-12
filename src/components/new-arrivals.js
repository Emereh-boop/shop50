import React, { useContext } from "react";
import Product from "./product";
import ShopContext from "../context/cart/shop-context";

export default function NewArrivals() {
  const { products } = useContext(ShopContext);

  const prod = products;
  const product = prod.slice(0, 8);

  return (
    <>
      <div className=" px-5 md:px-20 bg-white text-black grid gap-4 ">
        <div className="font-bold col-span-full row-span-1 text-5xl py-8 justify-center grid md:text-8xl">
          NEW ARRIVALS
        </div>
        <div className="col-span-full grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-4 ">
          {product.map((i) => {
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
        </div>
        <p className="col-span-full row-span-1 text-center text-2xl underline underline-offset-8 h-24 md:text-lg">
          SEE ALL PRODUCT
        </p>
      </div>
    </>
  );
}
