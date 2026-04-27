import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/suppliers");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// Add supplier
export const addSupplier = createAsyncThunk(
  "suppliers/add",
  async (supplierData, thunkAPI) => {
    try {
      const res = await API.post("/suppliers", supplierData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const supplierSlice = createSlice({
  name: "suppliers",
  initialState: { list: [], loading: false, error: null, addLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSupplier.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.addLoading = false;
        state.list.push(action.payload);
      })
      .addCase(addSupplier.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      });
  },
});

export default supplierSlice.reducer;
