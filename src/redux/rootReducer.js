import { combineReducers } from "redux";
import allCategoriesProduct from "./allCategoriesProduct";
import tablesRestaurantReducer from "./tablesRestaurantReducer";
import userSettingsReducer from "./userSettingsReducer";
export default combineReducers({
  userSettingsReducer: userSettingsReducer,
  tablesRestaurantReducer: tablesRestaurantReducer,
  allCategoriesProduct: allCategoriesProduct,
});
