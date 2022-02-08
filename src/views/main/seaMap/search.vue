<template>
  <div class="home-search">
    <el-autocomplete v-model.trim="state" :fetch-suggestions="querySearchAsync" placeholder="搜索船舶名称或MMSi号" size="medium" :trigger-on-focus="false"
                     @select="handleSelect" value-key="shipName" clearable ref="myAutocomplete" @clear="$refs.myAutocomplete.handleFocus()">
      <i slot="prefix" class="el-icon-search search-icon"  @click="searchClick"></i>
      <template slot-scope="{ item }">
        <div class="search-item">
          <span class="name">{{ item.shipName }}</span>
          <label class="id"> MMSI: </label><span class="id">{{ item.shipMMSI }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      dataList: [],
      state: '',
      timeout: null,
      cb:()=>{},
 }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      // console.log(queryString,'queryString') //TODO 为空的时候展示历史搜索记录
      let results = API_SelectShipByCondition(queryString)||[];
      // console.log(this.toObject(results))
      this.cb =cb;
      cb(this.toObject(results));
    },
    handleSelect(item) {
      let {shipId,shipGeoPoX,shipGeoPoY} = item;
      const iShipPos = API_GetShipPosById(shipId);
      API_SetShipToMapViewCenterByPos(iShipPos);//居中选择并显示
      API_SetMapLevel(12, {x:shipGeoPoX/10000000, y:shipGeoPoY/10000000});//设置当前显示的比例尺级别和中心点
      this.$emit('searchEvent',item)
    },
    toObject(arr){
       return  arr?.map(item=>{return {...item}})
    },
    searchClick(){
      this.querySearchAsync(this.state,this.cb)
      this.$refs.myAutocomplete.handleFocus()
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
.home-search{
  width: 100%;
  .el-autocomplete{
    width: 100%;
    .search-icon{
      padding: 0 2px;
      line-height: 36px;
      cursor: pointer;
      &:hover{
        color: #409EFF;
      }
    }
  }
}
.search-item{
  .name{
    color: #333;
  }
  .id{
    font-size: 12px;
    color: #999;
  }
}
</style>