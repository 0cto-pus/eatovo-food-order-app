import { UserAction, Address } from "../actions";
import { UserModel, UserState, FoodModel, OrderModel, OfferModel, PickedAdress } from "../models";

const initialState: UserState = {
  user: {} as UserModel,
  location: {} as Address,
  error: undefined,
  Cart: {} as [FoodModel],
  orders: {} as [OrderModel],
  appliedOffer: {} as OfferModel,
  pickedAddress: {} as PickedAdress,
};

const UserReducer = (state: UserState = initialState, action: UserAction) => {
  switch (action.type) {
    case "ON_UPDATE_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    case "ON_UPDATE_CART":
      if (!Array.isArray(state.Cart)) {
        return {
          ...state,
          Cart: [action.payload],
        };
      }

      const existingFoods = state.Cart.filter((item) => item._id == action.payload._id);

      //Check for Existing Product to update unit
      if (existingFoods.length > 0) {
        let updatedCart = state.Cart.map((food) => {
          if (food._id == action.payload._id) {
            food.unit = action.payload.unit;
          }
          return food;
        });

        return {
          ...state,
          Cart: updatedCart.filter((item) => item.unit > 0),
        };
      } else {
        // Add to cart if not added
        return {
          ...state,
          Cart: [...state.Cart, action.payload],
        };
      }
    case "ON_USER_LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "ON_USER_LOGOUT":
      return {
        ...state,
        user: {} as UserModel,
      };
    case "ON_CREATE_ORDER":
      if (!Array.isArray(state.orders)) {
        return {
          ...state,
          Cart: [],
          orders: [action.payload],
        };
      } else {
        return {
          ...state,
          Cart: [],
          orders: [...state.orders, action.payload],
        };
      }
    case "ON_VIEW_ORDER":
      return {
        ...state,
        orders: action.payload,
      };
    case "ON_CANCEL_ORDER":
      return {
        ...state,
        orders: action.payload,
      };
    case "ON_ADD_OFFER":
      return {
        ...state,
        appliedOffer: action.payload,
      };
    case "ON_REMOVE_OFFER":
      return {
        ...state,
        appliedOffer: {},
      };
    case "ON_FETCH_LOCATION":
      return {
        ...state,
        pickedAddress: action.payload,
      };
    default:
      return state;
  }
};

export { UserReducer };
