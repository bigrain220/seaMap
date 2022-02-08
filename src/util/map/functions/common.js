
// API_SetMapViewCenter(lon,lat,scale)
//设置海图中心信息，设置之后会自动刷新海图
//lon:海图中心点经度，例如"121.21"，假如不设置可以传入null
//lat:海图中心点纬度，例如"31.12"，假如不设置可以传入null
//scale:海图的比例尺，例如"320000"，假如不设置可以传入null

// API_SetMapLevel(iLevel, lonLatCenterPo)
//设置海图的当前比例尺级别(谷歌规则下)
//iLevel:比例尺级别，例如3
// lonLatCenterPo:缩放的中心点，null=以海图中心点进行缩放，格式例如{x:121.5,y:31.5}

function ShowDivBoxOrNot(objName, bShow) {
    if (bShow === true) {
        document.getElementById(objName).style.display = "block";
    }
    else {
        document.getElementById(objName).style.display = "none";
    }
}

function CloseDivBox(divBoxId) {
    var obj = document.getElementById(divBoxId);
    if (obj) {
        obj.style.display = "none";
    }
}

//设置中心点
function Test_SetMapCenterPo({x, y,level=null}) {
    // console.log(x, y,level)
    //第一种设置方法
    var newLonLatCenterPo = { x,y }; //新中心点
    API_SetMapLevel(level, newLonLatCenterPo);

    //第二种设置方法
    // var newLonLatCenterPo = { x,y }; //新中心点
    // API_SetMapLevel(level, { x: parseInt(newLonLatCenterPo.x), y: parseInt(newLonLatCenterPo.y) });
    // API_SetMapViewCenter(newLonLatCenterPo.x, newLonLatCenterPo.y, 30000);
    //第二种设置方法
    //var newLonLatCenterPo = { x: 121.4740119, y: 31.5490726 };
    //API_SetMapLevel(7, { x: 121, y: 31 });
    //API_SetMapViewCenter(newLonLatCenterPo.x, newLonLatCenterPo.y, 2000000);
}

//删除table的行
//tableName:table的id名称
//iStartIndex：开始删除的行
//iDelCount：删除的数量
function DelTableTrsByPos(tableName, iStartIndex, iDelCount) {
    var tableObj = document.getElementById(tableName);
    // console.log(...arguments,tableObj.rows)
    if (tableObj) {
        if (iStartIndex < -1) {
            iStartIndex = 0;
        }

        var iCanDelRowCount = parseInt(tableObj.rows.length) - iStartIndex;
        if (parseInt(iDelCount) > iCanDelRowCount) {
            iDelCount = iCanDelRowCount;
        }

        for (var i = 0; i < iDelCount; i++) {
            tableObj.deleteRow(iStartIndex);
        }
    }
}

function ShowDivBox(divBoxId, iLeft, iTop) {
    var obj = document.getElementById(divBoxId);
    if (obj) {
        if (obj.style.display != "block") {
            obj.style.display = "block";
            obj.style.left = parseInt(iLeft) + "px";
            obj.style.top = parseInt(iTop) + "px";
        }
    }
}

export {
    ShowDivBoxOrNot,
    CloseDivBox,
    Test_SetMapCenterPo,
    DelTableTrsByPos,
    ShowDivBox
}

