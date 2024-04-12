import React from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

export default function UploadData() {
  const [imageUpload, setImageUpload] = React.useState(null);
  const [titleUpload, setTitleUpload] = React.useState("");
  const [discountUpload, setDiscountUpload] = React.useState(0);
  const [newPriceUpload, setNewPriceUpload] = React.useState(0);
  const [oldPriceUpload, setOldPriceUpload] = React.useState(0);
  const [quantityUpload, setQuantityUpload] = React.useState(0);
  const options = ["XS", "S", "M", "L", "XL", "XXL"];

  const [imageList, setImageList] = React.useState([]);

  const uploadImage = async () => {
    if (!imageUpload) {
      return alert("Please complete form!");
    }
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
        alert("Uploaded Succesfully ");
      });
    });
  };
  const uploadData = async () => {
    if (!imageUpload || !titleUpload || !newPriceUpload || !quantityUpload) {
      return alert("Please complete form!");
    } else {
      imageList.map((url) => {
        const dataRef = collection(db, "products");
        return addDoc(dataRef, {
          image: url,
          availability: titleUpload,
          currentprice: newPriceUpload,
          discount: discountUpload,
          prevprice: oldPriceUpload,
          quantity: quantityUpload,
          sizes: options,
          title: titleUpload,
        });
      });
    }
  };

  return (
    <div className="flex flex-col px-80 gap-4">
      <input
        type="file"
        onChange={(e) => {
          setImageUpload(e.target.files[0]);
        }}
        className="ring-1 ring-black p-3"
      />{" "}
      <button onClick={uploadImage}>upload image</button>
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => {
          setTitleUpload(e.target.value);
        }}
        className="ring-black ring-1 p-3"
      />{" "}
      <input
        type="number"
        placeholder="Discount"
        onChange={(e) => {
          setDiscountUpload(e.target.value);
        }}
        className="ring-black ring-1 p-3"
      />{" "}
      <input
        type="number"
        placeholder="New price"
        onChange={(e) => {
          setNewPriceUpload(e.target.value);
        }}
        className="ring-1 ring-black p-3"
      />{" "}
      <input
        type="number"
        placeholder="Old price"
        onChange={(e) => {
          setOldPriceUpload(e.target.value);
        }}
        className="ring-1 ring-black p-3"
      />{" "}
      <input
        type="number"
        placeholder="quantity"
        onChange={(e) => {
          setQuantityUpload(e.target.value);
        }}
        className="ring-1 ring-black p-3"
      />
      <button className="bg-white ring-1 ring-black p-2" onClick={uploadData}>
        upload
      </button>
    </div>
  );
}
