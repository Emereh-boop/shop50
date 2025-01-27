import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function CollectionPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "collections"));
        const collectionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error fetching collections: ", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="bg-gradient-to-t from-gray-400  to-slate-50 w-full lg:grid-cols-2  grid-cols-1 grid ">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className=" col-span-1 relative bg-gradient-to-t from-gray-400 to-slate-50 border "
        >
          <div>
            <img
              className="absolute inset-0 object-contain lg:object-cover w-full h-full"
              src={collection.imageUrl}
              alt={Image.title}
            />

            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative p-5 z-10 w-full max-w-6xl px-6 text-center pt-80">
              <h2 className="text-white text-6xl font-extrabold mb-4">
                {collection.category}
              </h2>
              <button className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition">
                Shop
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    // <div className="bg-gray-100">
    //   <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    //     <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
    //       <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

    //       <div className="mt-6 grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-6">
    //         {collections.map((collection) => (
    //           <div key={collection.id} className="group relative">
    //             <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
    //               <img
    //                 src={collection.imageUrl}
    //                 alt={collection.image.title}
    //                 className="h-full w-full object-cover object-center"
    //               />
    //             </div>
    //             <h3 className="mt-6 text-sm text-gray-500">
    //               <a href={collection.href}>
    //                 <span className="absolute inset-0" />
    //                 {collection.title}
    //               </a>
    //             </h3>
    //             <p className="text-base font-semibold text-gray-900">
    //               {collection.description}
    //             </p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
