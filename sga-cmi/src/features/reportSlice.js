import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../services/report.service';

const initialState = {
  reports: [],
  report: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Obtener todos los reportes
export const getReports = createAsyncThunk(
  'reports/getAll',
  async (_, thunkAPI) => {
    try {
      return await reportService.getReports();
    } catch (error) {
      const message =
        error.response?.data?.msg || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Obtener un reporte por ID
export const getReport = createAsyncThunk(
  'reports/getOne',
  async (id, thunkAPI) => {
    try {
      return await reportService.getReport(id);
    } catch (error) {
      const message =
        error.response?.data?.msg || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Crear un nuevo reporte
export const createReport = createAsyncThunk(
  'reports/create',
  async (reportData, thunkAPI) => {
    try {
      return await reportService.createReport(reportData);
    } catch (error) {
      const message =
        error.response?.data?.msg || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Actualizar un reporte
export const updateReport = createAsyncThunk(
  'reports/update',
  async ({ id, reportData }, thunkAPI) => {
    try {
      return await reportService.updateReport(id, reportData);
    } catch (error) {
      const message =
        error.response?.data?.msg || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Eliminar un reporte
export const deleteReport = createAsyncThunk(
  'reports/delete',
  async (id, thunkAPI) => {
    try {
      return await reportService.deleteReport(id);
    } catch (error) {
      const message =
        error.response?.data?.msg || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getReports.pending, state => {
        state.isLoading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReport.pending, state => {
        state.isLoading = true;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.report = action.payload;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          report => report._id !== action.payload
        );
      });
  },
});

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;
