var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_config = require('../db_config/ajoutt_db.js');
var conn = mysql.createConnection(db_config);
var sql_register3 = 'SELECT * FROM CAR AS C WHERE C.SerialNo IN (SELECT PurSerialNo FROM PURCHASE WHERE PId= ?)';
var sql_register = 'SELECT * FROM PRODUCT AS E WHERE E.Vin IN (SELECT PVin FROM PURCHASE WHERE PId= ?)';
var sql_register2 = 'SELECT * FROM CAR AS C WHERE C.SerialNo IN (SELECT PSerialNo FROM PRODUCT AS E WHERE E.Vin IN (SELECT PVin FROM PURCHASE WHERE PId= ?))';
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

//등록된 구매목록 불러오기
router.get('/', async (req, res, next) => {
    try {
        const id = req.user.Id;
        await conn.query(sql_register3, [id], function (err, rows, fields) {
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
//구매목록 생성
router.post('/', isLoggedIn, async (req, res, next) => {
    const id = req.user.Id;
    try {
        let params = [];
        let jsonObj = req.body;
        console.log("purchase/ jsonObj")
        console.log(jsonObj);
        params.push(id);
        for (var obj in jsonObj) {
            console.log(obj);
            params.push(jsonObj[obj]);
        }
        console.log(params);
        await conn.query('INSERT INTO PURCHASE (PId, PurSerialNo) VALUES(?,?)', params, function (err, results, fields) {
            if (err) {
                console.log("ERROR : " + err);
            } else {
                console.log("success");
            }
        });
        res.send("successPurchase");
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
module.exports = router;
