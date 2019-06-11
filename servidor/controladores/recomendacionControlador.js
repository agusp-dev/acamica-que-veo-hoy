var conexionBd = require('../lib/conexionbd');

function obtenerRecomendacion(req, res) {

    var query = 'SELECT * FROM pelicula ';

    var queryParams = [];
    if (req.query.genero) {
        query += agregarJoinGenero();
        queryParams.push('nombre = "' + req.query.genero + '"');
    }

    if (req.query.anio_inicio) {
        queryParams.push('anio >= ' + req.query.anio_inicio);
    }

    if (req.query.anio_fin) {
        queryParams.push('anio <= ' + req.query.anio_fin);
    }

    if (req.query.puntuacion) {
        queryParams.push('puntuacion >= ' + req.query.puntuacion);
    }

    //Verificamos si hay parametros para agregar a la query
    if (queryParams.length > 0) {
        query += agregarClausulasQuery(queryParams);
    }

    console.log(queryParams);
    console.log(query);

    conexionBd.query(query, function(error, resultPeliculas, fields) {
        procesarResultadoPeliculas(res, error, resultPeliculas);
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

function procesarResultadoPeliculas(res, error, resultPeliculas) {
    //Se verifica que no haya habido errores.
    if (error) {
        console.log(error);
        res.status(404).send('Error obteniendo peliculas recomendadas');
        return;
    }

    var response = {
        'peliculas': resultPeliculas
    };
    console.log(response);
    res.status(200).send(JSON.stringify(response));
}

module.exports = {
    obtenerRecomendacion: obtenerRecomendacion
};