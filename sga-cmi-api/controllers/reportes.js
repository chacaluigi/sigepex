const { response } = require('express');
const Pago = require('../models/pago');
const Matricula = require('../models/matricula');
const Uniforme = require('../models/uniforme');

const getAllReporte = async (req, res = response) => {
    try {
        // Obtener los datos de los pagos de la base de datos
        const pagos = await Pago.countDocuments();

        // Obtener la cantidad total de estudiantes
        const totalEstudiantes = await Matricula.countDocuments();
        
        // Obtener cantidad de estudiantes por cada grado
        const estudiantesPorGrado = await Matricula.aggregate([
            {
                $lookup: {
                    from: 'grado',
                    localField: 'grado',
                    foreignField: '_id',
                    as: 'gradoInfo'
                }
            },
            {
                $unwind: '$gradoInfo'
            },
            {
                $group: {
                    _id: '$gradoInfo._id',
                    nombreGrado: { $first: '$gradoInfo.nombre' },
                    cantidadEstudiantes: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    grado: '$_id',
                    nombre: '$nombreGrado',
                    cantidadEstudiantes: 1
                }
            }
        ]);

        // Obtener cantidad de uniformes por artículo
        const countUniformesPorArticulo = await Uniforme.aggregate([
            {
                $group: {
                    _id: "$articulo",
                    cantidad: { $sum: "$cantidad" }
                }
            }
        ]);

        res.status(200).json({
            ok: true,
            pagos,
            estudiantes: {
                totalEstudiantes,
                porGrado: estudiantesPorGrado
            },
            uniformes: {
                totalCantidadUniformes: countUniformesPorArticulo.reduce((total, articulo) => total + articulo.cantidad, 0),
                countUniformesPorArticulo,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los datos',
        });
    }
};

const generarInformeDiario = async (req, res = response) => {
    try {

        const sort = { updatedAt: -1 };

        // Obtén las ventas del día actual
        const ventasDia = await Pago.find({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }).populate('estudiante', 'nombres apellidos').sort(sort);

        // Obtén las ventas de la semana actual
        const fechaInicioSemana = obtenerFechaInicioSemana();
        const ventasSemana = await Pago.find({ createdAt: { $gte: fechaInicioSemana } }).populate('estudiante', 'nombres apellidos').sort(sort);

        // Obtén las ventas del mes actual
        const fechaInicioMes = obtenerFechaInicioMes();
        const ventasMes = await Pago.find({ createdAt: { $gte: fechaInicioMes } }).populate('estudiante', 'nombres apellidos').sort(sort);

        // Obtén las ventas del año actual
        const fechaInicioAnio = obtenerFechaInicioAnio();
        const ventasAnio = await Pago.find({ createdAt: { $gte: fechaInicioAnio } });

        // obtener datos para el grafico
        const dataforGraph = await getDataforGraph();

        // Calcula el total de ventas de cada período
        const totalVentasDia = calcularTotalVentas(ventasDia);
        const totalVentasSemana = calcularTotalVentas(ventasSemana);
        const totalVentasMes = calcularTotalVentas(ventasMes);
        const totalVentasAnio = calcularTotalVentas(ventasAnio);

        res.json({
            ok: true,
            total: {
                totalVentasDia,
                totalVentasSemana,
                totalVentasMes,
                totalVentasAnio,
            },
            ventasDia,
            ventasSemana,
            ventasMes,
            dataforGraph,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al generar el informe diario',
        });
    }
};

// Función para obtener la fecha de inicio de la semana actual
const obtenerFechaInicioSemana = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).setHours(0, 0, 0, 0);
};

// Función para obtener la fecha de inicio del mes actual
const obtenerFechaInicioMes = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).setHours(0, 0, 0, 0);
};

// Función para obtener la fecha de inicio del año actual
const obtenerFechaInicioAnio = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1).setHours(0, 0, 0, 0);
};

// Función para calcular el total de ventas
const calcularTotalVentas = (ventas) => {
    let totalVentas = 0;
    ventas.forEach((venta) => {
        totalVentas += venta.importe;
    });
    return totalVentas;
};

const getDataBetweenDates = async (req, res = response) => {
    try {
        // Obtén las fechas desde y hasta de la solicitud
        const { desde, hasta } = req.query;

        // Parsea las fechas a objetos Date
        const fechaDesde = new Date(desde);
        const fechaHasta = new Date(hasta);

        // Agrega la hora de inicio y fin del día a las fechas
        fechaDesde.setHours(0, 0, 0, 0);
        fechaHasta.setHours(23, 59, 59, 999);

        const sort = { updatedAt: -1 };

        // Obtén las ventas dentro del rango de fechas
        const ventas = await Pago.find({ createdAt: { $gte: fechaDesde, $lte: fechaHasta } }).populate('estudiante', 'nombres apellidos').sort(sort);

        // Calcula el total de ventas
        let totalVentas = 0;
        ventas.forEach((venta) => {
            totalVentas += venta.importe;
        });

        res.json({
            ok: true,
            totalVentas,
            items: ventas,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al generar el informe diario'
        });
    }
};


const getDataforGraph = async (req, res = response) => {
    try {
        // Obtener los datos de ventas desde la base de datos
        const ventas = await Pago.find(); // función que obtiene los datos de ventas

        // Obtener el año y mes actual
        const fechaActual = new Date();
        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth();

        // Calcular el total de ventas por mes
        const ventasPorMes = {};

        // Inicializar los totales de ventas en 0 para cada mes
        const meses = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        meses.forEach((mes) => {
            ventasPorMes[mes] = 0;
        });

        // Calcular el total de ventas para cada mes
        ventas.forEach((venta) => {
            const ventaAnio = new Date(venta.createdAt).getFullYear();
            const ventaMes = new Date(venta.createdAt).getMonth();
            if (ventaAnio === anioActual) {
                ventasPorMes[meses[ventaMes]] += venta.importe;
            }
        });

        // Crear el array de objetos en el formato deseado
        const data = meses.map((mes) => ({
            mes,
            total: ventasPorMes[mes],
        }));

        return data;

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al generar el informe diario',
        });
    }
};


module.exports = {
    generarInformeDiario,
    getDataBetweenDates,
    getDataforGraph,
    getAllReporte,
}