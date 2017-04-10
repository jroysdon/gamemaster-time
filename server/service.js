'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

const GEO_API_KEY = 'AIzaSyBzyiJTWOsHksld0aKCQ12tS2FfYpq_QBs';
const TIMEZONE_API_KEY = 'AIzaSyCPs46IKz8p_3-QpKPcVzWxReZU7Xxsmuk';

service.get('/service/:location', (req, res, next) => {
    var wtf = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key='+GEO_API_KEY;
    console.log(wtf)

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key='+GEO_API_KEY, (err, response) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + TIMEZONE_API_KEY, (err, response) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = response.body;

            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: timeString});
        });
    });

});

module.exports = service;
