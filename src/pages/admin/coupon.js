import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  doc,
  writeBatch,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import Toast from "../../components/common/toast";

const couponConfig = ["discount", "startDate", "endDate", "code"];

export default function UploadCoupon() {
  const [formData, setFormData] = useState({
    discount: 0,
    startDate: "",
    endDate: "",
    code: "",
  });
  const [uploading, setUploading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const snapshot = await getDocs(collection(db, "coupons"));
    const loadedCoupons = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCoupons(loadedCoupons);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount) {
      Toast({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setUploading(true);
    try {
      const batch = writeBatch(db);
      const documentId = editingId || nanoid(8);
      const docRef = doc(db, "coupons", documentId);

      batch.set(docRef, {
        ...formData,
      });

      await batch.commit();
      Toast({ type: "success", message: `Coupon ${editingId ? "updated" : "added"} successfully!` });

      setFormData({ discount: 0, startDate: "", endDate: "", code: "" });
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);
      Toast({ type: "error", message: "Error saving coupon." });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditingId(coupon.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "coupons", id));
      Toast({ type: "success", message: "Coupon deleted." });
      fetchCoupons();
    } catch (err) {
      console.error(err);
      Toast({ type: "error", message: "Failed to delete coupon." });
    }
  };

  return (
    <div className="w-full p-6 flex bg-secondary min-h-svh justify-center items-start">
      <div className="w-full p-6 bg-white shadow-sm max-w-4xl mx-auto rounded-sm">
        <h2 className="text-2xl my-4">{editingId ? "Edit Coupon" : "Upload Coupon"}</h2>

        <form onSubmit={handleSubmit} className="space-y-2 w-full">
          {couponConfig.map((field) => (
            <div key={field} className="flex flex-col items-start w-full">
              <label htmlFor={field} className="text-lg text-neutral-700 capitalize">
                {field}
              </label>
              <input
                type={field === "discount" ? "number" : field.includes("Date") ? "date" : "text"}
                id={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="block w-full border-gray-400 rounded-sm ring-1 ring-neutral-400 p-2 focus:outline-primary/30"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-primary text-white font-medium py-2 rounded-sm shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={uploading}
          >
            {uploading ? "Saving..." : editingId ? "Update Coupon" : "Upload Coupon"}
          </button>
        </form>

        {/* Coupon List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Existing Coupons</h3>
          <div className="space-y-3">
            {coupons.length === 0 && <p className="text-neutral-500">No coupons available.</p>}
            {coupons.map((coupon) => (
              <div key={coupon.id} className="p-3 border rounded-md bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold">{coupon.code}</p>
                  <p>Discount: {coupon.discount}%</p>
                  <p>Valid: {coupon.startDate} → {coupon.endDate}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
