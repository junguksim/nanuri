const resUtil = require('../module/responseUtil');
const resMsg = require('../module/resMsg');
const statCode = require('../module/statusCode');
const encrypt = require('../module/encryption')
const jwt = require('../module/jwt');
var moment = require('moment');
const models = require('../models');

const findUserById = async (userId) => {
    let result = await models.users.findOne({
        where: { userId }
    })
    if (result == null) {
        return "No user"
    }
    return result.dataValues;
}
module.exports = {
    // 1. 로그인 2. 닉네임 설정 3. 자주 가는 장소 설정 4. 회원가입 5. 아이디 중복 체크 6. 자주 가는 장소 정보 가져오기
    signin: async (req, res) => {
        const { userId, userPw } = req.body;
        try {
            if (!userId || !userPw) {
                res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.NULL_VALUE));
                throw "NULL VALUE"
            }
            let userInfo = await findUserById(userId);
            if (userInfo == "No user") {
                res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.NO_USER));
                throw "NO USER"
            }
            const { hashed } = await encrypt.encryptWithSalt(userPw, userInfo.salt);
            const { token } = jwt.sign(userInfo);
            if (userInfo.userPw != hashed) {
                res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.MISS_MATCH_PW));
                throw `INCORRECT PASSWORD`
            }
            res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.SIGN_IN_SUCCESS, { jwt: token, userIdx: jwt.verify(token).idx, userName: userInfo.userName }))
        } catch (exception) {
            console.log(exception);
            return;
        }
    },
    signup: async (req, res) => {
        const { userId, userPw, userName, userLongitude, userLatitude } = req.body;
        //const missParameters = await Object.entries({userId, userPw}).filter(it=>it[1]==undefined).map(it=>it[0]).join(',');
        try {
            if (!userId || !userPw) {
                res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.NULL_VALUE));
                throw "NULL VALUE"
            }
            let isValid = await models.users.findOne({ where: { userId } });
            if (isValid != null) {
                res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.ALREADY_ID));
                throw "ALREADY ID"
            }
            const { hashed, salt } = await encrypt.encrypt(userPw);
            await models.users.create({ userId, userPw: hashed, salt, userName, userLongitude, userLatitude });
            res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.SIGN_UP_SUCCESS, { userId }))
        } catch (exception) {
            console.log(exception);
            return;
        }
    },
    checkId: async (req, res) => {
        const { userId } = req.body;
        try {
            if (!userId) {
                res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.NULL_VALUE));
                throw "NULL VALUE"
            }
            const checkIdResult = (await models.users.findAll({ where: { userId } }))
            if (checkIdResult.length == 0) {
                return res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.USABLE_ID));
            }
            else {
                return res.status(statCode.BAD_REQUEST).send(resUtil.successFalse(statCode.BAD_REQUEST, resMsg.ALREADY_ID));
            }

        } catch (exception) {
            console.log(exception);
            return;
        }
    }
}