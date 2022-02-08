import request from "@/network";

/**
 * 查询靠泊历史
 * @param pageCondition {conditions:{查询条件},page:第几页,size:条数}
 */
export const getHistory = (pageCondition) => request.post('docking/page', pageCondition);

/**
 * 根据靠泊历史记录id获取靠泊数据
 * @param id 靠泊记录id
 */
export const getRecords = (id) => request.get("docking/records", {id});


/**
 * 靠泊统计报表
 * @param dockingId
 * @return {generateReportTraceTime:time, dockingRecord:object, reportDetails:array}
 */
export const getApproachReport = (dockingId) => request.get(`docking/getApproachStatisticsReport/${dockingId}`)
/**
 * 离泊统计报表
 * @param dockingId
 * @return {generateReportTraceTime:time, dockingRecord:object, reportDetails:array}
 */
export const getDepartureReport = (dockingId) => request.get(`docking/getDepartureStatisticsReport/${dockingId}`)
/**
 * 漂移统计报表
 * @param dockingId
 * @return {generateReportTraceTime:time, dockingRecord:object, reportDetails:array}
 */
export const getMooringReport = (dockingId) => request.get(`docking/getMooringStatisticsReport/${dockingId}`)