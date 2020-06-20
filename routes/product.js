var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db_config = require('../db_config/ajoutt_db.js');
var conn = mysql.createConnection(db_config);
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
var sql_register = 'SELECT PSerialNo, ManufacturerName, ModelName, Transmission, Bodytype, Color, OdometerValue, EngineFuel, EngineCapacity, YearProduced, PriceUsd, IsExchangeable, IsFixed, Vin FROM CAR, PRODUCT WHERE CAR.SerialNo=PRODUCT.PSerialNo ';
var sql_register2 = "SELECT SerialNo FROM CAR AS C WHERE C.ManufacturerName = ? AND C.ModelName = ? AND C.Transmission = ? ";
//등록된 판매목록 불러오기
router.get('/', async (req, res, next) => {
    try {
        await conn.query(sql_register, function (err, rows, fields) {
            if (!err) {
                console.log("rows : " + rows);
                console.log(rows[0]);
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
//판매목록 추가
router.post('/add', isLoggedIn, async (req, res, next) => {
    try {
        let params = [];
        let tmp =[];
        let jsonObj = req.body;
        let params2 = [];
        let serialNo = "";
        console.log(jsonObj);
        for (var obj in jsonObj) {
            params.push(jsonObj[obj]);
        }
        for(let i = 0; i < 3; i++){
            tmp[i] = params[i];
        }
        console.log(tmp);
        await conn.query(sql_register2, tmp, function (err, rows, fields) {
            if (!err) {
                console.log("rows : " + rows);
                console.log(rows);
                console.log(rows.SerialNo);
                serialNo = rows[0].SerialNo;
                params2[0] =serialNo;
                for(let i = 3; i < params.length; i++){
                    params2[i-2] = params[i];
                }
                console.log(params2);
                conn.query('INSERT INTO PRODUCT (PSerialNo, Color, OdometerValue, YearProduced, EngineFuel, EngineCapacity, BodyType, PriceUsd, IsExchangeable, IsFixed) VALUES(?,?,?,?,?,?,?,?,?,?)', params2, function (err, results, fields) {
                    if (err) {
                        console.log("ERROR : " + err);
                    } else {
                        console.log("success");
                        res.send("successProduct");
                    }
                });
            } else {
                console.log("ERROR : " + err);
            }
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
router.delete('/:number', async (req, res, next) => {
    try {
        var number = req.params.number;
        conn.query('DELETE FROM PRODUCT WHERE Vin = ?', [number], function (err, rows, fields) {
            if (!err) {
                if(rows.affectedRows == 0){
                    res.send('Delete failed');
                }else{
                    res.send('Success');
                }
            } else {
                console.log("ERROR : "+err);
            }
        });

    } catch (err) {
        console.log(err);
        return next(err);
    }
});
module.exports = router;
