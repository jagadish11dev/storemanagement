import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchSales = createAsyncThunk("sales/fetch", async (_, thunkAPI) => {
  try {
    const res = await API.get("/sales");
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Add sale
export const addSale = createAsyncThunk("sales/add", async (saleData, thunkAPI) => {
  try {
    const res = await API.post("/sales", saleData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const salesSlice = createSlice({
  name: "sales",
  // include pagination metadata so the UI can render counts, pages etc.
  initialState: { records: [], page: 1, pages: 1, total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        // payload is { sales, page, pages, total }
        state.records = action.payload.sales || [];
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSale.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSale.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload);
      })
      .addCase(addSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default salesSlice.reducer;
