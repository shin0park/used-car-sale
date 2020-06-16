const mysql = require('mysql');
const db_config = require('../db_config/ajoutt_db.js');
const conn = mysql.createConnection(db_config);
const local = require('./localStrategy');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        //{id:1, name:shinyoung, age:23} 이를 session에 모두 저장하기에는 너무 무겁기 때문에.
        //id가 고유값이므로 id만저장.
        console.log("serial " + user);
        console.log("serial " + user.Id);
        done(null, user.Id);//mongo db -- user._id
    });
    //메모리 session에 id 만 저장.
    passport.deserializeUser((id, done) => {
        const sql = 'SELECT * FROM USER WHERE Id=?';
        conn.query(sql, [id], function (err, results) {
            if(err){
                return done(err, false);
            }
            if(!results[0])
                return done(err, false);
            return done(null, results[0]);
        });
    });
    local(passport);
};
