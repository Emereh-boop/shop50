// helpers/shipping.js
import axios from "axios";

export const fetchShippingRates = async (address, parcel, froAdress) => {
  const SHIPPO_API_KEY = "shippo_test_4d4ba44eb6c228793377b49310a511441f561295";

  try {
    const response = await axios.post(
      "https://api.goshippo.com/shipments/",
      {
        address_from: { froAdress /* Store address */ },
        address_to: { address },
        parcel: { parcel /* Parcel details */ },
      },
      {
        headers: {
          Authorization: `ShippoToken ${SHIPPO_API_KEY}`,
        },
      }
    );
    return response.data.rates;
  } catch (error) {
    return [];
  }
};
