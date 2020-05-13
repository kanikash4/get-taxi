'use strict';
const cabs = require('../data/cab');

async function getCabs(req, res, next) {
	if (req.query.lattitude && req.query.longitude && !isNaN(req.query.lattitude) && !isNaN(req.query.longitude)) {
    var lattitude = parseInt(req.query.lattitude);
    var longitude = parseInt(req.query.longitude);
    var userLocation = {
      lattitude: lattitude,
      longitude: longitude
    };
    var color = req.query.color || null;
    var cab = getClosestCab(userLocation, color);
    if (cab) {
      cab.isBooked = true;
      res.json({
        message     : "Cab booked!",
        cabID       : cab.id,
        driverName  : cab.driverName,
        driverNumber: cab.driverNumber,
        location    : cab.location
      });
    } else {
       res.json({
         message: "No cabs available at the moment, Kindly try again after few minutes!"
       });
    }
  } else {
    res.json({
      message: "Invalid/Missing parameters"
    });
  }
}

async function completeRide(req, res, next) {
	 if (req.query.id && !isNaN(req.query.id) && req.query.lattitude && req.query.longitude && !isNaN(req.query.lattitude) && !isNaN(req.query.longitude)) {
    var cabID = parseInt(req.query.id);
    var lattitude = parseInt(req.query.lattitude);
    var longitude = parseInt(req.query.longitude);
    var location = {
      lattitude: lattitude,
      longitude: longitude
    };
    var userCab = null;
    cabs.forEach(function(cab) {
      if (cabID === cab.id) {
        userCab = cab;
      }
    });
    if (userCab) {
      if (userCab.isBooked) {
        userCab.isBooked = false;
        var distance = getDistance(userCab.location, location);
        userCab.location = location;
        res.json({
          message : "Ride completed!",
          distance: distance.toFixed(2)
        })
      } else {
        res.json({
          message: "Can nott complete a ride for the cab which is not booked!"
        });
      }
    } else {
      res.json({
        message: "Could not find cab with id: " + cabID
      });
    }
  } else {
    res.json({
      message: "Invalid/Missing parameters"
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
  var a = source.lattitude - destination.lattitude;
  var b = source.longitude - destination.longitude;
  var c = Math.sqrt(a * a + b * b);
  return c;
}

module.exports ={
	getCabs: getCabs,
	completeRide: completeRide
};