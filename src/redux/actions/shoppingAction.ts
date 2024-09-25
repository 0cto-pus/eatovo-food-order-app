import axios from "axios";
import { Dispatch } from "react";
import { BASE_URL } from "../../utils";
import { FoodAvailability, FoodModel, OfferModel } from "../models";

export interface AvailabilityAction {
  readonly type: "ON_AVAILABILITY";
  payload: FoodAvailability;
}

export interface FoodSearchAction {
  readonly type: "ON_FOODS_SEARCH";
  payload: [FoodModel];
}

export interface ShoppingErrorAction {
  readonly type: "ON_SHOPPING_ERROR";
  payload: any;
}
export interface OfferSearchAction {
  readonly type: "ON_OFFER_SEARCH";
  payload: [OfferModel];
}
export type ShoppingAction = AvailabilityAction | ShoppingErrorAction | FoodSearchAction | OfferSearchAction;

export const onAvailability = (postCode: string) => {
  return async (dispatch: Dispatch<ShoppingAction>) => {
    try {
      const response = await axios.get<FoodAvailability>(`${BASE_URL}food/availability/${postCode}`);

      if (!response) {
        dispatch({
          type: "ON_SHOPPING_ERROR",
          payload: "Availability error",
        });
      } else {
        dispatch({
          type: "ON_AVAILABILITY",
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "ON_SHOPPING_ERROR",
        payload: error,
      });
    }
  };
};

export const onSearchFoods = (postCode: string) => {
  return async (dispatch: Dispatch<ShoppingAction>) => {
    try {
      const response = await axios.get<[FoodModel]>(`${BASE_URL}food/search/${postCode}`);

      if (!response) {
        dispatch({
          type: "ON_SHOPPING_ERROR",
          payload: "Availability error",
        });
      } else {
        dispatch({
          type: "ON_FOODS_SEARCH",
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "ON_SHOPPING_ERROR",
        payload: error,
      });
    }
  };
};

export const onGetOffers = (postCode: string) => {
  return async (dispatch: Dispatch<ShoppingAction>) => {
    try {
      const response = await axios.get<[OfferModel]>(`${BASE_URL}food/offers/${postCode}`);

      if (!response) {
        dispatch({
          type: "ON_SHOPPING_ERROR",
          payload: "Offer Availability error",
        });
      } else {
        dispatch({
          type: "ON_OFFER_SEARCH",
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "ON_SHOPPING_ERROR",
        payload: error,
      });
    }
  };
};
