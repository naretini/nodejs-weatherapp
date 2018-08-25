var restify = require('restify');
var  geo_utils = require('./app_utils');

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



server.get('/cities', cities_findbyLoc);
// server.get('/cities/{city_id}', city_get);


server.listen(8080, function () {
    console.log("Server listening ...");
});