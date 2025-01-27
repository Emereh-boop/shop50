import React, { useContext, useState, useEffect } from "react";
import { storage, db } from "../../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import ShopContext from "../../context/cart/shop-context";
import { FolderFill, TrashFill, XCircleFill } from "react-bootstrap-icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const collectionsConfig = {
  banners: ["title", "subtitle", "image", "category"],
  products: [
    "title",
    "description",
    "price",
    "image",
    "category",
    "brand",
    "quantity",
    "discount",
    "colors",
    "sizes",
    "inStock",
    "weight",
    "href",
  ],
  newArrivals: ["title", "description", "price", "image"],
  trending: ["title", "description", "price", "image"],
  collections: ["title", "category", "description", "image"],
  users: ["name", "email", "profileImage"],
  orders: [
    "orderNumber",
    "orderDate",
    "paymentStatus",
    "products",
    "totalAmount",
  ],
};

export default function UploadData() {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    file: null,
    title: "",
    subtitle: "",
    description: "",
    price: 0,
    quantity: 0,
    discount: 0,
    colors: "",
    href: "",
    weight: 0,
    sizes: "",
    inStock: "",
    imageUrl: "",
    category: "",
    brand: "",
    name: "",
    email: "",
    profileImage: "",
    orderNumber: "",
    orderDate: "",
    paymentStatus: "",
    products: "",
    totalAmount: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadTask, setUploadTask] = useState(null); // Store the upload task to cancel
  const { currentUser } = useContext(ShopContext);

  useEffect(() => {
    if (selectedCollection) {
      setFields(collectionsConfig[selectedCollection]);
    }
  }, [selectedCollection]);

  const handleChange = (e) => {
    const { id, files, value } = e.target;

    if (id === "file") {
      if (files && files.length > 0) {
        setFormData((prev) => ({
          ...prev,
          file: files[0],
          imageUrl: "", // Reset the imageUrl when a new file is selected
        }));
        handleUpload(files[0]); // Immediately handle the upload of the selected file
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleUpload = async (file) => {
    if (!file || !selectedCollection) return;

    setUploading(true);
    const storageRef = ref(storage, `${selectedCollection}/${file.name}`);

    const task = uploadBytesResumable(storageRef, file);
    setUploadTask(task); // Store the upload task

    task.on(
      "state_changed",
      (snapshot) => {
        // Progress handling if needed
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        setFormData((prev) => ({ ...prev, imageUrl: downloadURL }));
        setUploading(false);
        setUploadTask(null); // Reset the task after upload completes
      }
    );
  };

  const handleCancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel(); // Cancel the upload task
      setUploading(false);
      setUploadTask(null);
      alert("Upload canceled.");
    }
  };

  const handleDeleteFile = async () => {
    if (!formData.imageUrl) return;

    const fileRef = ref(storage, formData.imageUrl);

    try {
      await deleteObject(fileRef);
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      alert("File deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    delete dataToSave.file;

    if (!selectedCollection) {
      return alert("Please select a collection.");
    }

    if (fields.some((field) => !dataToSave[field])) {
      return alert(
        "Please complete all required fields and wait for the image upload to finish!"
      );
    }

    try {
      const batch = writeBatch(db);
      const documentId = `${currentUser?.uid || "PIQmarket"}-${
        formData.title || formData.orderNumber
      }`;

      const docRef = doc(db, selectedCollection, documentId);

      batch.set(docRef, {
        ...dataToSave,
        timeStamp: serverTimestamp(),
      });

      await batch.commit(); // Commit the batch write
      window.location.reload();
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Error adding document. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Upload Data</h2>

          <div className="mb-6">
            <label
              htmlFor="collection"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Select Collection
            </label>
            <select
              id="collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Select Collection</option>
              {Object.keys(collectionsConfig).map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>

          {selectedCollection && (
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              {formData.imageUrl && (
                <div className="md:w-1/2 mb-4 md:mb-0">
                  <img
                    src={formData.imageUrl}
                    alt="Selected File"
                    className="w-full h-64 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    onClick={handleDeleteFile}
                    className="mt-4 bg-red-600 text-white font-medium py-2 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashFill className="inline-block mr-2" />
                    Delete File
                  </button>
                </div>
              )}
              {fields.includes("image") && (
                <div className="md:w-1/2">
                  <label
                    htmlFor="file"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    Click to add image:{" "}
                    <FolderFill className="inline-block text-primary" />
                    <span className="ml-2 text-gray-500">
                      {formData.file && formData.file.name}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => {
                      handleChange(e);
                      handleUpload();
                    }}
                    className="hidden"
                  />
                  {uploading && (
                    <button
                      onClick={handleCancelUpload}
                      className="mt-4 bg-red-600 text-white font-medium py-2 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <XCircleFill className="inline-block mr-2" />
                      Cancel Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            {fields.map((field) => (
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="text-lg font-medium text-gray-700 mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "price" ||
                    field === "weight" ||
                    field === "quantity" ||
                    field === "totalAmount"
                      ? "number"
                      : field === "orderDate"
                      ? "date"
                      : field === "href"
                      ? "url"
                      : "text"
                  }
                  id={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary p-2"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-primary text-white font-medium py-2 rounded-md shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
