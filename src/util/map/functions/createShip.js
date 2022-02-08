// 船舶功能演示
//添加船舶(这里加了定时器，这样船舶就会动了，数据是模拟的，仅供参考)

//添加船舶
function Test_AddShip(count) {
    API_DelAllShips();
    API_SetTrackIdShowOrNot(true);
    for (var i = 0; i < count; i++) {
        var shipId = parseInt(Math.random() * 5000000);
        var shipMMSI = parseInt(Math.random() * 500000);// i; //mmsi
        var shipName = "CHIY"; //船名
        var shipGeoPoX = parseInt(1210000000) + parseInt(Math.random() * 8000000); //经度
        var shipGeoPoY = parseInt(314000000) + parseInt(Math.random() * 8000000); //纬度
        var shipCourse = parseInt(Math.random() * 360); //航向
        var shipSpeed = parseInt(Math.random() * 10); //航速
        var shipLength = 200 + parseInt(Math.random() * 100);//船长度
        var shipWidth = 10 + parseInt(Math.random() * 30);//船宽度
        var shipTime = "2017-09-20 09:30:01"; //时间
        var iShipState = 0; //船舶的状态，当前演示只设置了2种(状态值0和1),见Test_AddShipStyle方法
        //iShipState = 2;
        var bOnlineOrNot = true;
        var bShowTrack = true;
        var arrExpAttrValue = []; //扩展字段

        arrExpAttrValue = {x: 1, y: 2};
        //arrExpAttrValue.push("远洋集团");
        //arrExpAttrValue.push("渔船");

        var curShipInfo = [];//当前船舶的结构体信息
        curShipInfo.shipId = shipId;       //船舶的id
        curShipInfo.shipMMSI = shipMMSI;     //mmsi
        curShipInfo.shipName = shipName;     //船名名称
        curShipInfo.shipGeoPoId = shipId;    //位置
        curShipInfo.shipGeoPoX = shipGeoPoX;    //位置
        curShipInfo.shipGeoPoY = shipGeoPoY;    //位置
        curShipInfo.shipWidth = shipWidth;     //宽度
        curShipInfo.shipLength = shipLength;    //长度
        curShipInfo.shipSpeed = shipSpeed;     //速度
        curShipInfo.shipCourse = shipCourse;    //航向
        curShipInfo.shipTime = shipTime;     //时间
        curShipInfo.iShipState = iShipState;   //状态
        curShipInfo.bOnlineOrNot = bOnlineOrNot; //是否在线
        curShipInfo.bShowTrack = false; //是否显示轨迹
        curShipInfo.arrExpAttrValue = arrExpAttrValue; //扩展字段
        var shipPos = API_AddOneShip(curShipInfo); //添加船舶
        var arr = API_GetShipAllExpAttrByPos(shipPos);
        API_ReDrawShips();
    }
    var timerId = setInterval(UpdateShipInfo, 3000); //3秒更新一次船舶信息
}

//演示：更新船舶动态信息(这样船舶就动了)
function Test_UpdateShipInfo() {
    var timerId = setInterval(UpdateShipInfo, 3000); //3秒更新一次船舶信息
}

function UpdateShipInfo() {
    var shipCount = API_GetShipsCount();

    for (var i = 0; i < shipCount; i++) {
        var shipPos = i;
        var curShipInfo = API_GetShipInfoByPos(shipPos);
        if (curShipInfo) {
            //-----------------生成模拟数据-------------------------------
            var iGeoPoX = curShipInfo.shipGeoPoX;//船舶的位置
            var iGeoPoY = curShipInfo.shipGeoPoY;
            var shipCourse = curShipInfo.shipCourse; //航向
            var iShipState = curShipInfo.iShipState; //状态
            var bOnlineOrNot = curShipInfo.bOnlineOrNot; //是否在线
            var shipSpeed = curShipInfo.shipSpeed; //航速
            var iAddGeoLen = Math.random() * 1000000;
            var angle = (90 - shipCourse) * Math.PI / 180;
            var shipGeoPoX = parseInt(iGeoPoX + Math.cos(angle) * iAddGeoLen);
            var shipGeoPoY = parseInt(iGeoPoY + Math.sin(angle) * iAddGeoLen);
            var iRandom = parseInt(Math.random() * 20);

            if (iRandom % 2 == 0) {
                shipCourse -= iRandom;
            } else {
                shipCourse += iRandom;
            }

            if (iShipState == 1) {
                continue;
            }

            if (shipGeoPoX < 120000000 || shipGeoPoX > 1500000000 || shipGeoPoY < 200000000 || shipGeoPoY > 500000000) {
                shipCourse = parseInt(Math.random() * 100);
            }
            var nowTime = new Date();
            var shipTime = nowTime.getFullYear() + "/" + nowTime.getMonth() + "/" + nowTime.getDay() + " " + nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds(); //时间
            //----------------------------------------------------------------

            var curShipDynamicInfo = [];//更新的时候，只要把这些值设置好即可
            curShipDynamicInfo.shipGeoPoX = shipGeoPoX;
            curShipDynamicInfo.shipGeoPoY = shipGeoPoY;
            curShipDynamicInfo.shipSpeed = 12;
            curShipDynamicInfo.shipCourse = shipCourse;
            curShipDynamicInfo.shipTime = shipTime;
            curShipDynamicInfo.iShipState = iShipState;
            curShipDynamicInfo.bOnlineOrNot = bOnlineOrNot;
            API_SetOneShipTrackShowOption(shipPos, true, 50000);

            API_UpdateOneShipDynamicInfoByPos(shipPos, curShipDynamicInfo); //更新一艘船舶动态信息
        }
    }

    API_ReDrawShips();
}

export {
    Test_AddShip
}