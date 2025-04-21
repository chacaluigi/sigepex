import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getReports,
  getReportsBySolicitud,
  reset,
} from '../../features/reportSlice';
import { getSolicitudes } from '../../features/solicitudSlice';
import { ToastChakra } from '../../helpers/toast';
import { customStyles } from '../../helpers/customStyles';
import { Loading } from '../../helpers/Loading';
import { ModalEditarReporte } from './ModalEditarReporte';
import { ModalDetallesReporte } from './ModalDetallesReporte';
import { ModalDescargar } from './ModalDescargar';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Reportes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeTable = useColorModeValue('default', 'solarized');

  const { user } = useSelector(state => state.auth);
  const {
    reports,
    reportsBySolicitud,
    isLoading,
    isError,
    message,
    currentPage,
    totalRows,
  } = useSelector(state => state.reports);

  const { solicitudes } = useSelector(state => state.solicitudes);

  const [perPage, setPerPage] = useState(40);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('bySolicitud'); // 'all' or 'bySolicitud'

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    // Cargar datos iniciales
    dispatch(getReports({ page: currentPage, perPage }));
    dispatch(getSolicitudes());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (viewMode === 'bySolicitud') {
      dispatch(getReportsBySolicitud());
    }
  }, [viewMode, dispatch]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.error(message);
  }

  // Función para formatear fecha y hora
  const formatDateTime = (dateString, fechaReporte, horaReporte) => {
    try {
      let date;

      if (fechaReporte && horaReporte) {
        const [dia, mes, anio] = fechaReporte.split('/').map(Number);
        const [horas, minutos] = horaReporte.includes(':')
          ? horaReporte.split(':').map(Number)
          : [0, 0];
        date = new Date(anio, mes - 1, dia, horas, minutos);
      } else if (dateString) {
        date = parseISO(dateString);
      } else {
        return {
          date: '--/--/----',
          time: '--:--',
          fullDate: 'Fecha inválida',
          fullDateTime: 'Fecha y hora inválidas',
          timestamp: 0,
        };
      }

      return {
        date: format(date, 'dd/MM/yyyy', { locale: es }),
        time: format(date, 'HH:mm', { locale: es }),
        fullDate: format(date, "dd 'de' MMMM 'de' yyyy", { locale: es }),
        fullDateTime: format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
          locale: es,
        }),
        timestamp: date.getTime(),
      };
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return {
        date: '--/--/----',
        time: '--:--',
        fullDate: 'Fecha inválida',
        fullDateTime: 'Fecha y hora inválidas',
        timestamp: 0,
      };
    }
  };

  const columns = [
    {
      name: 'FECHA',
      selector: row => formatDateTime(row.createdAt, row.fecha, row.hora).date,
      sortable: true,
      center: true,
      width: '100px',
      cell: row => (
        <Badge
          colorScheme="purple"
          variant="subtle"
          px={2}
          py={1}
          borderRadius="md"
        >
          {formatDateTime(row.createdAt, row.fecha, row.hora).date}
        </Badge>
      ),
    },
    {
      name: 'NRO.',
      selector: row => row.numero_reporte,
      sortable: true,
      width: '80px',
      center: true,
    },
    {
      name: 'TEMA',
      selector: row => row.tema,
      sortable: true,
      minWidth: '200px',
    },
    {
      name: 'FACTOR',
      selector: row => (Array.isArray(row.factor) ? row.factor.join(', ') : ''),
      sortable: false,
      center: true,
      width: '180px',
    },
    {
      name: 'ACCIONES',
      export: false,
      center: true,
      width: '180px',
      cell: row => (
        <Stack direction="row" spacing={2} justify="center">
          <ModalEditarReporte row={row} />
          <ModalDetallesReporte reporte={row} />
          <ModalDescargar row={row} />
        </Stack>
      ),
    },
  ];

  const handlePageChange = page => {
    setPage(page);
    dispatch(getReports({ page, perPage }));
  };

  const handleRowsPerPageChange = newPerPage => {
    setPerPage(newPerPage);
    dispatch(getReports({ page: 1, perPage: newPerPage }));
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'all' ? 'bySolicitud' : 'all');
  };

  // Datos para la tabla normal
  const tableData = {
    columns,
    data: reports?.reports || [],
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Stack
        spacing={4}
        direction="row"
        justifyContent="space-between"
        py={4}
        px={0}
      >
        <Heading size="lg">Reportes</Heading>
        <Badge
          colorScheme={viewMode === 'all' ? 'blue' : 'green'}
          cursor="pointer"
          onClick={toggleViewMode}
          px={3}
          py={1}
          borderRadius="md"
        >
          {viewMode === 'all' ? 'Ver por solicitud' : 'Ver todos'}
        </Badge>
      </Stack>
      {}
      {viewMode === 'all' ? (
        <Box
          borderRadius="2xl"
          borderTop={'2px'}
          borderTopColor={'primary.100'}
          overflow="hidden"
          boxShadow={'base'}
          bg="white"
          _dark={{ bg: 'primary.1000' }}
          mt={2}
          pt={2}
        >
          <DataTableExtensions
            {...tableData}
            exportHeaders={true}
            filterPlaceholder="BUSCAR"
            numberOfColumns={columns.length}
            fileName={`REPORTES_${format(new Date(), 'yyyy-MM-dd')}`}
          >
            <DataTable
              defaultSortField="createdAt"
              defaultSortAsc={false}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={perPage}
              paginationDefaultPage={page}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
              customStyles={customStyles}
              theme={themeTable}
              pointerOnHover
              responsive
              noDataComponent={
                <Text mb={4} fontSize="lg">
                  ⚠️ No hay reportes disponibles.
                </Text>
              }
            />
          </DataTableExtensions>
        </Box>
      ) : (
        <Box
          borderRadius="2xl"
          borderTop={'2px'}
          borderTopColor={'primary.100'}
          overflow="hidden"
          boxShadow={'base'}
          bg="white"
          _dark={{
            bg: 'primary.1000',
            borderTopColor: 'primary.800',
          }}
          mt={2}
          p={4}
        >
          <Accordion allowMultiple>
            {reportsBySolicitud
              ?.reduce((acc, report) => {
                if (!report.solicitud) return acc;

                const existingIndex = acc.findIndex(
                  item => item.solicitudId === report.solicitud._id.toString()
                );

                if (existingIndex >= 0) {
                  acc[existingIndex].reports.push(report);
                } else {
                  acc.push({
                    solicitudId: report.solicitud._id.toString(),
                    solicitudTitle: report.solicitud.titulo,
                    reports: [report],
                  });
                }
                return acc;
              }, [])
              .map(group => (
                <AccordionItem
                  key={group.solicitudId}
                  mb={3}
                  border="1px"
                  borderColor="gray.200"
                  _dark={{ borderColor: 'gray.700' }}
                  borderRadius="lg"
                >
                  <AccordionButton
                    _hover={{ bg: 'gray.50' }}
                    _dark={{
                      _hover: { bg: 'primary.900' },
                      bg: 'primary.900',
                    }}
                  >
                    <Box
                      flex="1"
                      textAlign="left"
                      color="gray.800"
                      _dark={{ color: 'white' }}
                    >
                      {group.solicitudTitle} ({group.reports.length} reportes)
                    </Box>
                    <AccordionIcon
                      color="gray.600"
                      _dark={{ color: 'gray.300' }}
                    />
                  </AccordionButton>
                  <AccordionPanel
                    pb={4}
                    bg="white"
                    _dark={{ bg: 'primary.800' }}
                  >
                    <DataTable
                      columns={columns}
                      data={group.reports}
                      customStyles={customStyles}
                      theme={themeTable} // Asegúrate de pasar themeTable
                      noDataComponent={
                        <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                          No hay reportes para esta solicitud
                        </Text>
                      }
                    />
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </Box>
      )}
    </>
  );
};

export default Reportes;
