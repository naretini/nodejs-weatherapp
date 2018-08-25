

var citiesDb = require('./data/city.list.json');
var GeoPoint = require('geopoint');

/**
 * 
 * @param latitude 
 * @param longitude 
 */
exports.validCoordinates = (latitude, longitude)  => {

    let lat = latitude;
    let lng = longitude;

    if (
        !lat || !lng
        ||
        (isNaN(lat) || isNaN(lng))
        
    ){
        return false;
    }
    return  true;
    

}

exports.getDistance = (lat_frm, lng_frm, lat_to, lng_to, inKm = true) => {
    
    try {
        pointA = new GeoPoint(parseFloat(lat_frm), parseFloat(lng_frm));
        pointB = new GeoPoint(parseFloat(lat_to), parseFloat(lng_to));
        let distance = pointA.distanceTo(pointB, inKm);
        return distance;
    }
    catch (err) {
        console.log(typeof lat_to)
        console.log("----------------------- ERROR ON", err)
        console.log("lat_frm:", lat_frm, "lng_frm:", lng_frm, "lat_to:", lat_to, "lng_to:", lng_to, "inKm:", inKm )
        return -1; 
    }
    
}


exports.getCitiesWithin10KmDistance = (lat_frm, lng_frm) => {
    console.log(lat_frm, lng_frm);
    var arrayFound = citiesDb.filter(function (item) {
        // console.log(item.coord);
        // console.log('LAT', item.coord.lat, 'LONG', item.coord.lon);
        let distance = module.exports.getDistance(lat_frm,lng_frm,item.coord.lat, item.coord.lon);
        
        if (distance>=0 && distance<10){
            console.log(item.name, item.country, item.coord.lat, item.coord.lon)
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
 * expected
 {
  "type": "Clear",
  "type_description": "clear sky",
  "sunrise": "2016-08-23T08:00:00.000Z",
  "sunset": "2016-08-23T22:00:00.000Z",
  "temp": 29.72,
  "temp_min": 26.67,
  "temp_max": 35,
  "pressure": 1026,
  "humidity": 36,
  "clouds_percent": 0,
  "wind_speed": 1.5
}
 */
exports.parseAPIWeatherResponse = (jsonRes) => {
    var answer = {}
    answer.type             = jsonRes.weather[0].main;
    answer.type_description = jsonRes.weather[0].description;
    answer.sunrise          = new Date(jsonRes.sys.sunrise * 1000).toISOString();
    answer.sunset           = new Date(jsonRes.sys.sunset * 1000).toISOString();
    answer.temp             = jsonRes.main.temp;
    answer.temp_min         = jsonRes.main.temp_min;
    answer.temp_max         = jsonRes.main.temp_max;
    answer.pressure         = jsonRes.main.pressure;
    answer.humidity         = jsonRes.main.humidity;
    answer.clouds_percent   = jsonRes.clouds.all;  
    answer.wind_speed       = jsonRes.wind.speed;


    return answer;
}




/**
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


exports.getWeatherByCityId = (cityId) => {
    var APPID       = 'dce868f2d5d78510621eeae7bbcf971e';
    var endpoint    = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + APPID + '&id=' + cityId;
    

    request(endpoint, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.

        if (response && response.statusCode == 200) {
            
            console.log('si', response.body);
            return JSON.parse(response.body);
        } else {
            console.log('no');
            return false;
        }
    });
}

