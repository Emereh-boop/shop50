import {
  ADD_FILTER,
  REMOVE_FILTER,
  CLEAR_CART,
  CLEAR_FILTER,
  ADD_TO_CART,
  REMOVE_ITEM,
  UPDATE_QUANTITY, // Import the new action type
} from "../types";

const CartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // If item already exists, update quantity instead of adding duplicate
        const updatedCart = [...state.cartItems];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cartItems: updatedCart };
      }

      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }

    case UPDATE_QUANTITY: {
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    case REMOVE_ITEM: {
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    }

    case ADD_FILTER: {
      return { ...state, filters: [...state.filters, action.payload] };
    }

    case REMOVE_FILTER: {
      return {
        ...state,
        filters: state.filters.filter((item) => item.item !== action.payload),
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
