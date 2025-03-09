import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, writeBatch } from "firebase/firestore";
import Navbar from "../../components/layout/navbar";
import { nanoid } from "nanoid";
import Toast from "../../components/common/toast";

const couponConfig = ["discount", "startDate", "endDate", "code", "expires"];
const id = nanoid(6);
const cuid = nanoid(10);

export default function UploadCoupon() {
  const [formData, setFormData] = useState({
    discount: 0,
    startDate: "",
    endDate: "",
    code: cuid,
    expires: "",
  });
  const uploading = false;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    delete dataToSave.file;

    if (!formData.code || !formData.discount) {
      return <Toast type='error' message='Please fill in all required fields.'/>
    }

    try {
      const batch = writeBatch(db);
      const documentId = `${id}`;

      const docRef = doc(db, "coupons", documentId);

      batch.set(docRef, {
        ...dataToSave,
      });

      await batch.commit();
      window.location.reload();
    } catch (err) {
     <Toast type='error' message='Error adding coupon. Please try again.'/>
    }
  };

  return (
    <div className="w-full mx-auto p-6 flex ">
      <Navbar />

      <div className=" p-6 bg-white shadow-sm rounded-sm">
        <h2 className="text-2xl my-4">Upload Coupon</h2>

        <form onSubmit={handleAddCoupon} className="space-y-2 w-full">
          <div className="w-full">
            <label htmlFor="code" className="cursor-pointer mt-4">
              <p>Code</p>
            </label>
            <input
              type="text"
              id="code"
              onChange={(e) => handleChange(e)}
              className="block border-gray-400 rounded-sm focus:outline-primary/30 p-2"
              value={formData.code}
              placeholder={formData?.code}
            />
          </div>
          {couponConfig.map((field) => {
            if (field === "expires" || field === "code") {
              return null;
            }
            return (
              <div key={field} className="flex flex-col items-start w-full">
                <label htmlFor={field} className="text-lg text-neutral-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "discount"
                      ? "number"
                      : field === "startDate" || field === "endDate"
                      ? "date"
                      : "text"
                  }
                  id={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className={`block border-gray-400 rounded-sm focus:outline-primary/30 p-2 ${
                    field === "discount" || field === "quantity"
                      ? "w-16 ring-1 ring-neutral-400"
                      : "w-full ring-1 ring-neutral-400"
                  }`}
                />
              </div>
            );
          })}

          <div className="w-full">
            <label htmlFor="expires" className="cursor-pointer mt-4">
              <p>Expires Date</p>
            </label>
            <input
              type="date"
              id="expires"
              onChange={(e) => handleChange(e)}
              className="block border-gray-400 rounded-sm focus:outline-primary/30 p-2"
              value={formData.expires || ""}
              placeholder={formData?.endDate}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-medium py-2 rounded-sm shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
}
