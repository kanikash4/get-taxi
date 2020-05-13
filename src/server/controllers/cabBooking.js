'use strict';
const cabs = require('../data/cab');

async function getCabs(req, res, next) {
	if (req.query.latitude && req.query.longitude && !isNaN(req.query.latitude) && !isNaN(req.query.longitude)) {
    var latitude = parseInt(req.query.latitude);
    var longitude = parseInt(req.query.longitude);
    var userLocation = {
      latitude: latitude,
      longitude: longitude
    };
    var color = req.query.color || null;
    var cab = getClosestCab(userLocation, color);
    if (cab) {
      cab.isBooked = true;
      res.json({
        message     : "Cab booked!",
        taxiNo       : cab.id,
        cabNumber   : cab.number,
        driverName  : cab.driverName,
        driverNumber: cab.driverNumber,
        cabColor    : cab.color,
        location    : cab.location,
        errMessage  : ""
      });
    } else {
       res.json({
        message: "",
        errMessage: "No cabs available at the moment, Kindly try again after few minutes!"
       });
    }
  } else {
    res.json({
        message: "",
        errMessage: "Invalid/Missing parameters"
    });
  }
}

async function completeRide(req, res, next) {
	 if (req.query.taxiNo && !isNaN(req.query.taxiNo) && req.query.latitude && req.query.longitude && !isNaN(req.query.latitude) && !isNaN(req.query.longitude)) {
    var cabID = parseInt(req.query.taxiNo);
    var latitude = parseInt(req.query.latitude);
    var longitude = parseInt(req.query.longitude);
    //dest location
    var location = {
      latitude: latitude,
      longitude: longitude
    };
    var userCab = null;
    cabs.forEach(function(cab) {
      if (cabID === Number(cab.id)) {
        userCab = cab;
      }
    });

    if (userCab) {
      if (userCab.isBooked) {

        userCab.isBooked = false;
        var distance = getDistance(userCab.location, location);
        var price = await calculatePrice(distance, userCab.color);
        userCab.location = location;
        res.json({
          message   : "Ride completed!",
          distance  : distance,
          price     : price,
          errMessage: ""
        })
      } else {
        res.json({
          message: "",
          errMessage: "Can not complete a ride for the cab which is not booked!"
        });
      }
    } else {
      res.json({
        message: "",
        errMessage: "Could not find cab with id: " + cabID
      });
    }
  } else {
    res.json({
      message: "",
      errMessage: "Invalid/Missing parameters"
    });
  }
}

function getClosestCab (location, color) {
  var closestCab = null;
  var closestDistance = Infinity;
  cabs.forEach(function(cab) {
    if (!cab.isBooked) {
      if (color) {
        if (color.toUpperCase() === cab.color) {
          var distance = getDistance(cab.location, location);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestCab = cab;
          }
        }
      } else {
        var distance = getDistance(cab.location, location);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCab = cab;
        }
      }
    }
  });
  return closestCab;
}

function getDistance(source, destination) { 
  var a = source.latitude - destination.latitude;
  var b = source.longitude - destination.longitude;
  var c = Math.sqrt(a * a + b * b);
  return c.toFixed(2);
}

function calculatePrice(distance, cabColor) {
  //The price is $1 per minute, and $2 per kilometer. Pink cars cost an additional $5
  //Assume every distance is completed in 20 units e.g. (60/3) mins
  var mins = Math.round(distance/20);
  var amt =1;
  var price = 0;
  if(cabColor ==="PINK"){
    amt=6;
    price = mins * amt;
  } else {
    price = mins*amt
  }
  return Number(price);
}

module.exports ={
	getCabs: getCabs,
	completeRide: completeRide
};