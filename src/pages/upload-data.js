import React, { useEffect, useRef, useState } from "react";
import { storage, db } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { HourglassSplit } from "react-bootstrap-icons";

export default function UploadData() {
  const [image, setImage] = useState({});
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [inStock, setInstock] = useState("");
  const options = ["XS", "S", "M", "L", "XL", "XXL"];
  const [url, setUrl] = useState([{}]);

  let images = [];

  useEffect(() => {}, []);

  const uploadData = async () => {
    const uploadImage = () => {
      const imageName = new Date().getTime() + image.name;
      const storageRef = ref(storage, imageName);

      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              <HourglassSplit className="animate-spin" />;
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
            default:
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setUrl((i) => ({ ...i, downloadURL }));
            console.log(url);
          });
        }
      );
    };

    if (!title || !price || !quantity) {
      return alert("Please complete form!");
    } else {
      const docRef = await addDoc(collection(db, "Products"), {
        inStock: inStock,
        discount: discount,
        prevprice: price,
        quantity: quantity,
        sizes: options,
        title: title,
        // image: imageList,
      });
      console.log("Document written with ID: ", docRef.id);
    }
  };

  const fileInputRef = useRef();
  function handleChange(e) {
    const file = fileInputRef.current.files[0];
    console.log("Selected file:", file.name, file.size);
    images.push(file);
    setImage({ data: file });
    console.log(images);
    console.log(image);
  }
  return (
    <div className="px-4">
      <Navbar />
      <div className="flex flex-col gap-4 py-40">
        <form
          onSubmit={() => {
            uploadData();
          }}
          className="flex flex-col md:px-80 gap-4"
        >
          <label htmlFor="image">Image</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            id="image"
            name="image"
            onChange={handleChange}
            required
            className="ring-1 ring-black p-3"
          />
          {/* <p>{image[0].name}</p> */}
          <input
            type="text"
            placeholder="Title"
            id="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="ring-black ring-1 p-3"
            required
          />{" "}
          <input
            type="number"
            id="discount"
            placeholder="Discount"
            onChange={(e) => {
              setDiscount(e.target.value);
            }}
            className="ring-black ring-1 p-3"
          />{" "}
          <input
            type="boolean"
            id="instock"
            placeholder="Instock"
            onChange={(e) => {
              setInstock(e.target.value);
            }}
            className="ring-1 ring-black p-3"
            required
          />{" "}
          <input
            type="number"
            id="price"
            placeholder="Price"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            className="ring-1 ring-black p-3"
            required
          />{" "}
          <input
            type="number"
            id="quantity"
            placeholder="quantity"
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            className="ring-1 ring-black p-3"
          />
          <button
            id="uploadButton"
            className="bg-white ring-1 ring-black p-2"
            type="submit"
          >
            upload
          </button>
          {url.map((url) => {
            return <img key={url} src={url} alt="" />;
          })}
        </form>
      </div>
    </div>
  );
}
