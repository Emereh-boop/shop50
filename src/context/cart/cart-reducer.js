import { SHOW_HIDE_CART, CLEAR_CART, ADD_TO_CART, REMOVE_ITEM } from "../types";

const CartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }
    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    case REMOVE_ITEM: {
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => {
          return item.id !== action.payload;
        }),
      };
    }

    default:
      return state;
  }
};

export default CartReducer;
