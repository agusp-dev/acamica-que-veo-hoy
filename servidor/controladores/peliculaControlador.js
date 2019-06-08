var conexionBd = require('../lib/conexionbd');

function obtenerPeliculas(req, res) {
    var query = 'SELECT * FROM pelicula';
    conexionBd.query(query, function(error, result, fields) {
        procesarResultado(res, error, result);
    });
}

function procesarResultado(res, error, result) {
    if (error) {
        res.status(404).send('Error obteniendo peliculas');
        return;
    }
    var response = {'peliculas': result};
    res.status(200).send(JSON.stringify(response));
}

module.exports = {
    obtenerPeliculas: obtenerPeliculas
};