import React, { useEffect } from 'react';
import {
  Flex,
  Stack,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Divider,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabIndicator,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getReportesEBR, reset } from '../../features/reporteSlice';
import { ToastChakra } from '../../helpers/toast';
import { Loading } from '../../helpers/Loading';
import { FiArrowRight } from 'react-icons/fi';
import { TableComponent } from './TableComponent';
import moment from 'moment';
import SalesChartMonth from './SalesChartMonth';
import ICONDAY from '../../assets/icons/v-dia.png';
import ICONWEEK from '../../assets/icons/v-semana.png';
import ICONMONTH from '../../assets/icons/v-mes.png';
import ICONYEAR from '../../assets/icons/v-anio.png';

import './sidebar.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    reportePagos,
    ventasDia,
    dataforGraph,
    ventasSemana,
    ventasMes,
    isLoading,
    isError,
    message,
  } = useSelector(state => state.reportes);

  useEffect(() => {
    dispatch(getReportesEBR());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate]);

  if (isError) {
    ToastChakra('Error', message, 'error', 1500);
    console.log(message);
  }

  if (isLoading) {
    return <Loading />;
  }

  const getTiempoTranscurrido = createdAt => {
    const fechaCreacion = moment(createdAt);
    const fechaActual = moment();
    const tiempoTranscurrido = moment.duration(fechaActual.diff(fechaCreacion));
    return tiempoTranscurrido.humanize();
  };

  const columns = [
    {
      Header: 'CODIGO',
      accessor: 'codigo',
    },
    {
      Header: 'ESTUDIANTE',
      accessor: 'estudiante.nombres',
      Cell: row => (
        <Text noOfLines={1}>
          {row.value} {row.row.original.estudiante.apellidos}
        </Text>
      ),
    },
    {
      Header: 'IMPORTE',
      accessor: 'importe',
      Cell: row => <Text noOfLines={1}>S/{row.value}</Text>,
    },
    {
      Header: 'TIEMPO',
      accessor: 'updatedAt',
      Cell: row => (
        <Text noOfLines={1}>hace {getTiempoTranscurrido(row.value)}</Text>
      ),
    },
    {
      Header: 'ESTADO',
      accessor: 'estado',
      Cell: row => (
        <Badge colorScheme={row.value === 'CANCELADO' ? 'green' : 'red'}>
          {row.value}
        </Badge>
      ),
    },
    {
      accessor: '_id',
      Cell: row => (
        <Stack
          direction="row"
          display={'flex'}
          spacing={0}
          justifyContent="center"
        >
          <Link
            to={{
              pathname: '/pagos/boleta/' + row.value,
            }}
          >
            <IconButton
              icon={<FiArrowRight fontSize={22} />}
              variant="ghost"
              rounded="full"
              colorScheme="gray"
              onClick={() => console.log(row.value)}
            />
          </Link>
        </Stack>
      ),
      disableSortBy: true,
      disableFilters: true,
      disableGroupBy: true,
    },
  ];

  return (
    <main>
      <div className="dashboard-content">
        <h1>Bienvenido al Panel de Control</h1>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>

      <div className="dashboard-container">
        <a
          href="http://localhost:3000/67bd99ede85190e8b7854c6e/"
          className="dashboard-item"
        >
          <div className="dashboard-icon">
            <i className="bx bxs-dashboard"></i>
          </div>
          <div className="dashboard-text">Inicio</div>
        </a>

        <a
          href="http://localhost:3000/67bd99ede85190e8b7854c6e/usuarios"
          className="dashboard-item"
        >
          <div className="dashboard-icon">
            <i className="bx bxs-user"></i>
          </div>
          <div className="dashboard-text">Usuarios</div>
        </a>

        <a
          href="http://localhost:3000/67bd99ede85190e8b7854c6e/proceso"
          className="dashboard-item"
        >
          <div className="dashboard-icon">
            <i className="bx bx-search-alt"></i>
          </div>
          <div className="dashboard-text">Proceso</div>
        </a>

        <a
          href="http://localhost:3000/67bd99ede85190e8b7854c6e/analisis"
          className="dashboard-item"
        >
          <div className="dashboard-icon">
            <i className="bx bxs-analyse"></i>
          </div>
          <div className="dashboard-text">Analisis y Clasificación</div>
        </a>

        <a href="http://localhost:5173/reports" className="dashboard-item">
          <div className="dashboard-icon">
            <i className="bx bxs-report"></i>
          </div>
          <div className="dashboard-text">Reportes</div>
        </a>

        <a
          href="http://localhost:3000/67bd99ede85190e8b7854c6e/config"
          className="dashboard-item"
        >
          <div className="dashboard-icon">
            <i className="bx bx-cog"></i>
          </div>
          <div className="dashboard-text">Configuración</div>
        </a>
      </div>
    </main>
  );
};

export default Home;

const CardHome = ({ montoRecaudado, textHeader, cardImage }) => {
  const textColor = useColorModeValue('gray.700', 'gray.100');

  return (
    <Stack
      boxShadow={'base'}
      bg="white"
      _dark={{ bg: 'primary.1000' }}
      rounded={'2xl'}
      p={2}
    >
      <Stack spacing={4} align={'center'} px={2} py={5} direction="row">
        <Image
          src={cardImage}
          boxSize={{
            base: '40px',
            md: '40px',
            lg: '50px',
          }}
        />
        <Stack direction="column" spacing={0}>
          <Text color={textColor} fontSize="xs" noOfLines={1}>
            {textHeader}
          </Text>
          <Text
            fontWeight={600}
            color={textColor}
            fontSize={{ base: 'md', md: 'lg', lg: '2xl' }}
          >
            S/{montoRecaudado}
          </Text>
        </Stack>
        {/* </Stack> */}
        {/* <Divider />
      <Stack p={1}>
        <Stack spacing={0} align={'start'}>
          <Button
            colorScheme="gray"
            variant="ghost"
            rightIcon={<Icon as={FiArrowRight} boxSize="16px" />}
            color={textColor}
            rounded="xl"
            size={{
              base: 'xs',
              md: 'xs',
              lg: 'sm'
            }}
          >
            {textButton}
          </Button>
        </Stack> */}
      </Stack>
    </Stack>
  );
};
