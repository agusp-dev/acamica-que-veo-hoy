//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var peliculasControlador = require('./controladores/peliculaControlador');
var generosControlador = require('./controladores/generoControlador');
var informacionControlador = require('./controladores/informacionControlador');
var recomendacionesControlador = require('./controladores/recomendacionesControlador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

app.get('/peliculas', peliculasControlador.obtenerPeliculas);
app.get('/peliculas/:id', informacionControlador.obtenerInformacionPelicula);
app.get('/recomendaciones', recomendacionesControlador.obtenerRecomendacion);
app.get('/generos', generosControlador.obtenerGeneros);