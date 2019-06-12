var conexionBd = require('../lib/conexionbd');

function obtenerRecomendacion(req, res) {

    var genero = req.query.genero;
    var queryParams = [];

    var query = obtenerQuery(genero);
    
    //siempre se pasa un genero
    if (genero) {
        queryParams.push('g.nombre = "' + req.query.genero + '"')
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

    conexionBd.query(query, function(error, resultPeliculas, fields) {
        procesarResultadoPeliculas(res, error, resultPeliculas);
    });
}

function obtenerQuery(genero) {
    return (genero) ? 'SELECT p.id, p.titulo, p.duracion, p.director, p.anio, p.fecha_lanzamiento,' +
                        ' p.puntuacion, p.poster, p.trama, g.nombre' +
                        ' FROM pelicula as p INNER JOIN genero as g ON genero_id = g.id'

                    : 'SELECT p.id, p.titulo, p.duracion, p.director, p.anio, p.fecha_lanzamiento,' +
                        ' p.puntuacion, p.poster, p.trama' +
                        ' FROM pelicula as p';
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
    res.status(200).send(JSON.stringify(response));
}

module.exports = {
    obtenerRecomendacion: obtenerRecomendacion
};