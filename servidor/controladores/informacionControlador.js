var conexionBd = require('../lib/conexionbd');

function obtenerInformacionPelicula(req, res) {

    var id = req.params.id;
    var query = obtenerQueryInfoPeliculas(id);
    conexionBd.query(query, function(error, resultInfoPelicula, fields) {
        procesarResultadoPeliculaInfo(id, res, error, resultInfoPelicula);
    });
}

function procesarResultadoPeliculaInfo(id, res, error, resultInfoPelicula) {
    //Se verifica que no haya habido errores.
    if (error) {
        console.log(error);
        res.status(404).send('Error obteniendo información de la pelicula');
        return;
    }

    if (resultInfoPelicula.length != 1) {
        res.status(404).send('Error obteniendo información de la pelicula');
        return;
    }

    obtenerActores(obtenerQueryActores(id), res, resultInfoPelicula[0]);
}

function obtenerActores(query, res, infoPelicula) {
    conexionBd.query(query, function(error, resultActores, fields) {
        procesarResultadoActores(res, error, infoPelicula, resultActores);
    });
}

function procesarResultadoActores(res, error, infoPelicula, resultActores) {
    //Se verifica que no haya habido errores.
    if (error) {
        console.log(error);
        res.status(404).send('Error obteniendo actores de la pelicula');
        return;
    }

    var response = {
        'pelicula': infoPelicula,
        'actores': resultActores
    };
    res.status(200).send(JSON.stringify(response));
}

//Crea query de info de pelicula, con filtro de id
var obtenerQueryInfoPeliculas = function(id) {
    return 'SELECT p.poster, p.titulo, p.anio, p.trama, p.fecha_lanzamiento, g.nombre, p.director, p.duracion, p.puntuacion' +
            ' FROM pelicula AS p INNER JOIN genero AS g ON p.genero_id = g.id' + 
            ' WHERE p.id = ' + id;
}

//Crea query de actores de pelicula, con filtro de id
var obtenerQueryActores = function(id) {
    return 'SELECT nombre' +
            ' FROM actor INNER JOIN actor_pelicula ON actor.id = actor_id' + 
            ' WHERE pelicula_id = ' + id;
}

module.exports = {
    obtenerInformacionPelicula: obtenerInformacionPelicula
};