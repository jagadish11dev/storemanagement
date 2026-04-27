import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/purchase-orders");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// Add purchase order
export const addPurchaseOrder = createAsyncThunk(
  "purchaseOrders/add",
  async (purchaseOrderData, thunkAPI) => {
    try {
      const res = await API.post("/purchase-orders", purchaseOrderData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const purchaseOrderSlice = createSlice({
  name: "purchaseOrders",
  initialState: { list: [], loading: false, error: null, addLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPurchaseOrder.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addPurchaseOrder.fulfilled, (state, action) => {
        state.addLoading = false;
        state.list.push(action.payload);
      })
      .addCase(addPurchaseOrder.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      });
  },
});

export default purchaseOrderSlice.reducer;