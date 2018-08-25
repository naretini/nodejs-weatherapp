var restify = require('restify');
var geo_utils = require('./app_utils');
var request = require('request');





var server = restify.createServer();
server.use(restify.plugins.queryParser());



function cities_findbyLoc(req, res, next) {
    //200 ok
    let lat = req.query.lat || null;
    let lng = req.query.lng || null;
    if (geo_utils.validCoordinates(lat, lng)) {
        res.send(200, {
            message: 'Valid coordinates',
            lat: lat,
            lng: lng
        });
        next();
    } else {
        //400 parameters wrong or missing
        res.send(400, {
            "code": "BadRequestError",
            "message": "lat/lng required"
        });
        next();
    }
}

function responseNotFound(res){
    res.send(404, {
        "code": "NotFoundError",
        "message": "not found"
    });
}



server.get('/cities', cities_findbyLoc);


/** 
 * Retrieve the details for a city (by city_id) Example: http://localhost:8080/cities/2873891
 */
server.get('/cities/:city_id', function (req, res, next) {
    var city = geo_utils.getCityById(req.params.city_id);
    if (city) {
        res.send(200, city);
    } else {
        responseNotFound(res);
    }
    next();
});

/**
 * Retrieve the weather data for a city (by city_id) Example: http://localhost:8080/cities/2873891/weather
 */
server.get('/cities/:city_id/weather', function (req, res, next) {
    var city = geo_utils.getCityById(req.params.city_id);
    console.log(city)
    if (city && city.id) {
        var APPID = 'dce868f2d5d78510621eeae7bbcf971e';
        var endpoint = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + APPID + '&id=' + city.id;
        request(endpoint, function (error, response, body) {
            if (response && response.statusCode == 200) {
                console.log('si', response.body);
                res.send(200, geo_utils.parseAPIWeatherResponse(JSON.parse(response.body)));
            } else {
                console.log('no');
                responseNotFound(res);
            }
        });
    } else {
        responseNotFound(res);
    }
    next();
});


/**
 * just for testing randomly
 */
server.get('/cities/weather', function (req, res, next) {
        var citiesDb = require('./data/city.list.json');
        var city = citiesDb[Math.floor(Math.random() * citiesDb.length)];
console.log(city.id, city.name, city.country);
        var APPID = 'dce868f2d5d78510621eeae7bbcf971e';
        var endpoint = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + APPID + '&id=' + city.id;
        request(endpoint, function (error, response, body) {
            if (response && response.statusCode == 200) {
                console.log('si', response.body);
                res.send(200, geo_utils.parseAPIWeatherResponse(JSON.parse(response.body)));
            } else {
                console.log('no');
                responseNotFound(res);
            }
        });


    
    next();
});


server.listen(8080, function () {
    console.log("Server listening ...");
});