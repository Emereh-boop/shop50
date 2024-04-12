import React from "react";
import MainContent from "./main.-content";
import Products from "./products";
import NewArrivals from "./new-arrivals";
import Collections from "./collections";
import searchImage from "../images/search.svg";

export default function Main() {
  const [isSearch, setIsSearch] = React.useState(false);
  const ref = React.useRef(null);
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const devicewidth = false;

  const handleRef = () => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  };
  const handleRef1 = () => {
    ref1.current?.scrollIntoView({ behaviour: "smooth" });
  };
  const handleRef2 = () => {
    ref2.current?.scrollIntoView({ behaviour: "smooth" });
  };
  const handleSearch = () => {
    return setIsSearch(!isSearch);
  };
  const handleScrollTo = (event, id) => {
    document.getElementById(id).scrollTo(50, 0);
  };
  return (
    <div className=".App">
      <div className={devicewidth ? "md-head-wrapper" : "lg-head-wrapper"}>
        <div className={devicewidth ? "md-head-one" : "lg-head-one"}>
          <span onClick={handleRef}>ALL PRODUCTS</span>
          <span onClick={handleRef1}>NEW ARRIVALS</span>
          <span onClick={handleRef2}>COLLECTIONS</span>
        </div>
        <div className="head-section-two">
          <strong>BAGHARMONY</strong>
        </div>
        <div className={devicewidth ? "md-head-one" : "lg-head-one"}>
          {isSearch === true ? (
            <div>
              <img
                onClick={handleSearch}
                className="searchImage"
                src={searchImage}
                alt="search"
              />
              <input type="search" placeholder="Search" />
            </div>
          ) : (
            <button onClick={handleSearch}>SEARCH</button>
          )}
          <button>CART (2)</button>
          <button>ACCOUNT</button>
        </div>
      </div>
      <main className="w-auto  flex flex-wrap h-auto flex-col px-10 md:flex-row  ">
        <MainContent
          devicewidth={devicewidth}
          ref3={ref3}
          handleScrollTo={handleScrollTo}
        />
        <div ref={ref3}></div>

        <div ref={ref}></div>
        <Products />

        <div ref={ref1}></div>
        <NewArrivals />
        <div ref={ref2}></div>
        <Collections />
      </main>
    </div>
  );
}
