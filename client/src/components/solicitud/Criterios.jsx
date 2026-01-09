import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Stack,
  Text,
  Icon,
  Badge,
  useColorModeValue,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSolicitudes, reset } from '../../features/solicitudSlice';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiFilter,
} from 'react-icons/fi';
import { customStyles } from '../../helpers/customStyles';
import { Loading } from '../../helpers/Loading';
import ModalEditarSolicitud from './ModalEditarSolicitud';
import ModalDetallesSolicitud from './ModalDetallesSolicitud';
import ModalConfigurarBusqueda from './ModalConfigurarBusqueda'; // Nuevo componente
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ModuleHeader } from '../global/ModuleHeader';

const Criterios = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeTable = useColorModeValue('default', 'solarized');
  const { isOpen, onOpen, onClose } = useDisclosure(); // Para el modal
  const [selectedSolicitud, setSelectedSolicitud] = useState(null); // Para almacenar la solicitud seleccionada

  const { user } = useSelector(state => state.auth);
  const { solicitudes, isLoading, isError, message, currentPage, totalRows } =
    useSelector(state => state.solicitudes);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/uee');
    }
    dispatch(getSolicitudes({ page: currentPage, perPage }));

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch, currentPage, perPage]);

  if (isError) {
    //ToastChakra('Error', message, 'error', 1500);
    console.error(message);
  }

  const getBadgeColor = estado => {
    switch (estado) {
      case 'Pendiente':
        return 'yellow';
      case 'En Proceso':
        return 'blue';
      case 'Completado':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleConfigurarBusqueda = solicitud => {
    setSelectedSolicitud(solicitud);
    onOpen();
  };

  const columns = [
    {
      name: 'FECHA CREACIÓN',
      selector: row =>
        format(new Date(row.fecha_creacion), 'dd MMM yyyy', { locale: es }),
      sortable: true,
      width: '150px',
      center: true,
      cellExport: row => format(new Date(row.fecha_creacion), 'dd/MM/yyyy'),
    },
    {
      name: 'TÍTULO',
      selector: row => row.titulo,
      sortable: true,
      cellExport: row => row.titulo,
    },
    {
      name: 'ESTADO',
      selector: row => row.estado,
      sortable: true,
      width: '150px',
      center: true,
      cell: row => (
        <Badge
          colorScheme={getBadgeColor(row.estado)}
          variant="subtle"
          px={3}
          py={1}
          rounded="full"
        >
          {row.estado}
        </Badge>
      ),
      cellExport: row => row.estado,
    },
    {
      name: 'FECHA FINALIZACIÓN',
      selector: row =>
        row.fecha_finalizacion
          ? format(new Date(row.fecha_finalizacion), 'dd MMM yyyy', {
              locale: es,
            })
          : 'No completado',
      sortable: true,
      width: '180px',
      center: true,
      cellExport: row =>
        row.fecha_finalizacion
          ? format(new Date(row.fecha_finalizacion), 'dd/MM/yyyy')
          : 'No completado',
    },
    {
      name: 'CRITERIOS BÚSQUEDA',
      width: '200px',
      center: true,
      cell: row => (
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          leftIcon={<FiFilter />}
          onClick={() => handleConfigurarBusqueda(row)}
        >
          Configurar
        </Button>
      ),
    },
    {
      name: 'ACCIONES',
      export: false,
      center: true,
      width: '200px',
      cell: row => (
        <Stack direction="row" spacing={2} justifyContent="center">
          <ModalEditarSolicitud solicitud={row} />
          <ModalDetallesSolicitud solicitud={row} />
        </Stack>
      ),
    },
  ];

  const handlePageChange = page => {
    setPage(page);
    dispatch(getSolicitudes({ page, perPage }));
  };

  const handleRowsPerPageChange = newPerPage => {
    setPerPage(newPerPage);
    dispatch(getSolicitudes({ page: 1, perPage: newPerPage }));
  };

  const tableData = { columns: columns, data: solicitudes || [] };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <ModuleHeader
        moduleName="Gestión de Solicitudes de Análisis"
        submoduleName="Criterios de Búsqueda"
      />

      {/* Modal para configurar búsqueda */}
      <ModalConfigurarBusqueda
        isOpen={isOpen}
        onClose={onClose}
        solicitud={selectedSolicitud}
      />

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
            backgroundColor: 'primary.1000',
            color: 'white',
            borderColor: 'blue.700',
            borderRadius: 'md',
            _hover: {
              backgroundColor: 'primary.1200',
            },
            _focus: {
              borderColor: 'blue.800',
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
            fileName={'SOLICITUDES_' + new Date().toLocaleDateString()}
          >
            <DataTable
              defaultSortField="fecha_creacion"
              defaultSortAsc={false}
              defaultSortOrder="desc"
              pagination
              paginationServer
              paginationTotalRows={totalRows}
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
                  ⚠️ No hay solicitudes registradas.
                </Text>
              }
            />
          </DataTableExtensions>
        )}
      </Box>
    </>
  );
};

export default Criterios;
