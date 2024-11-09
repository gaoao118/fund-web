<script setup lang="ts">

import router from "@/router";
import {getUserBalance, getUserBillsList} from "@/api/csUser";

const {t} = useI18n()

const showPopover = ref(false);
const type = ref({text: t('common.all'), value: 0});

const actions = [
  {text: t('common.all'), value: 0},
  {text: t('common.income'), value: 1},
  {text: t('common.disburse'), value: 2},
];
const onSelect = (action) => {
  type.value = action
  refreshing.value = true;
  loading.value = true;
  onLoad();
};

const walletInfo = ref({
  profit: undefined,
  await: undefined,
  today: undefined,
  balance: undefined,
});
const list = ref([{
  afterAmount: undefined,
  createTime: undefined,
  billName: undefined,
  amount: undefined,
}]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);

const onLoad = () => {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
    pageNum.value = 1;
  }
  getUserBillsList(type.value.value, pageNum.value, pageSize.value).then(res => {
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
  finished.value = false;
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

function gotoRecharge() {
  router.push({name: 'recharge'})
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
        <span>{{ t('common.myWallet') }}</span>
      </div>
      <div></div>
    </div>

    <div class="cardBox balanceBox">
      <div class="text-14px mt-10px">
        <span>{{ t('common.myBalance') }}(USD)</span>
      </div>
      <div class="flex items-center justify-between">
        <div class="text-28px font-600 mt-5px">
          <span>{{ walletInfo.balance }}</span>
        </div>
        <van-button style="height: 30px; min-width: 80px" round @click="gotoRecharge"
                    color="linear-gradient(-90deg, #3A76F2 0%, #3AC9F2 100%)">
          {{ t('pay.recharge') }}
        </van-button>
      </div>
      <van-divider :style="{ borderColor: '#DCDCDC' }"/>

      <div class="infoBox">
        <div>
          <div class="font-600"><span>{{ walletInfo.today }}</span></div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px"><span>{{ t('user.todayEarnings') }}</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '35px', borderWidth: '1px' }"/>
        <div>
          <div class="font-600"><span>{{ walletInfo.await }}</span></div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px"><span>{{ t('user.proceeds') }}</span></div>
        </div>
        <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '35px', borderWidth: '1px' }"/>
        <div>
          <div class="font-600"><span>{{ walletInfo.profit }}</span></div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px"><span>{{ t('user.earned') }}</span></div>
        </div>
      </div>
    </div>

    <div class="cardBox mt-10px mb-10px" style="background-color: #FFFFFF">
      <div class="flex items-center justify-between text-14px">
        <div><span>{{ t('user.tranDetail') }}</span></div>
        <div>
          <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
            <template #reference>
              <van-button style="height: 23px" plain round type="primary" size="small">
                <span>{{ type.text }}</span>
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
            :finished-text="t('common.noMore')"
            @load="onLoad"
          >
            <van-cell style="padding: 5px 0" v-for="item in list">
              <div class="flex justify-between text-left">
                <div>
                  <div class="text-#1E1E1E"><span>{{ item.billName }}</span></div>
                  <div class="text-12px"><span>{{ item.createTime }}</span></div>
                </div>
                <div class="text-right">
                  <div v-if="item.amount>=0" class="text-#4f84eb text-15px"><span>+{{ item.amount }}</span></div>
                  <div v-else class="text-#EC4236 text-15px"><span>{{ item.amount }}</span></div>
                  <div class="text-12px"><span>{{ t('common.balance') }}: {{ item.afterAmount }}</span></div>
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
"name": "wallet"
}
</route>