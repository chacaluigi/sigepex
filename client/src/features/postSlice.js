// features/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../services/post.service';

export const getPostsBySolicitud = createAsyncThunk(
  'posts/getBySolicitud',
  async (solicitudId, thunkAPI) => {
    try {
      return await postService.getPostsBySolicitud(solicitudId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  message: '',
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getPostsBySolicitud.pending, state => {
        state.isLoading = true;
      })
      .addCase(getPostsBySolicitud.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPostsBySolicitud.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          action.error?.message ||
          'Error al obtener posts';
      });
  },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
