import React from 'react';
import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  AlignmentType,
  ImageRun,
} from 'docx';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { FiPrinter } from 'react-icons/fi';

export const ModalDescargar = ({ row }) => {
  const handleDownload = async () => {
    const createParagraph = (text, bold = false, center = false) =>
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold,
            font: 'Arial',
            size: 24, // Tamaño 12pt (24 half-points en docx)
          }),
        ],
      });

    // Descargar la imagen desde la URL y convertirla en un buffer
    let imageBuffer = null;
    try {
      const response = await fetch(
        `http://localhost:4000/api/proxy-image?url=${encodeURIComponent(
          row.image
        )}`
      );

      console.log(response);
      const imageBlob = await response.blob();
      imageBuffer = await imageBlob.arrayBuffer();
    } catch (error) {
      console.error('Error descargando la imagen:', error);
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `REPORTE INMEDIATO Nº 0${row.numero_reporte}/25`,
                  bold: true,
                  font: 'Arial',
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph('\n'),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tema: ${row.tema}`,
                  font: 'Arial',
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph('\n'),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [createParagraph('FACTOR', true)],
                    }),
                    new TableCell({
                      children: [createParagraph(row.factor.join(', '))],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        createParagraph('FECHA Y HORA DE EMISIÓN', true),
                      ],
                    }),
                    new TableCell({
                      children: [createParagraph(row.fecha + ' / ' + row.hora)],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [createParagraph('LUGAR DEL HECHO', true)],
                    }),
                    new TableCell({
                      children: [createParagraph(row.lugar.join(', '))],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [createParagraph('FUENTE', true)],
                    }),
                    new TableCell({
                      children: [createParagraph(row.fuentes.join(', '))],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2,
                      children: [
                        createParagraph('HECHO', true, true),
                        createParagraph('INFORMO A SU AUTORIDAD:', true),
                        createParagraph(row.hecho),
                      ],
                    }),
                  ],
                }),

                // 🔹 Agregar imagen debajo del HECHO
                ...(imageBuffer
                  ? [
                      new TableRow({
                        children: [
                          new TableCell({
                            columnSpan: 2,
                            children: [
                              new Paragraph({
                                children: [
                                  new ImageRun({
                                    data: imageBuffer,
                                    transformation: { width: 500, height: 250 },
                                  }),
                                ],
                                alignment: AlignmentType.CENTER,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ]
                  : []),

                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2,
                      children: [
                        createParagraph('ACTORES', true, true),
                        ...row.actores.map(actor =>
                          createParagraph(`- ${actor.nombre}, ${actor.cargo}`)
                        ),
                      ],
                    }),
                  ],
                }),
                /* new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2,
                      children: [
                        createParagraph('PROBABLE EVOLUCIÓN', true, true),
                        createParagraph(row.probable_evolucion),
                      ],
                    }),
                  ],
                }), */
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Reporte_${row.numero_reporte}.docx`);
  };

  return (
    <Tooltip label="Descargar Reporte en Word">
      <IconButton
        icon={<FiPrinter />}
        aria-label="Descargar"
        colorScheme="blue"
        ml={2}
        onClick={handleDownload}
      />
    </Tooltip>
  );
};
