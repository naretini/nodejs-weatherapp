# Cities-Wheather app nodejs
Given a cities DB, get city info by id , get weather info for a city by id, find cities in a radius of 10km (based on openweathermap.org API)

## Docker

### Build Image
$ docker build -t naretini/node-weather-web-app .

### Run Image
$ docker run -p 49163:8078 -d naretini/node-weather-web-app


### Test service root
$ curl -i localhost:49163

### Run tests
$ npm test




## Modules 
"geopoint": (http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates) (https://github.com/davidwood/node-geopoint)
"request": (https://github.com/request/request)
"restify": (http://restify.com/)

# External API
http://openweathermap.org/ API

## Routes Endpoints
The following routes should be provided by the service. All the routes should deliver the response as json and indicate the response type with the proper content type.

### `GET /cities?lat={latitude}&lng={longitude}`
List the available cities around the specified latitude/longitude within a radius of 10 kilometers Example: http://localhost:8080/cities?lat=49.48&lng=8.46

Returns:

* `HTTP 200 Ok` with body:
```js
[
  {"id":2873891,"name":"Mannheim"}, {"id":6555232,"name":"Altrip"}, ...
]
```

* `HTTP 400 Bad Request` if parameters are missing:
```js
{
  "code":"BadRequestError",
  "message":"lat/lng required"	
}
```

### `GET /cities/{city_id}`
Retrieve the details for a city (by city_id) Example: http://localhost:8080/cities/2873891

Returns:

* `HTTP 200 Ok` with body:
```js
{
  "id":2873891,
  "name":"Mannheim", "lat":49.488331, "lng":8.46472
}
```

* `HTTP 404 Not Found` if the city_id was not found:
```js
{
  "code":"NotFoundError",
  "message":"not found"
}
```

### `GET /cities/{city_id}/weather`
Retrieve the weather data for a city (by city_id) Example: http://localhost:8080/cities/2873891/weather

Returns:

* `HTTP 200 Ok` with body:
```js
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
```

* `HTTP 404 Not Found` if the city_id was not found:
```js
{
  "code":"NotFoundError",
  "message":"not found"
}
```