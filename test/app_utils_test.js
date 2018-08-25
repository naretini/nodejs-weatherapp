var assert = require('assert');

const app_utils_1 = require("../app_utils");

describe('App_utils', function () {
    describe('#validCoordinates()', function () {
        it('should return false when a value is not present or not a number', function () {
            assert.equal(app_utils_1.validCoordinates(null, 3.45), false);
            assert.equal(app_utils_1.validCoordinates(-3.34, null), false);
            // assert.equal(app_utils_1.validCoordinates(0, ''), false);
            assert.equal(app_utils_1.validCoordinates('3', undefined), false);
            assert.equal(app_utils_1.validCoordinates('3.3242', 'false'), false);
            assert.equal(app_utils_1.validCoordinates('true', 'true'), false);
        });
        it('should return true when a value is 0', function () {
            assert.equal(app_utils_1.validCoordinates(27.3, 0), true);
            assert.equal(app_utils_1.validCoordinates('34', '0'), true);
        });
        it('should return true when a value is negative', function () {
            assert.equal(app_utils_1.validCoordinates('34', '-35.02'), true);
            assert.equal(app_utils_1.validCoordinates('-32.43', '0.0'), true);
        });
        it('should return true when coordinates are ok', function () {
            assert.equal(app_utils_1.validCoordinates('34.3', '-3.02'), true);
            assert.equal(app_utils_1.validCoordinates(-34.243, 44.3450), true);
        });

        it('should return false when coordinates are out of bounds', function () {


            assert.equal(app_utils_1.validCoordinates('343.3', '-3.02'), false);
            assert.equal(app_utils_1.validCoordinates(-3.243, 444.3450), false);
        });
    });

   
    describe('#getCityById()', function () {
        it('should return a city', function () {
            assert.equal(
                JSON.stringify(JSON.parse(JSON.stringify(app_utils_1.getCityById(707860)))),
                JSON.stringify(JSON.parse(JSON.stringify({
                    "id": 707860,
                    "name": "Hurzuf",
                    "lon": 34.283333,
                    "lat": 44.549999
                }))));

        });

        it('should return a null on non existend id', function () {
            assert.equal(JSON.stringify(app_utils_1.getCityById(725453407860)),
                JSON.stringify(null));
        });

        it('should return a null on NaN', function () {
            assert.equal(JSON.stringify(app_utils_1.getCityById('23d323d')),
                JSON.stringify(null));
            assert.equal(JSON.stringify(app_utils_1.getCityById('234')),
                JSON.stringify(null));
            assert.equal(JSON.stringify(app_utils_1.getCityById(false)),
                JSON.stringify(null));
            assert.equal(JSON.stringify(app_utils_1.getCityById(undefined)),
                JSON.stringify(null));

        });
    });



    describe('#parseAPIWeatherResponse()', function () {
        it('should parse JSON correctly', function () {
            var input = { "coord": { "lon": -82.41, "lat": 27.07 }, "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }], "base": "stations", "main": { "temp": 297.55, "pressure": 1018, "humidity": 88, "temp_min": 297.05, "temp_max": 298.15 }, "visibility": 16093, "wind": { "speed": 4.1, "deg": 80 }, "clouds": { "all": 1 }, "dt": 1535199300, "sys": { "type": 1, "id": 731, "message": 0.0128, "country": "US", "sunrise": 1535195162, "sunset": 1535241398 }, "id": 4176387, "name": "Venice Gardens", "cod": 200 };
            var expected_output = { "type": "Clear", "type_description": "clear sky", "sunrise": "2018-08-25T11:06:02.000Z", "sunset": "2018-08-25T23:56:38.000Z", "temp": 24, "temp_min": 24, "temp_max": 25, "pressure": 1018, "humidity": 88, "clouds_percent": 1, "wind_speed": 4.1 };

          

            assert.equal(
                JSON.stringify(JSON.parse(JSON.stringify(app_utils_1.parseAPIWeatherResponse(input)))),
                JSON.stringify(JSON.parse(JSON.stringify(expected_output))));

        });
    });
    describe('#getDistance()', function () {
        it('should get expected distance', function () {
            /*
            Liberty Island
            Stati Uniti
            40.689404, -74.044243
            Unnamed Road
            Jersey City, NJ 07305, Stati Uniti
            40.699166, -74.067323
            */
             
            assert.equal(
                app_utils_1.getDistance(40.689404, -74.044243, 40.699166, -74.067323), 2.228123698784625
            );
        });
    });

    describe('#getCitiesWithin10KmDistance()', function () {
        it('should get a list long as expected', function () {
            /*
            Liberty Island
            Stati Uniti
            40.689404, -74.044243
            */
            var list = app_utils_1.getCitiesWithin10KmDistance(40.689404, -74.044243);
            console.log(list);

            assert.equal(
                list.length, 9
            );
        });


        it('should get a list long as expected', function () {
            /*
            Venezia
            30173 VE
            45.472912, 12.274660
            */
            var list = app_utils_1.getCitiesWithin10KmDistance(45.472912, 12.274660);
            console.log(list);

            assert.equal(
                list.length, 11
            );
        });
        it('should work with float numbers as strings (by url)', function () {
            
            var list = app_utils_1.getCitiesWithin10KmDistance('44.549999', '34.283333');
            console.log(list);

            assert.equal(
                list.length, 15
            );
        });
    });
});