var restify = require('restify');


var server = restify.createServer();
server.use(restify.plugins.queryParser());



function cities_findbyLoc(req, res, next) {
    res.send(200, {
        message: 'Valid '
    });
    
}



server.get('/cities', cities_findbyLoc);
// server.get('/cities/{city_id}', city_get);


server.listen(8080, function () {
    console.log("Server listening ...");
});