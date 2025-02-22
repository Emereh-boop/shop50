import React, { useContext, useState, useEffect } from "react";
import { storage, db } from "../../firebase/firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import ShopContext from "../../context/cart/context";
import { Plus, TrashFill } from "react-bootstrap-icons";
import Navbar from "../../components/layout/navbar";

const collectionsConfig = {
  banners: ["title", "href", "brand", "subtitle", "image", "category"],
  products: [
    "title",
    "longDescription",
    "features",
    "specifics",
    "review",
    "shortDescription",
    "brand",
    "price",
    "weight",
    "quantity",
    "sizes",
    "category",
    "colors",
    "url",
    "ad",
    "image",
    "additionalImage",
    "instock",
    "onsale",
  ],
  newArrivals: [
    "title",
    "category",
    "description",
    "onsale",
    "colors",
    "price",
    "image",
  ],
  trending: [
    "title",
    "description",
    "category",
    "onsale",
    "colors",
    "price",
    "image",
  ],
  collections: ["title", "brand", "category", "description", "image"],
};

export default function UploadData() {
  const [selectedCollection, setSelectedCollection] = useState("products");
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    file: null,
    title: "",
    subtitle: "",
    longDescription: "",
    features: [],
    specifics: [],
    review: { reviewdate: "", reviewrating: 0, review: "" },
    shortDescription: "",
    brand: "",
    price: 0,
    weight: 0,
    quantity: 0,
    sizes: [],
    category: "",
    colors: [],
    url: "",
    ad: [],
    // coupon: [],
    imageUrl: "",
    additionalImage: [],
    instock: false,
    onsale: false,
    // profile: { image: "", name: "", email: "" },
  });
  const [uploading, setUploading] = useState(false);
  // const [uploadTask, setUploadTask] = useState(null);
  const { currentUser } = useContext(ShopContext);
  const [formInputs, setFormInputs] = useState({});

  const handleAddToArray = (arrayName) => {
    if (!formInputs[arrayName]?.trim()) return; // Prevent empty entries

    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], formInputs[arrayName]],
    }));

    setFormInputs((prev) => ({ ...prev, [arrayName]: "" })); // Clear input
  };

  useEffect(() => {
    if (selectedCollection) {
      setFields(collectionsConfig[selectedCollection]);
    }
  }, [selectedCollection]);

  const handleChange = (e) => {
    const { id, files, value, checked } = e.target;

    if (id === "file") {
      if (files && files?.length > 0) {
        setFormData((prev) => ({ ...prev, file: files[0], imageUrl: "" }));
        handleUpload(files[0]);
      }
    } else if (id === "instock" || id === "onsale") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleUpload = async (file) => {
    if (!file || !selectedCollection) return;

    setUploading(true);
    const storageRef = ref(storage, `${selectedCollection}/${file.name}`);

    const task = uploadBytesResumable(storageRef, file);
    // setUploadTask(task);

    task.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        setFormData((prev) => ({ ...prev, imageUrl: downloadURL }));
        setUploading(false);
        // setUploadTask(null);
      }
    );
  };

  // const handleCancelUpload = () => {
  //   if (uploadTask) {
  //     uploadTask.cancel();
  //     setUploading(false);
  //     setUploadTask(null);
  //     alert("Upload canceled.");
  //   }
  // };

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

    try {
      const batch = writeBatch(db);
      const documentId = `${currentUser?.uid || "YNT"}-${
        formData.title || formData.orderNumber
      }`;

      const docRef = doc(db, selectedCollection, documentId);

      batch.set(docRef, {
        ...dataToSave,
        timeStamp: serverTimestamp(),
      });

      await batch.commit();
      window.location.reload();
    } catch (err) {
      console.error("Error adding document: ", err);
      alert("Error adding document. Please try again.");
    }
  };

  const handleAdditionalImageUpload = async (file, index) => {
    if (!file) return;
    setUploading(true);

    const storageRef = ref(
      storage,
      `${selectedCollection}/additionalImages/${file.name}`
    );
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Error uploading additional image:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        setFormData((prev) => ({
          ...prev,
          additionalImage: [...(prev.additionalImage || []), downloadURL], // Append the URL
        }));
        setUploading(false);
      }
    );
  };
  // Handlers for dynamic arrays

  const handleAddToColorArray = () => {
    if (!formInputs.color.trim() || !formInputs.colorCode.trim()) return;

    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { color: formInputs.color, code: formInputs.colorCode },
      ],
    }));

    setFormInputs((prev) => ({ ...prev, color: "", colorCode: "" })); // Clear inputs
  };
  const handleRemoveFromArray = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 flex md:grid md:grid-cols-4 ">
        <div className="md:col-span-1 bg-gray-200 p-4">
          <h2 className="text-xl">Collections</h2>
          <ul>
            {Object.keys(collectionsConfig).map((collection) => (
              <li
                key={collection}
                className="py-2 px-4 cursor-pointer hover:bg-gray-300"
                onClick={() => setSelectedCollection(collection)}
              >
                {collection}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-full md:col-start-2 p-6 bg-white shadow-sm rounded-sm">
          <h2 className="text-2xl my-4">Upload Data</h2>

          <form onSubmit={handleAdd} className="space-y-2">
            {fields.map((field) => {
              // Check for fields that should be hidden or need specific rendering
              if (
                field === "profile" ||
                field === "review" ||
                field === "time" ||
                field === "additionalImage" ||
                field === "image" ||
                field === "colors" ||
                field === "sizes" ||
                field === "features" ||
                field === "specifics"
              ) {
                return null; // Skip rendering for these fields
              }

              // Render input field for the rest of the fields
              return (
                <div key={field} className="flex flex-col items-start">
                  <label htmlFor={field} className="text-lg text-neutral-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={
                      field === "price" ||
                      field === "weight" ||
                      field === "quantity"
                        ? "number"
                        : field === "instock" || field === "onsale"
                        ? "checkbox"
                        : field === "url"
                        ? "url"
                        : "text"
                    }
                    id={field}
                    value={
                      field === "review"
                        ? `${formData.review?.review}` // Convert review object to a string
                        : field === "colors"
                        ? `${formData.colors?.color}` // Display color code and name
                        : formData[field] || ""
                    }
                    onChange={handleChange}
                    className={`block border-gray-400 rounded-sm  focus:outline-primary/30 p-2 ${
                      field === "instock" || field === "onsale"
                        ? "w-5 ring-0"
                        : field === "price" ||
                          field === "quantity" ||
                          field === "weight"
                        ? "w-16 ring-1 ring-neutral-400"
                        : "w-full ring-1 ring-neutral-400"
                    } `}
                  />
                </div>
              );
            })}

            {/* Dynamic Array Handling for Features, Specifics, and Sizes */}
            {selectedCollection === "products" && (
              <>
                {["features", "specifics", "sizes"].map((arrayName) => (
                  <div key={arrayName} className="mt-4">
                    <h3 className="text-lg">
                      {arrayName.charAt(0).toUpperCase() + arrayName.slice(1)}
                    </h3>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Add ${arrayName.slice(0, -1)}`}
                        value={formInputs[arrayName] || ""}
                        onChange={(e) =>
                          setFormInputs((prev) => ({
                            ...prev,
                            [arrayName]: e.target.value,
                          }))
                        }
                        className="border-gray-400 rounded-sm focus:outline-primary/30 p-2 flex-grow"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddToArray(arrayName)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-2">
                      {formData[arrayName].map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border p-2 rounded-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFromArray(arrayName, index)
                            }
                            className="text-red-600"
                          >
                            <TrashFill />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Colors */}
                <div className="mt-4">
                  <h3 className="text-lg">Colors</h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Color name"
                      value={formInputs.color || ""}
                      onChange={(e) =>
                        setFormInputs((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      className="border-gray-400 rounded-sm focus:outline-primary/30 p-2 flex-grow"
                    />
                    <input
                      type="text"
                      placeholder="Color code (e.g., #FF0000)"
                      value={formInputs.colorCode || ""}
                      onChange={(e) =>
                        setFormInputs((prev) => ({
                          ...prev,
                          colorCode: e.target.value,
                        }))
                      }
                      className="border-gray-400 rounded-sm focus:outline-primary/30 p-2 flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddToColorArray("colors")}
                      className="bg-blue-600 text-white px-3 py-2 rounded-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-2">
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border p-2 rounded-sm"
                      >
                        <span>
                          {color.color} {color.code && `(${color.code})`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromArray("colors", index)}
                          className="text-red-600"
                        >
                          <TrashFill />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Main image upload */}
            <div>
              {formData.imageUrl && (
                <div>
                  <img
                    src={formData.imageUrl}
                    alt="Selected File"
                    className="w-1/4 h-64 object-contain rounded-sm border border-gray-200"
                  />
                  <button
                    onClick={handleDeleteFile}
                    className="mt-4 bg-red-600 text-white font-medium py-2 rounded-sm shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashFill className="inline-block mr-2" />
                    Delete File
                  </button>
                </div>
              )}
              <label htmlFor="file" className="cursor-pointer mt-4">
                <p>Upload image</p>
                <div className="flex items-center mt-2 hover:bg-primary/45 hover:border-none hover:text-white border p-2 w-12 h-12 border-gray-400 text-gray-400 text-4xl">
                  <Plus />
                </div>
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => handleChange(e)}
                className="hidden"
              />
            </div>

            {/* Additional Images */}
            {selectedCollection === "products" && (
              <div className="flex flex-col space-x-4 mt-6">
                <div>Add images</div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <label
                        htmlFor={`addfile-${idx}`}
                        className="cursor-pointer mt-4 text-4xl hover:bg-primary/20 hover:border-primary/20 hover:text-white text-zinc-400 border border-zinc-400 p-2 rounded-sm"
                      >
                        <Plus />
                      </label>
                      <input
                        type="file"
                        id={`addfile-${idx}`}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleAdditionalImageUpload(file, idx); // Upload the image
                          }
                        }}
                        className="hidden"
                      />
                      {formData.additionalImage[idx] && (
                        <img
                          src={formData.additionalImage[idx]}
                          alt={`additional ${idx + 1}`}
                          className="w-16 h-16 object-cover mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white font-medium py-2 rounded-sm shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
