import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Badge,
  Link,
  Image,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiExternalLink } from 'react-icons/fi';
import { customStyles } from '../../helpers/customStyles';
import { Loading } from '../../helpers/Loading';
import postsData from '../../data/posts.json';

const ListarPosts = () => {
  const themeTable = useColorModeValue('default', 'solarized');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setPosts(postsData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Función para formatear fecha
  const formatDate = dateString => {
    try {
      const date = parseISO(dateString);
      return {
        date: format(date, 'dd/MM/yyyy', { locale: es }),
        time: format(date, 'HH:mm', { locale: es }),
        fullDateTime: format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
          locale: es,
        }),
      };
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return {
        date: '--/--/----',
        time: '--:--',
        fullDateTime: 'Fecha inválida',
      };
    }
  };

  const columns = [
    {
      name: 'FECHA PUBLICACIÓN',
      selector: row => formatDate(row.fecha_publicacion.$date).date,
      sortable: true,
      width: '120px',
      cell: row => (
        <Box>
          <Badge colorScheme="blue" variant="subtle">
            {formatDate(row.fecha_publicacion.$date).date}
          </Badge>
          {/* <Text fontSize="sm">
            {formatDate(row.fecha_publicacion.$date).time}
          </Text> */}
        </Box>
      ),
    },
    {
      name: 'FUENTE',
      selector: row => row.fuente,
      sortable: true,
      width: '200px',
      cell: row => (
        <Text isTruncated title={row.fuente}>
          {row.fuente}
        </Text>
      ),
    },
    {
      name: 'CONTENIDO',
      selector: row => row.contenido,
      sortable: false,
      minWidth: '300px',
      cell: row => (
        <Box>
          <Text noOfLines={3}>{row.contenido}</Text>
          {/* {row.imagenes && (
            <Image
              src={row.imagenes}
              alt="Miniatura"
              maxH="100px"
              mt={2}
              borderRadius="md"
            />
          )} */}
        </Box>
      ),
    },
    /* {
      name: 'ESTADÍSTICAS',
      selector: row => row.cantidad_likes,
      sortable: true,
      width: '150px',
      cell: row => (
        <Stack spacing={1}>
          <Text>👍 {row.cantidad_likes} Likes</Text>
          <Text>💬 {row.cantidad_replies} Replies</Text>
          <Text>👀 {row.cantidad_views} Views</Text>
        </Stack>
      ),
    }, */
    {
      name: 'ACCIONES',
      width: '100px',
      cell: row => (
        <Tooltip label="Ver post original">
          <IconButton
            as={Link}
            href={row.link}
            isExternal
            aria-label="Ver post original"
            icon={<FiExternalLink />}
            colorScheme="blue"
            variant="ghost"
          />
        </Tooltip>
      ),
    },
  ];

  const tableData = {
    columns,
    data: posts,
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
        <Heading size="lg">Posts Recolectados</Heading>
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
      >
        <DataTableExtensions
          {...tableData}
          exportHeaders={true}
          filterPlaceholder="BUSCAR POSTS..."
          numberOfColumns={columns.length}
          fileName={`POSTS_${format(new Date(), 'yyyy-MM-dd')}`}
        >
          <DataTable
            defaultSortField="fecha_publicacion"
            defaultSortAsc={false}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            customStyles={customStyles}
            theme={themeTable}
            pointerOnHover
            responsive
            noDataComponent={
              <Text mb={4} fontSize="lg">
                No se encontraron posts
              </Text>
            }
          />
        </DataTableExtensions>
      </Box>
    </>
  );
};

export default ListarPosts;
