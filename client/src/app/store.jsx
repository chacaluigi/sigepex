import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import usuarioReducer from '../features/usuarioSlice';
import rolReducer from '../features/rolSlice';
import moduloReducer from '../features/moduloSlice';
import sedeReducer from '../features/sedeSlice';
import reportReducer from '../features/reportSlice';
import solicitudReducer from '../features/solicitudSlice';
import postReducer from '../features/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuarios: usuarioReducer,
    roles: rolReducer,
    modulos: moduloReducer,
    sedes: sedeReducer,
    reports: reportReducer,
    solicitudes: solicitudReducer,
    posts: postReducer,
  },
});
