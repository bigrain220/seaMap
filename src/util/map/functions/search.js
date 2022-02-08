// API_SetShipInfoDivObj(iShipPos, divObj, bMove)
//设置绑定船舶的div对象
//iShipPos:船舶的索引Pos
//divObj:div的对象信息，即：document.getElementById("divId")对象
//bMove:是否跟着船舶移动，true=跟着船舶移动，false=不跟着船舶移动
//返回值:true=成功，false=失败

// API_SetOneShipStyleByPos(iShipPos, bGetOwnStyle, objStyle)
//设置一个船舶的个性样式
//iShipPos:船舶的pos
//bGetOwnStyle:是否启用自己样式，true=使用自己个性样式，false=使用状态样式,假如这个为false的时候，第三个参数objStyle可以传入null
//objStyle:个性样式结构体，包括填充颜色、线粗细，线颜色，格式{strFillColor:"#FF0000",iBorderSize:2,strBorderColor:"#FFFFFF"}
//返回值：true=设置成功，false=设置失败


function searchFn() {
    let arr = API_SelectShipByCondition('文艺复兴号');//根据船舶名称或者MMSi号关键字搜索船舶
    // console.log(arr)
    if (!arr || arr?.length <= 0) {
        alert("请先添加船舶");
        return false;
    }
    const shipPos = API_GetShipPosById(arr[0].shipId);//一般情况下，所有对对象进行操作的接口都是通过索引Pos来实现的，所以在使用操作接口前，就根据id通过接口来获取索引pos后。
    let objStyle = {
        iBorderSize: '4',
        strBorderColor: 'yellow',
        strFillColor: 'blue',
        minShowScale: 10,
        maxShowScale: 16
    }
    API_SetOneShipStyleByPos(shipPos, true, objStyle);
    // 添加标签
    let curShipInfo = API_GetShipInfoByPos(shipPos);
    let objDiv = document.createElement('div');
    objDiv.setAttribute('id', "test-div")
    objDiv.setAttribute('class', 'ShowMouseMoveInfoStyle')
    objDiv.style.display = "block";//显示标签
    objDiv.innerHTML = curShipInfo.shipName;//设置标签的信息
    document.querySelector('.map-page').appendChild(objDiv);
    API_SetShipInfoDivObj(shipPos, objDiv, true); //绑定div标签跟着船舶移动
    API_ReDrawShips(); //重绘船舶
}

export {
    searchFn
}