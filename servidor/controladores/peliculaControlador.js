var conexionBd = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
    var query = 'SELECT * FROM pelicula';

    var params = [];

    if (req.query.genero) {
        query += agregarJoinGenero(query);
        params.push('genero.id=' + req.query.genero);
    }

    if (req.query.anio) {
        params.push('anio=' + req.query.anio);
    }

    //ojo con esto.. deberia ser like...
    if (req.query.titulo) {
        params.push('titulo= "' + req.query.titulo + '"');
    }

    //Verificamos si hay parametros para agregar a la query
    if (params.length > 0) {
        query = agregarClausulasQuery(query, params);
    }

    console.log(params);
    console.log(query);

    conexionBd.query(query, function(error, result, fields) {
        procesarResultado(res, error, result);
    });
}

/**
 * Agrega join de tabla genero. 
 */
function agregarJoinGenero(shortQuery) {
    return ' INNER JOIN genero ON genero_id = genero.id';
}

/**
 * Devuelve query con clausulas del where.
 */
function agregarClausulasQuery(shortQuery, params) {
    var finalQuery = shortQuery.concat(' WHERE ');
    params.forEach(e => {
        if (params.indexOf(e) != 0) {
            finalQuery += ' AND ';
        }
        //finalQuery += obtenerFormattedClause(e);
        finalQuery += e;
    });
    return finalQuery;
}

/**
 * Obtiene clausula formateada. 
 * P.E: titulo='Premonition' 
 */
/*
function obtenerFormattedClause(clause) {
    var value = clause.substring(clause.indexOf('=') + 1, clause.length);
    return clause.replace(value, '"' + value + '"');
}
*/







function procesarResultado(res, error, result) {
    if (error) {
        console.log(error);
        res.status(404).send('Error obteniendo peliculas');
        return;
    }
    var response = {'peliculas': result};
    console.log(response);
    res.status(200).send(JSON.stringify(response));
}

module.exports = {
    obtenerPeliculas: obtenerPeliculas
};