var conexionBd = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
    var query = 'SELECT * FROM pelicula';

    var queryParams = [];

    if (req.query.genero) {
        query += agregarJoinGenero();
        queryParams.push('genero.id=' + req.query.genero);
    }

    if (req.query.anio) {
        queryParams.push('anio=' + req.query.anio);
    }

    if (req.query.titulo) {
        queryParams.push('titulo LIKE "' + req.query.titulo + '%"');
    }

    //Verificamos si hay parametros para agregar a la query
    if (queryParams.length > 0) {
        query += agregarClausulasQuery(queryParams);
    }

    //Verificamos orden
    if (req.query.columna_orden && req.query.tipo_orden) {
        query += agregarOrden(req.query.columna_orden, req.query.tipo_orden);
    }

    console.log(req.query.pagina);
    console.log(req.query.cantidad);

    //Verificamos paginacion
    if (req.query.pagina && req.query.cantidad) {
        query += agregarPaginacion(req.query.pagina, req.query.cantidad);
    }

    console.log(queryParams);
    console.log(query);

    conexionBd.query(query, function(error, resultPeliculas, fields) {
        procesarResultadoPeliculas(query, res, error, resultPeliculas);
    });
}

/**
 * Agrega join de tabla genero. 
 */
function agregarJoinGenero() {
    return ' INNER JOIN genero ON genero_id = genero.id';
}

/**
 * Devuelve query con clausulas del where.
 */
function agregarClausulasQuery(params) {
    var query = ' WHERE ';
    params.forEach(e => {
        if (params.indexOf(e) != 0) {
            query += ' AND ';
        }
        query += e;
    });
    return query;
}

/**
 * Agrega orden por columna y tipo de orden
 */
function agregarOrden(columna, tipo) {
    return ' ORDER BY ' + columna + ' ' + tipo;    
}

/**
 * Agrega paginacion
 */
function agregarPaginacion(pagina, cantidad) {
    return ' LIMIT ' + ((pagina * cantidad) - cantidad) + ',' + cantidad;
}

function procesarResultadoPeliculas(query, res, error, resultPeliculas) {
    //Se verifica que no haya habido errores.
    if (error) {
        console.log(error);
        res.status(404).send('Error obteniendo peliculas');
        return;
    }

    //Se realiza nueva consulta a la bd para saber cantidad de peliculas.
    obtenerCantidadPeliculas(obtenerQueryCantidad(query), res, resultPeliculas);
}

/**
 * Transforma query original para obtener cantidad de peliculas. 
 */
function obtenerQueryCantidad(query) {
    return query.replace('*', 'COUNT(id) AS total').replace(query.substring(query.indexOf('LIMIT')), '');
}

function obtenerCantidadPeliculas(queryCantidad, res, resultPeliculas) {

    console.log(queryCantidad);
    conexionBd.query(queryCantidad, function(error, resultCantidad, fields) {
        procesarResultadoCantidad(res, error, resultPeliculas, resultCantidad);
    });
}

function procesarResultadoCantidad(res, error, resultPeliculas, resultCantidad) {

    //Se verifica que no haya habido errores.
    if (error) {
        console.log(error);
        res.status(404).send('Error obteniendo cantidad de peliculas');
        return;
    }

    var response = {
        'peliculas': resultPeliculas,
        'total': resultCantidad[0].total
    };
    console.log(response);
    res.status(200).send(JSON.stringify(response));
}

module.exports = {
    obtenerPeliculas: obtenerPeliculas
};