

var citiesDb = require('./data/city.list.json');

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

