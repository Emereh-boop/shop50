import React, { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import ShopContext from "../context/cart/shop-context";

const AlphabeticalSearch = () => {
  const { products } = useContext(ShopContext);

  const [searchTerm, setSearchTerm] = useState("");
  const titles = [];
  products.map((i) => {
    return titles.push(i.item.title);
  });

  // Filter titles based on search term
  const filteredTitles = titles.filter((title) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <br />
      <hr />
      <Container>
        <h1>Alphabetical Search</h1>
        <input
          type="search"
          placeholder="Search titles..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredTitles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </Container>
      <hr />
    </div>
  );
};

export default AlphabeticalSearch;
