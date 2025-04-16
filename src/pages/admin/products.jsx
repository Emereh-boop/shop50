import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import  ProductForm from "../../components/products/productForm";
import { TrashFill, PencilSquare } from "react-bootstrap-icons";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts(); // re-fetch list
  };

  const handleSave = () => {
    setSelectedProduct(null); // reset form after save
    fetchProducts(); // refresh list
  };

  return (
    <div className="p-4 mx-auto mt-16 max-w-4xl">
      <h1 className="text-2xl mb-4">Manage Products</h1>

      {selectedProduct && (
        <ProductForm
          mode="edit"
          initialData={selectedProduct}
          onSubmit={handleSave}
        />
      )}

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Title</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="border-t">
              <td className="p-2">{prod.title}</td>
              <td className="p-2">${prod.price}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => setSelectedProduct(prod)}>
                  <PencilSquare className="text-blue-600" />
                </button>
                <button onClick={() => handleDelete(prod.id)}>
                  <TrashFill className="text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
