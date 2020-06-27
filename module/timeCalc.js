const commonAPI = require('./commonAPI');
const odsayAPI = require('./odsayAPI');
const statCode = require('./statusCode');
const resMsg = require('./resMsg');
const resUtil = require('./responseUtil');
const schedule = require('node-schedule')
var moment = require('moment')

const splitMinAndSec = async (first, second) => {
    let firstArrMin = Number(first.split('분')[0]);
    let firstArrSec = Number(first.split('초')[0].split('분')[1]);
    let secondArrMin = Number(second.split('분')[0]);
    let secondArrSec = Number(second.split('초')[0].split('분')[1]);
    return {firstArrMin, firstArrSec, secondArrMin, secondArrSec};
}
const getArrTimeByMinAndSec = async(min, sec) => {
    let standard = moment();
    return (standard.add(min, 'minutes').add(sec, 'seconds')).format('YYYY-MM-DD HH:mm:ss')
}
const getNextArr = async (secondArr, ord, busRouteInfo, busRouteId, secondArrMin, secondArrSec)=>{
    let howFarSec = (((secondArr.split('[')))[1].split('번'))[0];
    let newOrd = (Number(ord) - Number(howFarSec) + 1).toString();
    let newStId = 0;
    for (var i in busRouteInfo) {
        if (busRouteInfo[i].seq[0] == newOrd) {
            newStId = busRouteInfo[i].station[0];
            break;
        }
    }
    let busArrTime = await commonAPI.getBusArriveTime(newStId, busRouteId, newOrd);
    let firstArrAtNext = busArrTime[0].arrmsg1[0];
    let secondArrAtNext = busArrTime[0].arrmsg2[0];
    console.log(`${newOrd} 번 정류장에서 첫번째 도착 시간 : ${firstArrAtNext}`);
    console.log(`${newOrd} 번 정류장에서 두번째 도착 시간 : ${secondArrAtNext}`);
    let splitArrAtNext = await splitMinAndSec(firstArrAtNext, secondArrAtNext);
    let firstArrMinAtNext = splitArrAtNext.firstArrMin;
    let firstArrSecAtNext = splitArrAtNext.firstArrSec;
    let secondArrMinAtNext = splitArrAtNext.secondArrMin;
    let secondArrSecAtNext = splitArrAtNext.secondArrSec;
    let nextArrMin = secondArrMin + secondArrMinAtNext - firstArrMinAtNext;
    let nextArrSec = secondArrSec + secondArrSecAtNext - firstArrSecAtNext;
    return {nextArrMin, nextArrSec}
}
const timeCalc = {
    busTime: async (stId, busRouteId, ord) => {
        let busRouteInfo = await commonAPI.getStationByRoute(busRouteId);
        let busArrTime = await commonAPI.getBusArriveTime(stId, busRouteId, ord);
        let firstArr = busArrTime[0].arrmsg1[0];
        let secondArr = busArrTime[0].arrmsg2[0];
        console.log(`현재 시간 : ${moment().format('YYYY-MM-DD HH:mm:ss')}`)
        console.log(`${ord}번 정류장에서 첫 도착 시간 : ${firstArr}`);
        console.log(`${ord}번 정류장에서 두번째 도착 시간 : ${secondArr}`)
        let {firstArrMin, firstArrSec, secondArrMin, secondArrSec} = (await splitMinAndSec(firstArr, secondArr));
        let firstArrTime = await getArrTimeByMinAndSec(firstArrMin, firstArrSec);
        let secondArrTime = await getArrTimeByMinAndSec(secondArrMin, secondArrSec)
        console.log(firstArrTime);
        console.log(secondArrTime);
        let thirdArr = await getNextArr(secondArr, ord, busRouteInfo,busRouteId, secondArrMin, secondArrSec);
        let thirdArrMin = thirdArr.nextArrMin;
        let thirdArrSec = thirdArr.nextArrSec;
        console.log(thirdArrMin, thirdArrSec)
        let thirdArrTime = await getArrTimeByMinAndSec(thirdArrMin, thirdArrSec);
        console.log(thirdArrTime)
    },
    setNoticeTime: async (departTime, term, stId, busRouteId, ord) => {
        let standard = moment(departTime).subtract(term, 'minutes')
        let getArrTimePoint = (moment(departTime).subtract(term, 'minutes')).format('YYYY-MM-DD HH:mm:ss');
        console.log(getArrTimePoint)
        // await schedule.scheduleJob(getArrTimePoint, async function() {

        // });
        let busArrTime = await timeCalc.busTime(stId, busRouteId, ord);
        console.log(busArrTime)
        let firstArrTime = (standard.add(busArrTime.firstArrMin, 'minutes').add(busArrTime.firstArrSec, 'seconds')).format('YYYY-MM-DD HH:mm:ss')
        console.log(firstArrTime);
        let secondArrTime = (standard.add(busArrTime.secondArrMin - busArrTime.firstArrMin, 'minutes').add(busArrTime.secondArrSec - busArrTime.firstArrSec, 'seconds')).format('YYYY-MM-DD HH:mm:ss')
        console.log(secondArrTime)
        return 1
    },
    subwayTime: async (startTm, stationID, wayCode, noticeMin, arriveCount, sectionTime) => {
        let leastTm = startTm.subtract(sectionTime, 'm').toString();
        console.log('least : ' + leastTm);
        let getSubwayArriveTimeResult = await odsayAPI.getSubwayArriveTime(stationID, wayCode);
        console.log(getSubwayArriveTimeResult);
        if (getSubwayArriveTimeResult === undefined) {
            return ({
                code: statCode.BAD_REQUEST,
                json: resUtil.successFalse(resMsg.FIND_SUBWAY_TIME_FAILED)
            })
        }
        let arriveArr = [];
        let noticeArr = [];
        let timeArray = [];
        console.log('SUBWAY FIRST');
        if (moment(leastTm).day() == 6) { //토요일
            if (getSubwayArriveTimeResult.SatList.down === undefined) {
                timeArray = getSubwayArriveTimeResult.SatList.up.time;
            }
            else {
                timeArray = getSubwayArriveTimeResult.SatList.down.time;
            }
        }
        else if (moment(leastTm) == 0) { //일요일
            if (getSubwayArriveTimeResult.SunList.down === undefined) {
                timeArray = getSubwayArriveTimeResult.SunList.up.time;
            }
            else {
                timeArray = getSubwayArriveTimeResult.SunList.down.time;
            }
        }
        else {
            if (getSubwayArriveTimeResult.OrdList.down === undefined) {
                timeArray = getSubwayArriveTimeResult.OrdList.up.time;
            }
            else {
                timeArray = getSubwayArriveTimeResult.OrdList.down.time;
            }
        }
        for (var k = 0; k < timeArray.length; k++) {
            //startTime 0 년도 1 월 2 일 3 몇시 4 몇분
            if (timeArray[k].Idx == moment(leastTm).hour()) {
                let minArr = timeArray[k].list.split(' ');
                for (var j = 0; j < minArr.length; j++) {
                    if (moment(leastTm).minute() > Number(minArr[j].split('(')[0])) {
                        arriveArr.push(moment(leastTm).minute(minArr[j].split('(')[0]).toString());
                        noticeArr.push((moment(leastTm).minute(minArr[j].split('(')[0]).subtract(noticeMin, 'minutes')).toString());
                    }
                    if (arriveArr.length === arriveCount) {
                        break;
                    }
                }
                if (arriveArr.length < arriveCount - 1) {
                    console.log(timeArray[k - 1]);
                    minArr = timeArray[k - 1].list.split(' ');
                    console.log(minArr);
                    for (var l = minArr.length - 1; l > minArr.length - 1 - arriveCount; l--) {
                        arriveArr.push(moment(leastTm).subtract(1, 'hours').minute(minArr[l].split('(')[0]).toString());
                        noticeArr.push((moment(leastTm).minute(minArr[l].split('(')[0]).subtract(noticeMin, 'minutes')).toString());
                    }
                }
            }
        }
        return ({
            arriveArr: arriveArr,
            noticeArr: noticeArr
        })
    }
}

module.exports = timeCalc;