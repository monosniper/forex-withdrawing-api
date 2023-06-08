const CryptoJS = require("crypto-js");
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

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new indexController()