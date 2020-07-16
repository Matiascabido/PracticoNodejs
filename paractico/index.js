const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const API_PORT = process.env.API_PORT ||  3002
const API_HOST = process.env.API_PORT ||  '127.0.0.0'
const Restaurant = require('./class/restaurant')
const cache = require('memory-cache');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(log)
app.use(headers)


function log (req, res, next) {
    const { method, path, query } = req
    console.log(`${method} - ${path} - ${query.params}`)
    next()
}

function headers (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    res.setHeader('Access-Control-Allow-Credentials', true)

    next()
}




/// middleware functions
const SaveData = (req, res ,next ) => {

  if (Object.keys(req.body).length > 0 && Object.keys(req.body).length === 3) {
    
    let data = req.body

    if(data.hasOwnProperty("name") && data.hasOwnProperty("kindOfRestaurant") && data.hasOwnProperty("specials") ){

        let restaurant = new Restaurant(data.name, data.kindOfRestaurant, data.specials)

        restaurant.saveRestaurant()  ?  next() :  res.sendStatus(400)

    }else  res.sendStatus(400)

  }else res.sendStatus(400)



}

const GetData = (req, res, next) => {

  let restaurants = cache.keys()
  let resta = []


  restaurants.forEach(item => {
    resta.push(cache.get(item))
  })

  if(req.query.hasOwnProperty('kindOfRestaurant') && req.query.kindOfRestaurant){
    resta = resta.filter(item => item.kindOfRestaurant === req.query.kindOfRestaurant)
  }
   
  res.locals.resta = resta
  next()
}



app.get('/restaurant', GetData, function(req, res){
  res.status(201).json(res.locals.resta)
});


app.post('/restaurant',SaveData, function(req, res){
  res.sendStatus(201)
});



app.listen(API_PORT, async function () {
  console.log(`Running on http://${API_HOST}:${API_PORT}`)
  cache.clear()
}); 