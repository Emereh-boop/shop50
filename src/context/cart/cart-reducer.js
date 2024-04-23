import {
  SHOW_HIDE_CART,
  ADD_TO_CART,
  REMOVE_ITEM,
  SET_LIKED_ITEM,
} from "../types";

const CartReducer = (state, action) => {
  switch (action.type) {
    case SHOW_HIDE_CART: {
      return { ...state, showCart: !state.showCart };
    }
    case ADD_TO_CART: {
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }
    case SET_LIKED_ITEM: {
      return { ...state, likedItems: [...state.likedItems, action.payload] };
    }
    case REMOVE_ITEM: {
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.key !== action.payload
        ),
      };
    }

    default:
      return state;
  }
};

export default CartReducer;
