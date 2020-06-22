var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_config = require('../db_config/ajoutt_db.js');
var conn = mysql.createConnection(db_config);
// var sql_register3 = 'SELECT * FROM PRODUCT WHERE PriceUsd < 1.1*(SELECT PriceUsd FROM PRODUCT WHERE Vin = ?) AND PriceUsd > 0.9*(SELECT PriceUsd FROM PRODUCT WHERE Vin = ?)';
// var sql_register = 'SELECT * FROM CAR WHERE SerialNo IN (SELECT PriceUsd FROM PRODUCT WHERE Vin = ?)';
var sql_register4 = 'SELECT * FROM CAR AS C WHERE C.SerialNo IN (SELECT PSerialNo FROM PRODUCT WHERE PriceUsd < 1.1*(SELECT PriceUsd FROM PRODUCT WHERE Vin = ?) AND PriceUsd > 0.9*(SELECT PriceUsd FROM PRODUCT WHERE Vin = ?))';
var sql_register2 = 'SELECT * FROM CAR';
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

//추천상품 불러오기(CAR)
router.get('/rcmd/:number', function (req, res, next) {
    try {
        var number = req.params.number;
        console.log(number);
        conn.query(sql_register4, [number, number], function (err, rows, fields) {
            if (!err) {
                console.log("rows : " + rows);
            } else {
                console.log("ERROR : " + err);
            }
            console.log(rows);
            res.json(rows);
        });
    } catch (err) {
        console.log(err);
        return next(err);
    }
});

router.get('/', function (req, res, next) {
    try {
        var number = req.params.number;
        console.log(number);
        conn.query(sql_register2, function (err, rows, fields) {
            if (!err) {
                console.log("rows : " + rows);
            } else {
                console.log("ERROR : " + err);
            }
            console.log(rows);
            res.json(rows);
        });

    } catch (err) {
        console.log(err);
        return next(err);
    }
});
module.exports = router;
