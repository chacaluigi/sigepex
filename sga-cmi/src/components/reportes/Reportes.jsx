import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Stack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getReports, reset } from '../../features/reportSlice';
import { ToastChakra } from '../../helpers/toast';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import { customStyles } from '../../helpers/customStyles';
import { Loading } from '../../helpers/Loading';
import { ModalEditarReporte } from './ModalEditarReporte';
import { ModalDetallesReporte } from './ModalDetallesReporte';
import { ModalDescargar } from './ModalDescargar';

const Reportes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeTable = useColorModeValue('default', 'solarized');

  const { user } = useSelector(state => state.auth);
  const { reports, isLoading, isError, message, currentPage, totalRows } =
    useSelector(state => state.reports);

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    dispatch(getReports({ page: currentPage, perPage }));

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch, currentPage, perPage]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.error(message);
  }

  const columns = [
    {
      name: 'FECHA',
      selector: row => row.fecha,
      center: true,
      sortable: true,
      width: '120px',
      cellExport: row => row.fecha, // ✅ Se asegura de exportar la fecha
    },
    {
      name: 'HORA',
      selector: row => row.hora,
      sortable: true,
      width: '120px',
      center: true,
      cellExport: row => row.hora, // ✅ Se agrega exportación
    },
    {
      name: 'NRO.',
      selector: row => row.numero_reporte,
      sortable: true,
      width: '120px',
      center: true,
      cellExport: row => row.numero_reporte, // ✅ Se agrega exportación
    },
    {
      name: 'TEMA',
      selector: row => row.tema,
      sortable: true,
      cellExport: row => row.tema, // ✅ Se agrega exportación
    },
    {
      name: 'FACTOR',
      selector: row => (Array.isArray(row.factor) ? row.factor.join(', ') : ''),
      sortable: false,
      center: true,
      width: '220px',
      cellExport: row =>
        Array.isArray(row.factor) ? row.factor.join(', ') : '', // ✅ Se agrega exportación
    },
    {
      name: 'ACCIONES',
      export: false,
      center: true,
      cell: row => (
        <div>
          <ModalEditarReporte row={row} />
          <ModalDetallesReporte reporte={row} />
          <ModalDescargar row={row} />
        </div>
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
  const tableData = { columns: columns, data: reports?.reports || [] };
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
      </Stack>
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
        sx={{
          select: {
            backgroundColor: 'primary.1000', // Color de fondo
            color: 'white', // Color del texto
            borderColor: 'blue.700', // Color del borde
            borderRadius: 'md', // Bordes redondeados
            _hover: {
              backgroundColor: 'primary.1200', // Color de fondo al hacer hover
            },
            _focus: {
              borderColor: 'blue.800', // Color del borde al enfocar
            },
          },
        }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <DataTableExtensions
            {...tableData}
            exportHeaders={true}
            filterPlaceholder="BUSCAR"
            numberOfColumns={columns.length}
            fileName={'REPORTES' + new Date().toLocaleDateString()}
          >
            <DataTable
              defaultSortField="createdAt"
              defaultSortAsc={false}
              defaultSortOrder="desc"
              pagination
              paginationServer
              paginationTotalRows={totalRows} // Usa el total de registros del backend
              paginationPerPage={perPage}
              paginationDefaultPage={page}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50]}
              paginationComponentOptions={{
                rowsPerPageText: 'Filas por página:',
                rangeSeparatorText: 'de',
                noRowsPerPage: false,
                selectAllRowsItem: true,
                selectAllRowsItemText: 'Todos',
              }}
              paginationIconFirstPage={
                <Icon
                  as={FiChevronsLeft}
                  boxSize={6}
                  _dark={{ color: 'gray.300', _hover: { color: 'white' } }}
                />
              }
              paginationIconLastPage={
                <Icon
                  as={FiChevronsRight}
                  boxSize={6}
                  _dark={{ color: 'gray.300', _hover: { color: 'white' } }}
                />
              }
              paginationIconPrevious={
                <Icon
                  as={FiChevronLeft}
                  boxSize={6}
                  _dark={{ color: 'gray.300', _hover: { color: 'white' } }}
                />
              }
              paginationIconNext={
                <Icon
                  as={FiChevronRight}
                  boxSize={6}
                  _dark={{ color: 'gray.300', _hover: { color: 'white' } }}
                />
              }
              theme={themeTable}
              customStyles={customStyles}
              pointerOnHover
              responsive
              noDataComponent={
                <Text mb={4} fontSize="lg">
                  ⚠️ No hay reportes disponibles.
                </Text>
              }
            />
          </DataTableExtensions>
        )}
      </Box>
    </>
  );
};

export default Reportes;
