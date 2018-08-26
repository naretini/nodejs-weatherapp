/**
 * Cities Json data
 */
var citiesDb = require('./data/city.list.json');
var GeoPoint = require('geopoint');

/**
 * Returns boolean: true if lat lng aren't null and valid
 * @param latitude 
 * @param longitude 
 */
exports.validCoordinates = (latitude, longitude)  => {

    let lat = latitude;
    let lng = longitude;
    
    if (
        (lat!=0 && !lat )|| 
        (lng!=0 && !lng) ||
        (isNaN(lat) || isNaN(lng))
    ){
        return false;
    }

    let MAX_LAT = Math.PI / 2; // 90 degrees
    let MIN_LAT = -MAX_LAT; // -90 degrees
    let MAX_LON = Math.PI; // 180 degrees
    let MIN_LON = -MAX_LON; // -180 degrees
    let radLat = GeoPoint.degreesToRadians(parseFloat(lat));
    let radLng = GeoPoint.degreesToRadians(parseFloat(lng));
    // console.log('Lat lng radlat radlng: ', lat, radLat, lng, radLng);
    if (radLat < MIN_LAT || radLat > MAX_LAT || radLng < MIN_LON || radLng > MAX_LON) {
        console.log('Lat or Lng out of bounds', lat,radLat, lng, radLng);
        return false;
    }
    return  true;

}

/**
 * 
 * Return -1|Distance in km 
 * 
 * @param {Number} lat_frm 
 * @param {Number} lng_frm 
 * @param {Number} lat_to 
 * @param {Number} lng_to 
 * @param {Number} inKm 
 */
exports.getDistance = (lat_frm, lng_frm, lat_to, lng_to, inKm = true) => {
    try {
        pointA = new GeoPoint(parseFloat(lat_frm), parseFloat(lng_frm));
        pointB = new GeoPoint(parseFloat(lat_to), parseFloat(lng_to));
        let distance = pointA.distanceTo(pointB, inKm);
        return distance;
    }
    catch (err) {
        console.log("----------------------- ERROR ON", err)
        console.log("lat_frm:", lat_frm, "lng_frm:", lng_frm, "lat_to:", lat_to, "lng_to:", lng_to, "inKm:", inKm )
        return -1; 
    }
    
}

/**
 * 
 * Return Array[cityObj]
 * 
 * @param {Number} lat_frm 
 * @param {Number} lng_frm 
 */
exports.getCitiesWithin10KmDistance = (lat_frm, lng_frm) => {
    var arrayFound = citiesDb.filter(function (item) {
        
        let distance = module.exports.getDistance(lat_frm,lng_frm,item.coord.lat, item.coord.lon);

        if (distance>=0 && distance<10){
            // console.log(item.name, item.country, item.coord.lat, item.coord.lon)
            return true;
        }
        return false;
    }).map(function (obj) {
        var rObj = {};
        rObj['id'] = obj.id;
        rObj['name'] = obj.name;
        return rObj;
    });
    
    return arrayFound;
}

/**
 * Return Integer °C
 * 
 * @param {Number} kelvin 
 */
exports.convertKelvinToCelsius = (kelvin) => {
    if (kelvin < (0)) {
        return 0;
    } else {
        return Math.round(kelvin - 273.15);
    }
}

/**
 * Mapping API response to
 * expected obj
 * {
 *  "type": "Clear",
 *  "type_description": "clear sky",
 *  "sunrise": "2016-08-23T08:00:00.000Z",
 *  "sunset": "2016-08-23T22:00:00.000Z",
 *  "temp": 29.72,
 *  "temp_min": 26.67,
 *  "temp_max": 35,
 *  "pressure": 1026,
 *  "humidity": 36,
 *  "clouds_percent": 0,
 *  "wind_speed": 1.5
 * }
 * 
 * Returns the expected object
 * 
 * @param {JSON} jsonRes
 */
exports.parseAPIWeatherResponse = (jsonRes) => {
    var answer = {}
    if(jsonRes){
        if (jsonRes.weather && jsonRes.weather[0]) {
            answer.type             = jsonRes.weather[0].main;
            answer.type_description = jsonRes.weather[0].description;
        }

        if (jsonRes.sys){
            answer.sunrise          = new Date(jsonRes.sys.sunrise * 1000).toISOString();
            answer.sunset           = new Date(jsonRes.sys.sunset * 1000).toISOString();
        }

        if(jsonRes.main){
            answer.temp             = module.exports.convertKelvinToCelsius(jsonRes.main.temp);
            answer.temp_min         = module.exports.convertKelvinToCelsius(jsonRes.main.temp_min);
            answer.temp_max         = module.exports.convertKelvinToCelsius(jsonRes.main.temp_max);
            answer.pressure         = jsonRes.main.pressure;
            answer.humidity         = jsonRes.main.humidity;

        }
        if (jsonRes.main) {
            answer.clouds_percent   = jsonRes.clouds.all;  
        }
        
        if (jsonRes.main) {
            answer.wind_speed       = jsonRes.wind.speed;
        }
    }


    return answer;
}


/**
 * Return null|city object 
 * 
 * @param {number} idCity 
 */
exports.getCityById = (idCity) => {
    if(isNaN(idCity)){
        return null;
    }

    var arrayFound = citiesDb.filter(function (item) {
        return item.id == idCity;
    });

    var response = null;

    if (arrayFound[0]){
        response      = {}
        response.id   = arrayFound[0].id;
        response.name = arrayFound[0].name;
        response.lon  = arrayFound[0].coord.lon;
        response.lat  = arrayFound[0].coord.lat;
    }
    return response;
}

/**
 * Returns null|object API response
 * @param {number} idCity 
 */
exports.getWeatherByCityId = (cityId) => {
    var APPID       = 'dce868f2d5d78510621eeae7bbcf971e';
    var endpoint    = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + APPID + '&id=' + cityId;
    
    request(endpoint, function (error, response, body) {
        if (response && response.statusCode == 200) {
            return JSON.parse(response.body);
        } else {
            return false;
        }
    });
}

