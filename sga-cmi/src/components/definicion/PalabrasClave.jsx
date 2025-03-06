import React, { useEffect, useState } from 'react';
import {
  Box,
  Icon,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Button,
  Badge,
} from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import { customStyles } from '../../helpers/customStyles';
import { ModalAgregarPalabra } from './ModalAgregarPalabra';

const PalabrasClave = () => {
  const themeTable = useColorModeValue('default', 'solarized');

  const [palabrasClave, setPalabrasClave] = useState([
    // 🔵 PSICOSOCIAL (16)
    { id: 1, palabra: 'Ansiedad colectiva', categoria: 'Psicosocial' },
    { id: 2, palabra: 'Protesta social', categoria: 'Psicosocial' },
    { id: 3, palabra: 'Crisis emocional', categoria: 'Psicosocial' },
    { id: 4, palabra: 'Desinformación', categoria: 'Psicosocial' },
    { id: 5, palabra: 'Manipulación mediática', categoria: 'Psicosocial' },
    { id: 6, palabra: 'Rumores', categoria: 'Psicosocial' },
    { id: 7, palabra: 'Xenofobia', categoria: 'Psicosocial' },
    { id: 8, palabra: 'Estabilidad emocional', categoria: 'Psicosocial' },
    { id: 9, palabra: 'Fake news', categoria: 'Psicosocial' },
    { id: 10, palabra: 'Censura', categoria: 'Psicosocial' },
    { id: 11, palabra: 'Indignación ciudadana', categoria: 'Psicosocial' },
    { id: 12, palabra: 'Redes sociales', categoria: 'Psicosocial' },
    { id: 13, palabra: 'Efecto dominó', categoria: 'Psicosocial' },
    { id: 14, palabra: 'Crisis de valores', categoria: 'Psicosocial' },
    { id: 15, palabra: 'Discurso de odio', categoria: 'Psicosocial' },
    { id: 16, palabra: 'Manipulación psicológica', categoria: 'Psicosocial' },

    // 🟢 ECONÓMICA (16)
    { id: 17, palabra: 'Inflación', categoria: 'Económica' },
    { id: 18, palabra: 'Crisis financiera', categoria: 'Económica' },
    { id: 19, palabra: 'Recesión', categoria: 'Económica' },
    { id: 20, palabra: 'Desempleo', categoria: 'Económica' },
    { id: 21, palabra: 'Deuda externa', categoria: 'Económica' },
    { id: 22, palabra: 'Fuga de capitales', categoria: 'Económica' },
    { id: 23, palabra: 'Inversión extranjera', categoria: 'Económica' },
    { id: 24, palabra: 'Subsidios', categoria: 'Económica' },
    { id: 25, palabra: 'Pobreza', categoria: 'Económica' },
    { id: 26, palabra: 'Aranceles', categoria: 'Económica' },
    { id: 27, palabra: 'Salario mínimo', categoria: 'Económica' },
    { id: 28, palabra: 'Costo de vida', categoria: 'Económica' },
    { id: 29, palabra: 'Corrupción financiera', categoria: 'Económica' },
    { id: 30, palabra: 'Especulación', categoria: 'Económica' },
    { id: 31, palabra: 'Deflación', categoria: 'Económica' },
    { id: 32, palabra: 'Exportaciones', categoria: 'Económica' },

    // 🔴 POLÍTICA (16)
    { id: 33, palabra: 'Golpe de Estado', categoria: 'Política' },
    { id: 34, palabra: 'Dictadura', categoria: 'Política' },
    { id: 35, palabra: 'Democracia', categoria: 'Política' },
    { id: 36, palabra: 'Elecciones', categoria: 'Política' },
    { id: 37, palabra: 'Corrupción política', categoria: 'Política' },
    { id: 38, palabra: 'Manipulación electoral', categoria: 'Política' },
    { id: 39, palabra: 'Polarización', categoria: 'Política' },
    { id: 40, palabra: 'Crisis institucional', categoria: 'Política' },
    { id: 41, palabra: 'Debate presidencial', categoria: 'Política' },
    { id: 42, palabra: 'Oposición', categoria: 'Política' },
    { id: 43, palabra: 'Populismo', categoria: 'Política' },
    { id: 44, palabra: 'Asamblea legislativa', categoria: 'Política' },
    { id: 45, palabra: 'Referéndum', categoria: 'Política' },
    { id: 46, palabra: 'Intervención extranjera', categoria: 'Política' },
    { id: 47, palabra: 'Crisis de gobernabilidad', categoria: 'Política' },
    { id: 48, palabra: 'Poder ejecutivo', categoria: 'Política' },

    // ⚫ MILITAR (16)
    { id: 49, palabra: 'Conflicto bélico', categoria: 'Militar' },
    { id: 50, palabra: 'Ejército', categoria: 'Militar' },
    { id: 51, palabra: 'Guerra híbrida', categoria: 'Militar' },
    { id: 52, palabra: 'Milicia', categoria: 'Militar' },
    { id: 53, palabra: 'Desarme', categoria: 'Militar' },
    { id: 54, palabra: 'Operaciones encubiertas', categoria: 'Militar' },
    { id: 55, palabra: 'Guerra cibernética', categoria: 'Militar' },
    { id: 56, palabra: 'Defensa nacional', categoria: 'Militar' },
    { id: 57, palabra: 'Bases militares', categoria: 'Militar' },
    { id: 58, palabra: 'Seguridad fronteriza', categoria: 'Militar' },
    { id: 59, palabra: 'Estrategia de defensa', categoria: 'Militar' },
    { id: 60, palabra: 'Inteligencia militar', categoria: 'Militar' },
    { id: 61, palabra: 'Zona de conflicto', categoria: 'Militar' },
    { id: 62, palabra: 'Defensa aérea', categoria: 'Militar' },
    { id: 63, palabra: 'Ejercicios militares', categoria: 'Militar' },
    { id: 64, palabra: 'Presupuesto militar', categoria: 'Militar' },

    // 🟠 OTROS (16)
    { id: 65, palabra: 'Cambio climático', categoria: 'Otros' },
    { id: 66, palabra: 'Crisis energética', categoria: 'Otros' },
    { id: 67, palabra: 'Innovación tecnológica', categoria: 'Otros' },
    { id: 68, palabra: 'Seguridad informática', categoria: 'Otros' },
    { id: 69, palabra: 'Redes sociales', categoria: 'Otros' },
    { id: 70, palabra: 'Educación', categoria: 'Otros' },
    { id: 71, palabra: 'Salud pública', categoria: 'Otros' },
    { id: 72, palabra: 'Vacunas', categoria: 'Otros' },
    { id: 73, palabra: 'Ciencia y tecnología', categoria: 'Otros' },
    { id: 74, palabra: 'Ciberseguridad', categoria: 'Otros' },
    { id: 75, palabra: 'Espionaje', categoria: 'Otros' },
    { id: 76, palabra: 'Cultura', categoria: 'Otros' },
    { id: 77, palabra: 'Turismo', categoria: 'Otros' },
    { id: 78, palabra: 'Fenómenos naturales', categoria: 'Otros' },
    { id: 79, palabra: 'Conspiraciones', categoria: 'Otros' },
    { id: 80, palabra: 'Big Data', categoria: 'Otros' },
  ]);

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const handleAddPalabra = nuevaPalabra => {
    setPalabrasClave([...palabrasClave, nuevaPalabra]);
  };

  const columns = [
    {
      name: 'PALABRA CLAVE',
      selector: row => row.palabra,
      sortable: true,
      cell: row => <Text fontWeight="bold">{row.palabra}</Text>,
    },
    {
      name: 'CATEGORÍA',
      selector: row => row.categoria,
      sortable: true,
      center: true,
      cell: row => (
        <Badge
          bg="primary.100"
          color="white"
          fontSize="sm"
          py={1}
          px={3}
          rounded="full"
        >
          {row.categoria}
        </Badge>
      ),
    },
  ];

  const tableData = {
    columns: columns,
    data: palabrasClave,
  };

  return (
    <>
      <Stack
        spacing={4}
        direction="row"
        justifyContent="space-between"
        py={4}
        px={0}
      >
        <Heading size="lg">Palabras Clave</Heading>
        <ModalAgregarPalabra onAdd={handleAddPalabra} />
      </Stack>

      <Box
        borderRadius="2xl"
        borderTop="2px"
        borderTopColor="primary.100"
        overflow="hidden"
        boxShadow="base"
        bg="white"
        _dark={{ bg: 'primary.1000' }}
        mt={2}
        pt={2}
      >
        <DataTableExtensions
          {...tableData}
          print={false}
          exportHeaders={true}
          filterPlaceholder="Buscar palabra clave"
          fileName={`Palabras_Clave_${new Date().toLocaleDateString()}`}
        >
          <DataTable
            defaultSortField="palabra"
            defaultSortAsc={true}
            pagination
            paginationIconFirstPage={<Icon as={FiChevronsLeft} boxSize={6} />}
            paginationIconLastPage={<Icon as={FiChevronsRight} boxSize={6} />}
            paginationIconPrevious={<Icon as={FiChevronLeft} boxSize={6} />}
            paginationIconNext={<Icon as={FiChevronRight} boxSize={6} />}
            paginationServer
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50]}
            paginationDefaultPage={page}
            paginationTotalRows={palabrasClave.length}
            onChangePage={setPage}
            onChangeRowsPerPage={setPerPage}
            theme={themeTable}
            customStyles={customStyles}
            pointerOnHover
            responsive
            noDataComponent={
              <Text fontSize="lg">⚠️ No hay palabras clave disponibles.</Text>
            }
          />
        </DataTableExtensions>
      </Box>
    </>
  );
};

export default PalabrasClave;
