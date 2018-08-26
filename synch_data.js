var config = require('config');
var myconsole = require('./myConsole');

var source_url = config.get('weather_service.data_file');

var PATH_FILE_TEMP = './data/temp.json';
var PATH_FILE_DATA = './data/city.list.json';

myconsole.warn("[WARN] Attempting to resync cities json file " + source_url);

var request = require('request'),
    zlib = require('zlib'),
    fs = require('fs')
    JSONStream = require('JSONStream');



var stream = request(source_url)
    .pipe(zlib.createGunzip())
    .pipe(JSONStream.parse());


stream.on('data', function (data) {
    if(data.length>0){
        myconsole.info("INFO: Total entries on downloaded file: " + data.length);
        filtered = checkData(data);
        myconsole.info("INFO: Valid entries filtered: " + filtered.length);
        var filePath = PATH_FILE_DATA;

        //decide if substitute with a new file
        if (data.length-filtered.length==0){
            myconsole.info("INFO: will update " + filePath + " with a newest one");
        }else{
            filePath = PATH_FILE_DATA;
            myconsole.warn("WARNING: will create latest temp file " + filePath + " with cities filtered");
        }

        fs.writeFile(filePath, JSON.stringify(filtered), function (err) {
            if (err) {
                return myconsole.err("ERROR: writing file", err);
            }
            myconsole.success("SUCCESS: New file was saved!");
        }); 
    }else{
        myconsole.err("ERROR: No valid entries in source file")
    }
});



function checkData(data){
    var arrayValid = data.filter(function (item) {
        if(
            item.id &&
            (item.name || item.name=='') &&
            (item.country || item.country=='') &&
            item.coord &&
            (item.coord.lon || item.coord.lon ==0) &&
            (item.coord.lat || item.coord.lat ==0)
        ){
            return true;
        }
        myconsole.warn('Invalid item detected', item);
        return false;
    });

    return arrayValid;
}