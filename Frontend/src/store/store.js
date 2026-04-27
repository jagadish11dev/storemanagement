import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import salesReducer from "../features/sales/salesSlice";
import supplierReducer from "../features/suppliers/supplierSlice";
import purchaseOrderReducer from "../features/purchaseOrders/purchaseOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: salesReducer,
    suppliers: supplierReducer,
    purchaseOrders: purchaseOrderReducer,
  },
});
