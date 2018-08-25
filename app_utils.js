

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





exports.getCities = (latitude, longitude) => {
    return citiesDb[0];

}

