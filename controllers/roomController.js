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
    // 1. 방 CRUD 2.
    createRoom : async(req,res) => {
        const {roomName, maxPeople, roomType, roomItem, itemPrice, pricePerPerson} = req.body;
        try {
            let userIdx = req.decoded.idx;
            let addedRoom = await models.rooms.create({roomName, maxPeople, roomType, roomItem, itemPrice, pricePerPerson, currentPeople:1, roomStatus:0});
            let roomIdx = addedRoom.dataValues.roomIdx;
            await models.users_rooms.create({fk_userIdx : userIdx, fk_roomIdx : roomIdx});
            return res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.CREATE_ROOM_SUCCESS, {roomIdx}));
        }catch(e) {
            console.log(e);
            return;
        }
    },
    readRoom : async(req,res)=>{
        const roomIdx = req.query.roomIdx;
        try {
            let roomInfo = await models.rooms.findOne({where : {roomIdx}});
            return res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.READ_ROOM_SUCCESS, roomInfo));
        }catch(e) {
            console.log(e);
            return;
        }
    },
    readRoomByType : async(req,res)=>{
        const roomType = req.query.roomType;
        try {
            let roomsInfo = await models.rooms.findAll({where : {roomType}});
            return res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.READ_ROOM_BY_TYPE_SUCCESS, roomsInfo));
        }catch(e) {
            console.log(e);
            return;
        }
    },
    readAllRoom : async(req,res)=>{
        try {
            let roomsInfo = await models.rooms.findAll();
            return res.status(statCode.OK).send(resUtil.successTrue(statCode.OK, resMsg.READ_ROOM_SUCCESS, roomsInfo));
        }catch(e) {
            console.log(e);
            return;
        }
    }
    // modifyRoom : async(req,res)=>{
    //     const roomIdx = req.query.roomIdx;
    //     const userIdx = req.decoded.idx;
    //     try {
    //         let roomInfo = await models.rooms.findOne({where : {roomIdx}});

    //     }catch(e) {
    //         console.log(e);
    //         return;
    //     }
    // },
    // readRoom : async(req,res)=>{
    //     const roomIdx = req.query.roomIdx;
    //     try {
            
    //     }catch(e) {
    //         console.log(e);
    //         return;
    //     }
    // },
    
}