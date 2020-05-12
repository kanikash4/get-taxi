'use strict';
const cabs = require('../data/cab');

async function getCabs(req, res, next) {
  console.log("hi " + req.query.longitude)
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
        message: "Cab booked!",
        cabID: cab.id,
        driverName: cab.driverName,
        driverNumber: cab.driverNumber,
        location: cab.location
      });
    } else {
       res.json({
         message: "No cabs available!"
       });
    }
  } else {
    res.json({
      message: "Invalid/Missing parameters"
    });
  }
}

async function completeRide(req, res, next) {
	return {};
}

function getClosestCab (location, color) {
  var closest = null;
  var closestDistance = Infinity;
  cabs.forEach(function(cab) {
    if (!cab.isBooked) {
      if (color) {
        if (color.toUpperCase() === cab.color) {
          var distance = getDistance(cab.location, location);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = cab;
          }
        }
      } else {
        var distance = getDistance(cab.location, location);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = cab;
        }
      }

    }
  });
  return closest;
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