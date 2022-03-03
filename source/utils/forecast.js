const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=a22ca4a83ce424330a09815106198e63&query=${latitude},${longitude}&units=m`;
  request({ url, json: true }, (error, {body}) => {
    if (error) {
      callback("Unable to connect to weather services!");
    } else if (body.error) {
      callback("The entered location is invalid.");
    } else {
      data = body.current;
      callback(
        undefined,
        `${data.weather_descriptions[0]}. It is currently ${data.temperature}° out there and humidity is ${data.humidity}%. It feels like ${data.feelslike}° around here`
      );
    }
  });
};
module.exports = forecast;
