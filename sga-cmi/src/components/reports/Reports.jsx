import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReports, reset } from '../../features/reportSlice';
import { ToastChakra } from '../../helpers/toast';
import './reports.css';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const { reports, isLoading, isError, message } = useSelector(
    state => state.reports
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (!user.token) {
      navigate('/login');
    }
    dispatch(getReports());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, user]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.error(message);
  }

  return (
    <>
      <section className="table-container">
        <h2>📄 Reporte de Noticias</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Número</th>
              <th>Tema</th>
              <th>Categoría</th>
              <th>Factor</th>
              <th>Descargar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7">⏳ Cargando reports...</td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map(report => (
                <tr key={report._id}>
                  <td>{report.fecha}</td>
                  <td>{report.hora}</td>
                  <td>{report.numero_reporte}</td>
                  <td>{report.tema}</td>
                  <td>{report.categoria}</td>
                  <td>{report.factor.join(', ')}</td>
                  <td>
                    <a
                      href={`/download/${report._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📥 Descargar
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">⚠️ No hay reportes disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}
