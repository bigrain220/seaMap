<template>
    <div>
        <el-row>
            <!--码头信息-->
            <el-col :span="16">
                <el-row>码头名称：{{berthInfo.wharfName}}</el-row>
                <el-row>泊位名称：{{berthInfo.berthName}}</el-row>
                <el-row>靠泊方向：{{dockDirectionStr}}</el-row>
                <el-row>靠泊时间：{{beginDate}}~{{endDate}}</el-row>
            </el-col>
            <!--船舶信息-->
            <el-col :span="8">
                <table border="1" class="table-vesselInfo">
                    <tr>
                        <td>船舶名称</td>
                        <td>{{vesselInfo.name}}</td>
                    </tr>
                    <tr>
                        <td>船舶编号</td>
                        <td>{{vesselInfo.imoNumber}}</td>
                    </tr>
                    <tr>
                        <td>船舶长度</td>
                        <td>{{vesselInfo.length}}</td>
                    </tr>
                    <tr>
                        <td>船舶宽度</td>
                        <td>{{vesselInfo.width}}</td>
                    </tr>
                    <tr>
                        <td>船舶类型</td>
                        <td>{{vesselsTypeStr}}</td>
                    </tr>
                </table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import {getDockingDirectionStr, getVesselTypeStrByType} from "@/util/content";
  import {dateFormat} from "@/util/common";
  /*显示码头泊位和船舶信息   用于打印靠离泊和漂移报表页面*/
  export default {
    name: "berthAndVesselInfo",
    props: {
      dockInfo: {
        type: Object,
        default: () => {
          return {
            beginDate: '',
            endDate: '',
            dockDirection: '',
            dockDirectionStr: '',
          }
        }
      },
      vesselInfo: {
        type: Object,
        default() {
          return {
            imoNumber: "",
            name: "",
            vesselsType: "",
            vesselsTypeStr: "",
            width: "",
            length: "",
          }
        }
      },
      berthInfo: {
        type: Object,
        default() {
          return {
            berthName: "",
            wharfName: "",
          }
        }
      }
    },
    computed: {
      //将类型转换成对应的文字说明
      dockDirectionStr: function () {
        return getDockingDirectionStr(this.dockInfo.dockDirection);
      },
      vesselsTypeStr: function () {
        return getVesselTypeStrByType(this.vesselInfo.type);
      },
      beginDate() {
        return dateFormat(new Date(this.dockInfo.beginDate - 0), "yyyy-MM-dd HH:mm:ss");
      },
      endDate() {
        return dateFormat(new Date(this.dockInfo.endDate - 0), "yyyy-MM-dd HH:mm:ss");
      }
    }
  }
</script>

<style scoped>
    .el-col-16 {
        height: 11rem;
    }

    .el-col .el-row {
        height: 25%;
    }

    table {
        border-collapse: collapse;
    }

    .table-vesselInfo {
        border-collapse: collapse;
        margin: 2rem 0 2rem 0;
        width: 100%;
    }
</style>