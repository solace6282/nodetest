const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const url = require('url');
const http = require('http')

//connect mysql database
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'ubZRFwnfVy',
    password: "RJWjIP5r4s",
    database: "ubZRFwnfVy"
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySql Connected...');
});
// test auth
router.get("/auth", verifyJwt,(req,res) => {
    res.status(200).send("Authorized")
})
// verifikasi JWT
function verifyJwt(req, res, next){
    const token = req.headers["x-access-token"];
    if (!token){
        res.send({auth:false, msg:"No token"})
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err){
                res.send({auth: false, msg: "Failed to auth"})
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }

}
// login API
// cari email yang cocok di db -> cek kecocokan password -> sign jwt -> return success, token, dan data
// else send fail data
router.post("/login",(req,res) => {
    db.query("SELECT * FROM login WHERE user = ?",[req.body.email],(err,result) => {
        console.log(result[0]);
        if(err) throw err;
        if(result.length > 0){
            if(req.body.pass == result[0].pass){
                let token = jwt.sign({id: result[0].id}, 'jwtSecret', {
                    expiresIn: 86400
                });
                res.status(200).send({ auth: true, token: token, result: result[0] });
            } else {
                res.status(401).send({auth:true, msg:"Password salah"});
            }
        } else {
            res.status(404).send({auth:true, msg:"Email tidak ada"});
        }
    });
})
// joblist API
// check verifyJWT, if fail send fail JWT else continue
// get typed in params
// jika ada yg undefined, set string kosong. khusus full_time adalah false
// request to url dengan param
// send JSON data
// if error -> send fail
router.get("/joblist",verifyJwt,(req, res) =>{
    const description = req.body.description ? req.body.description : "";
    const location = req.body.location ? req.body.location : "";
    const full_time = req.body.full_time ? req.body.full_time : "false";
    const page = req.body.page ? req.body.page : "";
    console.log('http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description='+description+'&location='+location+'&full_time='+full_time+"&page="+page);
    http.get('http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description='+description+'&location='+location+'&full_time='+full_time+"&page="+page, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data+=chunk;
        })
        resp.on("end", () =>{
            console.log(JSON.parse(data).length);
            res.send({msg: "success",  data: JSON.parse(data)})
        })
    }).on("error", (err) => {
        res.send({msg: "failed", data: null});
    })
})
// job detail API
// check verifyJWT, if fail send fail JWT else continue
// get typed in params
// asumsi id diberikan
// request to url dengan param
// send JSON data
// if error -> send fail
router.get("/jobdetail",verifyJwt,(req, res) =>{
    const id = req.body.id;
    http.get('http://dev3.dansmultipro.co.id/api/recruitment/positions/'+id, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data+=chunk;
        })
        resp.on("end", () =>{
            console.log(JSON.parse(data).length);
            res.send({msg: "success",  data: JSON.parse(data)})
        })
    }).on("error", (err) => {
        res.send({msg: err, data: null});
    })
})

module.exports = router;