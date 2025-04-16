import { useState, useEffect } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import { Plus, TrashFill } from "react-bootstrap-icons";
import toast from "react-hot-toast";

export default function ProductForm({ mode = "create", initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    price: 0,
    category: "",
    imageUrl: "",
    quantity: 0,
    instock: false,
    ...initialData,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleUpload = (file) => {
    if (!file) return;

    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error(error);
        toast.error("Upload failed.");
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        // Delete old image if in edit mode
        if (mode === "edit" && formData.imageUrl) {
          const oldImageRef = ref(storage, formData.imageUrl);
          deleteObject(oldImageRef).catch(() => {});
        }

        setFormData((prev) => ({ ...prev, imageUrl: url }));
        toast.success("Image uploaded!");
        setUploading(false);
      }
    );
  };

  const validateForm = () => {
    const requiredFields = ["title", "brand", "price", "category"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const docId = formData.id || formData.title.replace(/\s+/g, "-").toLowerCase();
    const docRef = doc(db, "products", docId);

    const dataToSave = {
      ...formData,
      timestamp: serverTimestamp(),
    };

    try {
      if (mode === "create") {
        await setDoc(docRef, dataToSave);
        toast.success("Product created!");
      } else {
        await updateDoc(docRef, dataToSave);
        toast.success("Product updated!");
      }

      onSubmit?.();
      setFormData({
        title: "",
        brand: "",
        price: 0,
        category: "",
        imageUrl: "",
        quantity: 0,
        instock: false,
      });
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error("Error saving product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageDelete = async () => {
    if (!formData.imageUrl) return;

    try {
      const fileRef = ref(storage, formData.imageUrl);
      await deleteObject(fileRef);
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      toast.success("Image deleted.");
    } catch (err) {
      toast.error("Failed to delete image.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {["title", "brand", "category"].map((field) => (
        <div key={field} className="flex flex-col">
          <label htmlFor={field}>{field}</label>
          <input
            id={field}
            type="text"
            value={formData[field]}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
      ))}

      <div className="flex gap-4">
        <div className="flex flex-col">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-32"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-32"
          />
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <input
            id="instock"
            type="checkbox"
            checked={formData.instock}
            onChange={handleChange}
          />
          <label htmlFor="instock">In Stock</label>
        </div>
      </div>

      <div>
        {formData.imageUrl && (
          <div className="flex items-center gap-4">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-24 h-24 object-cover border rounded"
              loading="lazy"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="text-red-600 flex items-center gap-1"
            >
              <TrashFill /> Delete
            </button>
          </div>
        )}

        <label htmlFor="file" className="flex items-center gap-2 mt-2 cursor-pointer text-blue-600">
          <Plus /> Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          id="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) handleUpload(e.target.files[0]);
          }}
        />
      </div>

      <button
        type="submit"
        disabled={uploading || submitting}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          (uploading || submitting) && "opacity-50 cursor-not-allowed"
        }`}
      >
        {submitting
          ? "Saving..."
          : uploading
          ? "Uploading Image..."
          : mode === "edit"
          ? "Update Product"
          : "Create Product"}
      </button>
    </form>
  );
}
