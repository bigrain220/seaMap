
function ShowInfoDivBox(objDiv, scrnPo) {
    // console.log(...arguments,'ShowInfoDivBox')
    if (objDiv) {
        //获取海图界面大小
        var offsetLen = 10;
        var divLeft = scrnPo.x + offsetLen;
        var divTop = scrnPo.y + offsetLen;
        var divSize = {w: objDiv.clientWidth, h: objDiv.clientHeight};
        var mapDiv = document.getElementById("map");
        if (mapDiv) {
            var mapWidth = mapDiv.clientWidth;
            var mapHeight = mapDiv.clientHeight;

            if (divLeft + divSize.w > mapWidth) {
                divLeft = scrnPo.x - divSize.w - offsetLen;
            }

            if (divTop + divSize.h > mapHeight) {
                divTop = scrnPo.y - divSize.h - offsetLen;
            }
        }
        objDiv.style.left = divLeft + "px";
        objDiv.style.top = divTop + "px";
        objDiv.style.display = "block";
    }
}

function showDomOrNot(selector,isShow){
    if(selector){
        let dom = document.querySelector(selector);
        dom.style.display=isShow?'block':'none';
    }
}

function toObject(data) {
    const type = Object.prototype.toString.call(data);
    let res;
    if (type === '[object Array]') {
        res = data?.map(item => {
            return {...item}
        })
    } else if (type === '[object Object]') {
        res = {...data}
    }
    return res;
}

export {
    ShowInfoDivBox,
    showDomOrNot,
    toObject
}