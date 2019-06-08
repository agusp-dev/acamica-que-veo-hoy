var conexionBd = require('../lib/conexionbd');

function obtenerGeneros(req, res) {
    var query = 'SELECT * FROM genero';
    conexionBd.query(query, function(error, result, fields) {
        procesarResultado(res, error, result);
    });
}

function procesarResultado(res, error, result) {
    if (error) {
        res.status(404).send('Error obteniendo generos');
        return;
    }
    var response = {'generos': result};
    res.status(200).send(JSON.stringify(response));
}

module.exports = {
    obtenerGeneros: obtenerGeneros
};