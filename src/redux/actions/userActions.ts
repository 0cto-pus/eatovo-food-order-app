import axios from "axios";
import { Dispatch } from "react";
import { BASE_URL } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FoodModel, OfferModel, OrderModel, PickedAdress, PickedLocationResult, UserModel } from "../models";
import { API_KEY } from "@env";

export interface Address {
  displayAddress: string;
  city: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLocationAction {
  readonly type: "ON_UPDATE_LOCATION";
  payload: Address;
}

export interface UserErrorAction {
  readonly type: "ON_USER_ERROR";
  payload: any;
}

export interface UpdateCartAction {
  readonly type: "ON_UPDATE_CART";
  payload: FoodModel;
}

export interface UserLoginAction {
  readonly type: "ON_USER_LOGIN";
  payload: UserModel;
}

export interface CreateOrderAction {
  readonly type: "ON_CREATE_ORDER";
  payload: OrderModel;
}

export interface ViewOrderAction {
  readonly type: "ON_VIEW_ORDER";
  payload: [OrderModel];
}
export interface CancelOrderAction {
  readonly type: "ON_CANCEL_ORDER";
  payload: [OrderModel];
}
export interface UserLogoutAction {
  readonly type: "ON_USER_LOGOUT";
}

export interface AddRemoveOfferAction {
  readonly type: "ON_ADD_OFFER" | "ON_REMOVE_OFFER";
  payload: OfferModel;
}

export interface OnFetchLocationAction {
  readonly type: "ON_FETCH_LOCATION";
  payload: PickedAdress;
}
export type UserAction =
  | UpdateLocationAction
  | UserErrorAction
  | UpdateCartAction
  | UserLoginAction
  | CreateOrderAction
  | ViewOrderAction
  | CancelOrderAction
  | UserLogoutAction
  | AddRemoveOfferAction
  | OnFetchLocationAction;

export const onUpdateLocation = (location: Address) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const locationString = JSON.stringify(location);
      await AsyncStorage.setItem("user_location", locationString);

      dispatch({
        type: "ON_UPDATE_LOCATION",
        payload: location,
      });
    } catch (error) {
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onUpdateCart = (item: FoodModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_UPDATE_CART",
      payload: item,
    });
  };
};

export const OnUserLogin = (email: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${BASE_URL}user/login`, {
        email,
        password,
      });

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Login Error",
        });
      } else {
        const locationString = JSON.stringify(response.data);
        await AsyncStorage.setItem("user", locationString);
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const OnUserSignup = (email: string, phone: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${BASE_URL}user/create-account`, {
        email,
        phone,
        password,
      });

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Login Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const OnVerifyOTP = (otp: string, user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

      const response = await axios.get<UserModel>(`${BASE_URL}user/otp`);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const OnRequestOTP = (otp: string, user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

      const response = await axios.patch<UserModel>(`${BASE_URL}user/verify`, {
        otp,
      });

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const onCreateOrder = (cartItems: [FoodModel], user: UserModel, paymentResponse: string) => {
  let cart = new Array();
  cartItems.map((item) => {
    cart.push({ _id: item._id, unit: item.unit });
  });

  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

      const response = await axios.post<OrderModel>(`${BASE_URL}user/create-order`, { cart, paymentResponse });

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_CREATE_ORDER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};
export const onGetOrders = (user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

      const response = await axios.get<[OrderModel]>(`${BASE_URL}user/order`);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_VIEW_ORDER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const onCancelOrder = (order: OrderModel, user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

      const response = await axios.delete<[OrderModel]>(`${BASE_URL}user/order/${order._id}`);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_CANCEL_ORDER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};
export const onUserLogout = (order: OrderModel, user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      dispatch({
        type: "ON_USER_LOGOUT",
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const onApplyOffer = (offer: OfferModel, isRemove: boolean) => {
  return async (dispatch: Dispatch<UserAction>) => {
    if (isRemove) {
      dispatch({
        type: "ON_REMOVE_OFFER",
        payload: offer,
      });
    } else {
      dispatch({
        type: "ON_ADD_OFFER",
        payload: offer,
      });
    }
  };
};
export const onFetchLocation = (lat: string, lng: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.get<PickedLocationResult>(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=${API_KEY}`);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Address Fetching Error",
        });
      } else {
        const { results } = response.data;
        if (Array.isArray(results) && results.length > 0) {
          const pickedAddress = results[0];

          dispatch({
            type: "ON_FETCH_LOCATION",
            payload: pickedAddress,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Address Fetching Error",
      });
    }
  };
};
