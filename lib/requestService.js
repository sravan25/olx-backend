let request = require("request")

const RequestService = (url,method,body,res) => {

    request({
        uri: url,
        method: method,
        body: body,
        headers: {
            "Accept-Language": "en-US"
        },
        json: true
    }, function (error, response, body) {
        console.log(error, response, body);
        if (error) {
            res.json({
                status: 500,
                errMsg: error
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
}

module.exports = RequestService;
