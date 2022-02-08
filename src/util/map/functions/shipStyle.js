// API_SetShipUseOwnSymbolByShipPos(iShipPos,bUseOwnSymbol,arrSymbolPo)
//设置船舶使用符号类型
//iShipPos:船舶的索引Pos
//bUseOwnSymbol:是否启用自己的样式：true=启用，false=不使用
//arrSymbolPo:假如使用自己样式时候，这个就是船舶的符号，当bUseOwnSymbol=true时候有效；当bUseOwnSymbol=false时,可以传入null
//返回值：true=成功，false=失败


//设置船舶样式
function SetShipUseOwnSymbol() {
    //六边形船舶形状
    var arrSixSymbolPo = [];
    arrSixSymbolPo.push({x: -8, y: 25});
    arrSixSymbolPo.push({x: 8, y: 25});
    arrSixSymbolPo.push({x: 8, y: -15});
    arrSixSymbolPo.push({x: 2, y: -25});
    arrSixSymbolPo.push({x: -2, y: -25});
    arrSixSymbolPo.push({x: -8, y: -15});

    var iShipCount = API_GetShipsCount();
    // console.log(iShipCount);
    for (var shipPos = 0; shipPos < iShipCount; shipPos++) {
        API_SetShipUseOwnSymbolByShipPos(shipPos, true, arrSixSymbolPo);
    }
    API_ReDrawShips();//重绘船舶
}

//设置船舶div标签演示
function SetShipInfoDivObj() {
    var iShipCount = API_GetShipsCount();
    // console.log(iShipCount);
    if (iShipCount > 10) {
        for (var iShipPos = 0; iShipPos < 10; iShipPos++) {//演示给5艘船舶添加div标签
            var shipInfo = API_GetShipInfoByPos(iShipPos);//获取船舶的信息，为了显示标签内容
            if (shipInfo) {
                // let objDiv = document.createElement('div');
                // objDiv.setAttribute('id', "ShipObjInfoDiv" + iShipPos)
                // document.querySelector('.map-page').appendChild(objDiv);
                // console.log(objDiv);
                var objDiv = document.getElementById("ShipObjInfoDiv" + iShipPos);//获取div标签，这里已经在html创建好了div，当然可以自己动态创建
                if (objDiv) {
                    objDiv.style.display = "block";//显示标签
                    objDiv.innerHTML = shipInfo.shipName;//设置标签的信息
                }
                API_SetShipInfoDivObj(iShipPos, objDiv, true); //绑定div标签跟着船舶移动
            }
        }
        API_ReDrawShips(); //重绘船舶
    } else {
        alert("请先添加船舶");
    }

}

function MoveShipInfoDivObj() {
    var iShipCount = API_GetShipsCount();
    if (iShipCount > 5) {
        for (var iShipPos = 0; iShipPos < 5; iShipPos++) {//演示给5艘船舶添加div标签
            var curOffset = API_GetShipInfoDivOffset(iShipPos); //这里获取当前偏移的位置
            if (curOffset) {
                var newOffset = {x: parseInt(curOffset.x) + 10, y: parseInt(parseInt(curOffset.y) - 5)};
                API_SetShipInfoDivOffset(iShipPos, newOffset);//设置新的偏移
            }

        }
        API_ReDrawShips(); //重绘船舶
    } else {
        alert("请先添加船舶");
    }

}

// 删除船舶标签
function DelShipInfoDivObj() {
    var iShipCount = API_GetShipsCount();
    if (iShipCount > 5) {
        for (var iShipPos = 0; iShipPos < 5; iShipPos++) {//演示给5艘船舶添加div标签
            var curDiv = API_GetShipInfoDivObj(iShipPos); //这里获取当前偏移的位置
            if (curDiv) {
                curDiv.style.display = "none"; //x隐藏签
                API_SetShipInfoDivObj(iShipPos, null, true); //解除div与船舶绑定
            }
        }
        API_ReDrawShips(); //重绘船舶
    }


}

export {
    SetShipUseOwnSymbol,
    SetShipInfoDivObj,
    MoveShipInfoDivObj,
    DelShipInfoDivObj
}