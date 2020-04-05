'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.get('/', (request,response)=>{
    response.status(200).send('Home page');
})
app.get('/location',(request,response)=>{
  try {
    const geoData = require('./data/geo.json');
    let city = request.query.city;
    const locationData = new Location(city,geoData);
    response.status(200).json(locationData);
  } catch (error){
    errorHandler(error,request,response);
  }
})
app.get('/weather',(request,response)=>{
  try{
    let weatherData = require('./data/darksky.json');
    let dataInside = weatherData.data;
    let weatherArray = [];
    let city = request.query.city;
    dataInside.forEach(value =>{
        let newWeather = new Weather(value);
        let newTime = new Date(newWeather.time).toString().split(' ');
        let createTime = `${newTime[0]} ${newTime[1]} ${newTime[2]} ${newTime[3]}`;
        newWeather.time = createTime;
        weatherArray.push(newWeather);
    })
    console.log(weatherArray)
    response.status(200).json(weatherArray);
  } catch (error){
    errorHandler(error,request,response);   
  }
})




app.get('*', notFoundHandler);
// HELPER FUNCTIONS
function notFoundHandler(request,response){
    response.status(404).send('Error 404: URL Not found.')
}
function errorHandler (error,request,response){
    response.status(500).send(error);
}
function Location(city,geoData){
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}
function Weather(data){
    this.forecast = data.weather.description;
    this.time = data.datetime;
}


app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));