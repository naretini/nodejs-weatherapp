var assert = require('assert');

const app_utils_1 = require("../app_utils");

describe('App_utils', function () {
    describe('#validCoordinates()', function () {
        it('should return false when a value is not present or not a number', function () {
            assert.equal(app_utils_1.validCoordinates(null, 3.45), false);
            assert.equal(app_utils_1.validCoordinates(-3.34, null), false);
            assert.equal(app_utils_1.validCoordinates(0, ''), false);
            assert.equal(app_utils_1.validCoordinates('3', undefined), false);
            assert.equal(app_utils_1.validCoordinates('3.3242', 'false'), false);
            assert.equal(app_utils_1.validCoordinates('true', 'true'), false);
        });
        it('should return true when a value is 0', function () {
            assert.equal(app_utils_1.validCoordinates('3.3', '0'), true);
            assert.equal(app_utils_1.validCoordinates('3', '0'), true);
        });
        it('should return true when a value is negative', function () {
            assert.equal(app_utils_1.validCoordinates('3', '-3.02'), true);
            assert.equal(app_utils_1.validCoordinates('-3.243', '0.0'), true);
        });
        it('should return true when coordinates are ok', function () {
            assert.equal(app_utils_1.validCoordinates('234.3', '-3.02'), true);
            assert.equal(app_utils_1.validCoordinates(-3.243, 4.3450), true);
        });
    });

    describe('#getCityById()', function () {
        it('should return a city', function () {
            assert.equal(JSON.stringify(app_utils_1.getCityById(707860)),
                JSON.stringify({
                    "id": 707860,
                    "name": "Hurzuf",
                    "lon": 34.283333,
                    "lat": 44.549999
                }));

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
});