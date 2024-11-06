<script setup lang="ts">

import router from "@/router";
import {getUserBalance, getUserBillsList} from "@/api/csUser";

const showPopover = ref(false);
// 通过 actions 属性来定义菜单选项
const actions = [
  {text: '选项一'},
  {text: '选项二'},
  {text: '选项三'},
];
const onSelect = (action) => showToast(action.text);

const walletInfo = ref({});
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
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
  getUserBillsList('', pageNum.value, pageSize.value).then(res=>{
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

function getWalletInfo() {
  getUserBalance().then(res => {
    if (res.code === 200) {
      walletInfo.value = res.data
    }
  })
}

onMounted(() => {
  getWalletInfo();
})
</script>

<template>
  <div class="main">
    <div class="flex justify-between items-center">
      <van-icon style="font-size: 23px; margin-left: -5px" @click="retreat" name="arrow-left"/>
      <div style="font-weight: 500; margin-right: 10px">
        <span>我的钱包</span>
      </div>
      <div></div>
    </div>

    <div class="cardBox balanceBox">
      <div class="text-14px mt-10px">
        <span>我的余额(USD)</span>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-28px font-600 mt-5px">
          <span>{{ walletInfo.balance }}</span>
        </div>
        <van-button style="height: 30px; min-width: 80px" round
                    color="linear-gradient(-90deg, #3A76F2 0%, #3AC9F2 100%)">
          充值
        </van-button>
      </div>
      <van-divider :style="{ borderColor: '#DCDCDC' }"/>

      <div class="infoBox">
        <div>
          <div class="font-600"><span>{{ walletInfo.today }}</span></div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px"><span>今日收益</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '35px', borderWidth: '1px' }"/>
        <div>
          <div class="font-600"><span>{{ walletInfo.await }}</span></div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px"><span>待收益</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '35px', borderWidth: '1px' }"/>
        <div>
          <div class="font-600"><span>{{ walletInfo.profit }}</span></div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px"><span>已收益</span></div>
        </div>
      </div>
    </div>

    <div class="cardBox mt-10px mb-10px" style="background-color: #FFFFFF">
      <div class="flex items-center justify-between text-14px">
        <div><span>交易明细</span></div>
        <div>
          <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
            <template #reference>
              <van-button style="height: 23px" plain round type="primary" size="small">
                <span>全部 </span>
                <van-icon name="arrow-down"/>
              </van-button>
            </template>
          </van-popover>
        </div>
      </div>
      <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell style="padding: 5px 0" v-for="item in list">
              <div class="flex justify-between text-left">
                <div>
                  <div class="text-#1E1E1E"><span>{{ item.billName }}</span></div>
                  <div class="text-12px"><span>{{ item.createTime }}</span></div>
                </div>
                <div class="text-right">
                  <div class="text-#EC4236"><span>{{ item.amount }}</span></div>
                  <div class="text-12px"><span>余额: {{item.afterAmount}}</span></div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.main {
  height: 99.9vh;
  background: url("/bj-wallet.png") no-repeat 100%;
  background-size: cover;
  padding: 12px;
  overflow-y: auto;

  .cardBox {
    box-shadow: 0px 0px 16px 0px rgba(172, 172, 172, 0.33);
    border-radius: 10px;
    padding: 12px;
  }

  .balanceBox {
    //height: 200px;
    background: linear-gradient(180deg, #E6F5FF 0%, #FFFFFF 100%);
    margin-top: 15px;

  }

  .infoBox {
    display: flex;
    justify-content: space-evenly;
    margin: 8px 0;
    text-align: center;
  }

  :deep(.van-popover__wrapper) {
    //position: absolute;
    //width: 0 !important;
  }

}

</style>

<route lang="json">
{
"name": "wallet",
"meta": {
"title": "钱包"
}
}
</route>