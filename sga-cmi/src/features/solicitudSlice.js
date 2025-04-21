// features/solicitudSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import solicitudService from '../services/solicitud.service';

const initialState = {
  solicitudes: [],
  solicitud: null,
  currentPage: 1,
  totalRows: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getSolicitudes = createAsyncThunk(
  'solicitudes/getAll',
  async ({ page = 1, perPage = 10 }, thunkAPI) => {
    try {
      const data = await solicitudService.getSolicitudes(page, perPage);
      return {
        solicitudes: data.solicitudes,
        currentPage: data.currentPage,
        totalRows: data.totalRows,
      };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const actualizarSolicitud = createAsyncThunk(
  'solicitudes/update',
  async ({ id, solicitudData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await solicitudService.actualizarSolicitud(
        id,
        solicitudData,
        token
      );

      // Actualización optimista
      thunkAPI.dispatch(updateSolicitudOptimista(response.solicitud));

      return response.solicitud;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createSolicitud = createAsyncThunk(
  'solicitudes/create',
  async (solicitudData, thunkAPI) => {
    try {
      return await solicitudService.createSolicitud(solicitudData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

const solicitudSlice = createSlice({
  name: 'solicitudes',
  initialState,
  reducers: {
    reset: () => initialState,
    updateSolicitudOptimista: (state, action) => {
      state.solicitudes = state.solicitudes.map(solicitud =>
        solicitud._id === action.payload._id ? action.payload : solicitud
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getSolicitudes.pending, state => {
        state.isLoading = true;
      })
      .addCase(getSolicitudes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.solicitudes = action.payload.solicitudes;
        state.currentPage = action.payload.currentPage;
        state.totalRows = action.payload.totalRows;
      })
      .addCase(getSolicitudes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(actualizarSolicitud.pending, state => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(actualizarSolicitud.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.solicitudes = state.solicitudes.map(solicitud =>
          solicitud._id === action.payload._id ? action.payload : solicitud
        );
      })
      .addCase(actualizarSolicitud.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSolicitud.fulfilled, (state, action) => {
        state.solicitudes.push(action.payload);
      });
  },
});

export const { reset, updateSolicitudOptimista } = solicitudSlice.actions;
export default solicitudSlice.reducer;
