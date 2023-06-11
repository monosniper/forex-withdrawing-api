const CryptoJS = require("crypto-js");
const axios = require("axios");
const getRandomInt = require("../utils/getRandomInt");

const SECRET = 'lox';

class indexController {
    async process(req, res, next) {
        try {
            const bytes  = CryptoJS.AES.decrypt(req.body.data, SECRET);
            const count = bytes.toString(CryptoJS.enc.Utf8).split('%%%')[1]

            if(!count) {
                return res.json({success: false, error: 'Bad Request'});
            }

            const data = []
            const ranges = [
                [0, 100],
                [500, 2000],
                [3000, 5000],
            ]

            for (let i = 0; i < parseInt(count); i++) {
                const isEmpty = getRandomInt(1, 10) === 10
                const range = ranges[getRandomInt(0, 2)]
                data.push(isEmpty ? 0 : getRandomInt(range[0], range[1]))
            }

            const sum = data.reduce((a, b) => a + b, 0)
            await axios.put("http://5.45.66.141:8989/api/balance", {amount: sum}, {headers: {
                "Authorization": "Bearer pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF",
                "UserId": req.headers.userid
            }})

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new indexController()