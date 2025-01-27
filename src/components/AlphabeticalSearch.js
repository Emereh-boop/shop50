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
// useEffect(() => {
//   const AlphabeticalSearch = async () => {
//     if (!searchTerm) {
//       setFilter([]);
//       return;
//     }

//     try {
//       // Convert searchTerm to lowercase for case-insensitive search
//       const normalizedSearchTerm = searchTerm.toLowerCase();
//       console.log("Normalized search term:", searchTerm);

//       // Perform a Firestore query
//       const q = query(
//         collection(db, "products"),
//         where("title", "array-contains", searchTerm)
//       );
//       console.log("Firestore query:", q._query);

//       const querySnapshot = await getDocs(q);
//       console.log("Query snapshot:", querySnapshot.docs);

//       const filteredTitles = [];

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         console.log("Document data:", data);

//         if (data?.title?.toLowerCase().includes(normalizedSearchTerm)) {
//           filteredTitles.push(data.title);
//           console.log("Added title to filteredTitles:", data.title);
//         }
//       });
//       console.log("Filtered titles:", filteredTitles);

//       // Update state with the filtered titles
//       setFilter(filteredTitles);
//       console.log("State updated with filtered titles:", filteredTitles);
//     } catch (error) {
//       console.error("Error fetching documents: ", error);
//     }
//   };

//   AlphabeticalSearch();
// }, [searchTerm]);
