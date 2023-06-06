import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/app.slice";
import filtersReducer from "./slices/filters.slice";
import productsReducer from "./slices/products.slice";
import partnersReducer from "./slices/partners.slice";
import colorsReducer from "./slices/colors.slice";
import wishListReducer from "./slices/wishList.slice";
import catalogReducer from "./slices/catalog.slice";
import cityReducer from "./slices/city.slice";
import postOfficeReducer from "./slices/postOffice.slice";
import customersReducer from "./slices/customers.slice";

const store = configureStore({
  reducer: {
    app: appReducer,
    filters: filtersReducer,
    products: productsReducer,
    partners: partnersReducer,
    colors: colorsReducer,
    wishList: wishListReducer,
    catalog: catalogReducer,
    city: cityReducer,
    postOffice: postOfficeReducer,
    customers: customersReducer,
  },
});

export default store;
