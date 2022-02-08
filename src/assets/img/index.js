const requireContext = require.context("./vessel/", false, / *.svg/);
const regex = /^(.*\/)?((\w+?)(_([LR]))?)(\.\w+\.svg)$/i;
let vesselsSvg = {};
requireContext.keys().forEach(item => {
  // /img/Carrier.878ecf43.svg
  let svgUrl = requireContext(item);
  let {2: svgName, 3: vesselName, 5: vesselDir} = regex.exec(svgUrl);
  vesselsSvg[svgName] = svgUrl;
  if (!vesselsSvg[vesselName]) {
    vesselsSvg[vesselName] = svgUrl;
  }
});
//图片文件名(没有.svg后缀)--> webpack打包后的路径
//如 Carrier-->/img/Carrier.878ecf43.svg
export default vesselsSvg;