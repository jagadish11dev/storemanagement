import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";
import axios from "axios";
// Fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (searchTerm = '', thunkAPI) => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const res = await API.get("/products", { params });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// // Add product
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";  // 👈 this is required

export const addProduct = createAsyncThunk(
  "products/add",
  async (productData, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      if (!token) {
        const errorMsg = "User not authenticated. Please login first.";
        console.error(errorMsg);
        return thunkAPI.rejectWithValue(errorMsg);
      }

      console.log("Adding product with token:", token?.substring(0, 20) + "...");
      
      const res = await axios.post(
        "http://localhost:5000/api/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // Don't manually set Content-Type for FormData - axios handles it automatically
          },
        }
      );
      
      console.log("Product added successfully:", res.data);
      return res.data;
    } catch (err) {
      console.error("Add product error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      
      const errorMsg = err.response?.data?.message || 
                       err.response?.data || 
                       err.message || 
                       "Failed to add product";
      
      return thunkAPI.rejectWithValue(errorMsg);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue("User not authenticated. Please login first.");
      }
      
      const res = await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Product deleted successfully:", res.data);
      return productId; // Return ID for removal from state
    } catch (err) {
      console.error("Delete error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ productId, productData }, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      const res = await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // Don't manually set Content-Type for FormData
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null, addLoading: false, deleteLoading: {} },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.addLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        delete state.deleteLoading[action.meta.arg];
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
        delete state.deleteLoading[action.meta.arg];
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
