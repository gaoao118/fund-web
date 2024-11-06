<script setup lang="ts">
import {getUserOrders} from "@/api/csUser";
import {useRoute} from "vue-router";
import router from "@/router";

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const type = ref(undefined);
const title = ref('');

//页码
const pageNum = ref(1);
//页容量
const pageSize = ref(10);
const onLoad = () => {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
    pageNum.value = 1;
  }
  getUserOrders(type.value, pageNum.value, pageSize.value).then(res => {
    if (res.code === 200) {
      if (res.data.length <= 0) {
        finished.value = true;
      } else {
        list.value = list.value.concat(res.data);
        pageNum.value = pageNum.value + 1
      }
    }
    loading.value = false;
  })
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

function retreat() {
  router.back()
}

function gotoInfo(item) {
  router.push({name: 'userRecordInfo', query: {id: item.id}})
}

onMounted(() => {
  let route = useRoute();
  type.value = route.query.type
  if (type.value === '1') {
    title.value = '充值记录'
  } else if (type.value === '2') {
    title.value = '提现记录'
  }
})
</script>

<template>
  <div class="main">
    <div class="flex justify-between mt-15px ml-15px">
      <van-icon @click="retreat" style="font-size: 19px" name="arrow-left"/>
      <div class="mr-20px"><span>{{ title }}</span></div>
      <div></div>
    </div>
    <van-divider style="margin: 15px 0 0 0"/>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        style="min-height: 90vh;"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell @click="gotoInfo(item)" v-for="item in list">
          <div class="flex text-#1E1E1E justify-between text-left">
            <div>
              <div class="text-15px">
                <span>{{ item.orderType === 1 ? '充值' : '提现' }}</span>
              </div>
              <div class="text-13px text-#666666">
                <span>{{ item.createTime }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <div class="mr-10px">
                <div class="text-15px" v-if="item.amount >= 0"><span>+{{ item.amount }}</span></div>
                <div class="text-15px" v-else><span>-{{ item.amount }}</span></div>
                <div v-if="item.audit === 1" class="text-13px text-#666666"><span>审核中</span></div>
                <div v-else-if="item.audit === 2" class="text-13px text-#666666"><span>已通过</span></div>
                <div v-else-if="item.audit === 3" class="text-13px text-#666666"><span>已拒绝</span></div>
              </div>
              <van-icon name="arrow" color="#666666"/>
            </div>

          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style scoped lang="less">
.main {

}

</style>
<route lang="json">
{
"name": "userRecord"
}
</route>