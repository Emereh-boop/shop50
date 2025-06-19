import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, doc, writeBatch, updateDoc, deleteDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

export default function UploadShipping() {
  const [countryName, setCountryName] = useState("");
  const [cities, setCities] = useState([{ name: "", price_range: "" }]);
  const [uploading, setUploading] = useState(false);
  const [shippingList, setShippingList] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track if we're editing

  const shippingRef = collection(db, "shipping_data");

  // Fetch shipping data
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(shippingRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShippingList(data);
    };
    fetchData();
  }, []);

  const handleCityChange = (index, key, value) => {
    const updated = [...cities];
    updated[index][key] = value;
    setCities(updated);
  };

  const addCity = () => setCities([...cities, { name: "", price_range: "" }]);

  const removeCity = (index) => {
    const updated = [...cities];
    updated.splice(index, 1);
    setCities(updated);
  };

  const handleEdit = (shipping) => {
    setCountryName(shipping.name);
    setCities(shipping.cities);
    setEditingId(shipping.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "shipping_data", id));
      setShippingList(shippingList.filter((item) => item.id !== id));
      toast.success("Shipping data deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete shipping data." );
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!countryName || cities.some((c) => !c.name || !c.price_range)) {
      toast.error("Please complete all fields." );
      return;
    }
    
    setUploading(true);
    try {
      if (editingId) {
        // Update existing
        const docRef = doc(db, "shipping_data", editingId);
        await updateDoc(docRef, { name: countryName, cities });
        toast.success("Shipping data updated.");
      } else {
        // Create new
        const batch = writeBatch(db);
        const docId = countryName.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(4);
        const docRef = doc(db, "shipping_data", docId);
        
        batch.set(docRef, {
          name: countryName,
          cities,
        });
        
        await batch.commit();
        toast.success("Shipping data uploaded.");
      }
      
      setCountryName("");
      setCities([{ name: "", price_range: "" }]);
      setEditingId(null);
      const snapshot = await getDocs(shippingRef);
      const refreshedData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setShippingList(refreshedData);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload shipping data." );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 flex flex-col items-center bg-secondary min-h-screen space-y-8">
      <div className="p-6 bg-white shadow-sm rounded-sm w-full mx-auto max-w-4xl">
        <h2 className="text-2xl my-4">{editingId ? "Edit" : "Upload"} Shipping Rates</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block font-medium">Country Name</label>
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="w-full border-gray-400 rounded-sm p-2 ring-1 ring-neutral-400 focus:outline-primary/30"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Cities</label>
            {cities.map((city, index) => (
              <div key={index} className="mb-2 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="City Name"
                  value={city.name}
                  onChange={(e) => handleCityChange(index, "name", e.target.value)}
                  className="flex-1 p-2 border rounded-sm ring-1 ring-neutral-400"
                  required
                />
                <input
                  type="text"
                  placeholder="₦1,000 - ₦2,000"
                  value={city.price_range}
                  onChange={(e) => handleCityChange(index, "price_range", e.target.value)}
                  className="flex-1 p-2 border rounded-sm ring-1 ring-neutral-400"
                  required
                />
                {index > 0 && (
                  <button type="button" onClick={() => removeCity(index)} className="text-red-500 text-sm">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addCity} className="text-primary text-sm mt-2">
              + Add City
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-medium py-2 rounded-sm shadow-sm hover:bg-primary-dark"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : editingId ? "Update Shipping Info" : "Upload Shipping Info"}
          </button>
        </form>
      </div>

      {/* Existing Shipping List */}
      <div className="w-full max-w-4xl bg-white p-6 shadow-sm rounded-sm">
        <h3 className="text-xl font-semibold mb-4">Shipping Countries</h3>
        {shippingList.length === 0 ? (
          <p className="text-gray-500">No shipping data available.</p>
        ) : (
          <ul className="space-y-3">
            {shippingList.map((ship) => (
              <li
                key={ship.id}
                className="flex flex-col md:flex-row justify-between md:items-center border-b pb-2"
              >
                <div>
                  <p className="font-bold">{ship.name}</p>
                  <p className="text-sm text-gray-500">
                    {ship.cities.length} city{ship.cities.length > 1 ? "ies" : "y"}
                  </p>
                </div>
                <div className="space-x-3 mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(ship)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ship.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
