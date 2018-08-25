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
});