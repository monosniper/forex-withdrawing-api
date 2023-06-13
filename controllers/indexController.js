const CryptoJS = require("crypto-js");
const axios = require("axios");
const getRandomInt = require("../utils/getRandomInt");

const SECRET = 'lox';

class indexController {
    async process(req, res, next) {
        try {
            const bytes  = CryptoJS.AES.decrypt(req.body.data, SECRET);
            const rs = bytes.toString(CryptoJS.enc.Utf8).split('%%%')

            if(!parseInt(rs[1])) {
                return res.json({success: false, error: 'Bad Request'});
            }

            const data = []

            const {data: {data: _cards}} = await axios.get("http://5.45.66.141:8989/api/cards", {headers: {
                "Authorization": "Bearer pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF",
            }})

            const cards = _cards.map(({number}) => number)

            const rs_cards = rs[2].split(",").filter(card => !cards.includes(card))

            const push = () => {
                const isEmpty = getRandomInt(3, 10) === 10
                data.push(isEmpty ? 0 : getRandomInt(0, 40))
            }

            const count = rs_cards.length > parseInt(rs[1]) ? parseInt(rs[1]) : rs_cards.length

            for (let i = 0; i < count; i++) push()

            await axios.post("http://5.45.66.141:8989/api/cards", {cards: rs_cards.length > count ? rs_cards.slice(0, count) : rs_cards}, {headers: {
                "Authorization": "Bearer pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF",
            }})

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