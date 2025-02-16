import {
  ADD_FILTER,
  REMOVE_FILTER,
  CLEAR_CART,
  CLEAR_FILTER,
  ADD_TO_CART,
  REMOVE_ITEM,
} from "../types";

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
    case ADD_FILTER: {
      return { ...state, filters: [...state.filters, action.payload] };
    }
    case REMOVE_FILTER: {
      return {
        ...state,
        filters: state.filters.filter((item) => {
          return item.item !== action.payload;
        }),
      };
    }
    case CLEAR_FILTER:
      return {
        ...state,
        filters: [],
      };

    default:
      return state;
  }
};

export default CartReducer;
