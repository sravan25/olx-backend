var express = require('express');
var router = express.Router();
var request = require('request');

let RequestService = require("../lib/requestService")

let url = "http://192.168.1.230:8018/icws/"
/* GET home page. */
router.post('/login', async function(req, res, next) {
  let userID = req.body.userID;
  let password = req.body.password

  console.log("user :",userID, password);
  let body = {
    "userID": userID,
    "password": password,
    __type: "urn:inin.com:connection:icAuthConnectionRequestSettings",
    applicationName: "ICWS"
  }
  url = `${url}/connection`
  await RequestService(url,"POST",body,res)

});

router.get("/messages/:sessionId",(req,res) =>{
   let id = req.params.sessionId;
   url = `${url}/{id}/messaging/messages`;
   let headers = {
       "Accept-Language":"en-US"
   }
   let body ={
       sessionId: id
   }

    request({
        uri: `${url}/{id}/messaging/messages`,
        method: "POST",
        body: body,
        headers:headers,
        json: true
    }, function (error, response, body) {
        console.log(error, response, body);
        if (error) {
            res.json({
                status: 500,
                errMsg:error
            });
        } else {
            res.json({
                status: response.status,
                response: response.body,
                headers: response.headers,
                body: body
            });
        }
    });
});

router.delete("/logout/:sessionId",(req,res) => {
     let id = req.params.sessionId;
    let token = req.headers["csrftoken"];
    let ctoken = req.headers['ctoken']
    console.log("token --",token,`${url}/${id}/configuration/workgroups`);
    let cookieToken=`icws_${id}=${ctoken}|languageId=en-US/icws/${id}; HttpOnly`

   let body = {
        "__type":"urn:inin.com:connection:workstationSettings",
        "sessionId": id
    }
    request({
        uri: `${url}/{id}/connection`,
        method: "DELETE",
        body:body,
        headers:{
            "Accept-Language":"en-US",
            "ININ-ICWS-CSRF-Token":token,
            "Cookie":cookieToken
        },
        json: true
    }, function (error, response, body) {
        console.log(error, response, body);
        if (error) {
            res.json({
                status: 500,
                errMsg:error
            });
        } else {
            res.json({
                status: response.status,
                response: response.body,
                headers: response.headers,
                body: body
            });
        }
    });
});

router.get("/workgroups/:sessionId",(req,res) => {

    let id = req.params.sessionId;
    let token = req.headers["csrftoken"];
    let ctoken = req.headers['ctoken']
   console.log("token --",token,`${url}/${id}/configuration/workgroups`);

    let cookieToken=`icws_${id}=${ctoken}|languageId=en-US/icws/${id}; HttpOnly`
    console.log(cookieToken);

    request({
        uri: `${url}/${id}/configuration/workgroups`,
        method: "GET",
        headers:{
            "Accept-Language":"en-US",
            "ININ-ICWS-CSRF-Token":token,
            "Cookie":cookieToken
        },
        json: true
    }, function (error, response, body) {
        console.log("===",error);
        if (error) {
            res.json({
                status: 500,
                errMsg:error
            });
        } else {
            res.json({
                status: response.status,
                response: response.body,
                headers: response.headers,
                body: body
            });
        }
    });
});


module.exports = router;
