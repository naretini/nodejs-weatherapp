var config = require('config');
var restify = require('restify');
var request = require('request');
var GeoPoint = require('geopoint');
var myconsole = require('./myConsole');

var geo_utils = require('./app_utils');

var server = restify.createServer();
server.use(restify.plugins.queryParser());

var SERVER_PORT = config.get('app.port');
var WEATHER_SERVICE_APPID = config.get('weather_service.api_key'); 
var WEATHER_SERVICE_URL   = config.get('weather_service.url'); 

/**
 * Common response for 404
 * @param {object} res 
 */
function responseNotFound(res){
    res.send(404, {
        "code": "NotFoundError",
        "message": "not found"
    });
}

/**
 * `GET /cities?lat={latitude}&lng={longitude}`
 * List the available cities around the specified latitude/longitude 
 * within a radius of 10 kilometers 
 * Example: http://localhost:8080/cities?lat=49.48&lng=8.46
 */
server.get('/cities', function (req, res, next) {
    //200 ok
    let lat = req.query.lat || null;
    let lng = req.query.lng || null;
    if (geo_utils.validCoordinates(lat, lng)) {

        res.send(200, geo_utils.getCitiesWithin10KmDistance(lat, lng));
        next();
    } else {
        //400 parameters wrong or missing
        res.send(400, {
            "code": "BadRequestError",
            "message": "lat/lng required"
        });
        next();
    }
});


/** 
 * `GET /cities/{city_id}`
 * Retrieve the details for a city (by city_id) Example: http://localhost:8080/cities/2873891
 */
server.get('/cities/:city_id', function (req, res, next) {
    var city = geo_utils.getCityById(req.params.city_id);
    if (city) {
        res.send(200, {
            "id"    : city.id,
            "name"  : city.name,
            "lng"   : city.lon,
            "lat"   : city.lat
        });
    } else {
        responseNotFound(res);
    }
    next();
});


/**
 * `GET /cities/{city_id}/weather`
 * Retrieve the weather data for a city (by city_id) Example: http://localhost:8080/cities/2873891/weather
 */
server.get('/cities/:city_id/weather', function (req, res, next) {
    var city = geo_utils.getCityById(req.params.city_id);
    if (city && city.id) {
        
        var endpoint = WEATHER_SERVICE_URL + '?APPID=' + WEATHER_SERVICE_APPID + '&id=' + city.id;
        request(endpoint, function (error, response, body) {
            if (response && response.statusCode == 200) {
                res.send(200, geo_utils.parseAPIWeatherResponse(JSON.parse(response.body)));
            } else {
                responseNotFound(res);
            }
        });
    } else {
        responseNotFound(res);
    }
    next();
});


/**
 * GET just for testing randomly
 */
server.get('/cities/weather', function (req, res, next) {
        var citiesDb = require('./data/city.list.json');
        var city = citiesDb[Math.floor(Math.random() * citiesDb.length)];
    
        var endpoint = WEATHER_SERVICE_URL + '?APPID=' + WEATHER_SERVICE_APPID + '&id=' + city.id;
        request(endpoint, function (error, response, body) {
            if (response && response.statusCode == 200) {
                res.send(200, geo_utils.parseAPIWeatherResponse(JSON.parse(response.body)));
            } else {
                responseNotFound(res);
            }
        });
    next();
});


/**
 * root endpoint healthcheck
 */
server.get('/', function (req, res, next) {
    res.send(200, { "code": "OK", 'message': 'weather cities service' });
    next();
});


server.listen(SERVER_PORT, function () {
    myconsole.success("Server listening ...");
});

/** for integration tests with chai */
module.exports = server;