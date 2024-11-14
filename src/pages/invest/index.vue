<script setup lang="ts">
import router from "@/router";
import {getUserInfo} from "@/api/csUser";
import {fundRedeem, userAssetList} from "@/api/funds";

const {t} = useI18n()

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const userInfo = ref({
  profit: undefined,
  await: undefined,
  today: undefined,
  total: undefined,
});
//页码
const pageNum = ref(1);
//页容量
const pageSize = ref(10);

function onLoad() {
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
    pageNum.value = 1;
  }
  userAssetList(pageNum.value, pageSize.value).then((res) => {
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
}

/*function onRefresh() {
  finished.value = false;
  loading.value = true;
  onLoad();
}*/

function updateRenew(item) {
  fundRedeem(item.orderId).then((res) => {
    if (res.code === 200) {
      showToast(res.msg);
      item.renew = !item.renew
    }
  })
}

function gotoFundInfo(item) {
  router.push({name: 'fundInfo', query: {id: item.fundId}})
}

function retreat() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

function getInvestInfo() {
  getUserInfo().then((res) => {
    if (res.code === 200) {
      userInfo.value = res.data
    }
  })
}

onMounted(() => {
  getInvestInfo();
})
</script>

<template>
  <div class="main">
    <div class="flex items-center justify-between text-#FFFFFF">
      <van-icon style="font-size: 23px; margin-left: -5px" name="arrow-left" @click="retreat"/>
      <div style="font-weight: 500; margin-right: 10px">
        <span>{{ t('user.investment') }}</span>
      </div>
      <div/>
    </div>
    <div class="cardBox balanceBox">
      <div class="mt-10px text-center text-13px text-#787878">
        <span>{{ t('user.totalAmount') }}(USD)</span>
      </div>
      <div class="mb-20px text-center">
        <div class="mt-5px text-28px font-600">
          <span>{{ userInfo.total }}</span>
        </div>
      </div>
      <div class="infoBox">
        <div>
          <div class="font-600">
            <span>{{ userInfo.today }}</span>
          </div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px">
            <span>{{ t('user.todayEarnings') }}</span>
          </div>
        </div>
        <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '35px', borderWidth: '1px' }"/>
        <div>
          <div class="font-600">
            <span>{{ userInfo.await }}</span>
          </div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px">
            <span>{{ t('user.proceeds') }}</span>
          </div>
        </div>
        <van-divider vertical :style="{ borderColor: '#DCDCDC', height: '35px', borderWidth: '1px' }"/>
        <div>
          <div class="font-600">
            <span>{{ userInfo.profit }}</span>
          </div>
          <div style="font-size: 13px; color: #787878; margin-top: 2px">
            <span>{{ t('user.addUp') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!--    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">-->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="t('common.noMore')"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list" :key="index"
        style="background-color: transparent; padding: 0; margin-top: 10px; border-radius: 10px;"
      >
        <div class="cardBox text-14px" style="color: #1E1E1E !important;">
          <div class="flex justify-between">
            <div><span>{{ item.name }}</span></div>
            <div v-if="item.status === 1">
              <div v-if="item.renew" class="text-12px text-#EC4236">
                <span>{{ t('common.dayRenewal', {a: item.days}) }}</span>
              </div>
              <div v-else class="text-12px text-#EC4236">
                <span>{{ t('common.dayRansom', {a: item.days}) }}</span>
              </div>
            </div>
            <div v-else-if="item.status === 2" class="text-#EC4236">
              <span>{{ t('fund.redemption') }}</span>
            </div>
            <div v-else-if="item.status === 3" class="text-#999999">
              <span>{{ t('fund.redeemed') }}</span>
            </div>
          </div>
          <div class="mt-7px flex items-center text-12px text-#666666">
            <div><span>{{ item.fundId }}</span></div>
            <div v-if="item.hot" class="fundTag">
              {{ t('fund.hotL') }}
            </div>
            <div v-if="item.stable" class="fundTag" style="background-color: #4975ea">
              {{ t('fund.stableL') }}
            </div>
          </div>
          <div class="mt-5px flex justify-between text-center">
            <div>
              <div><span>{{ item.amount }}</span></div>
              <div class="text-12px text-#999999">
                <span>{{ t('fund.investmentAmount') }}</span>
              </div>
            </div>
            <div>
              <div><span>{{ item.profit }}</span></div>
              <div class="text-12px text-#999999">
                <span>{{ t('fund.monthRate') }}</span>
              </div>
            </div>
            <div>
              <div><span>{{ item.profitAmount }}</span></div>
              <div class="text-12px text-#999999">
                <span>{{ t('fund.yield') }}</span>
              </div>
            </div>
          </div>
          <van-divider :style="{ borderColor: '#DCDCDC', margin: '10px 5px' }"/>
          <div class="flex justify-between text-12px text-#3A76F2">
            <div @click="gotoFundInfo(item)">
              <span>{{ t('fund.getInfo') }}</span>
              <van-icon name="arrow"/>
            </div>
            <div v-if="item.status === 1" @click="updateRenew(item)">
              <span v-if="item.renew">{{ t('fund.applyRansom') }}</span>
              <span v-else>{{ t('fund.applyRenewal') }}</span>
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
    <!--    </van-pull-refresh>-->
  </div>
</template>

<style scoped lang="less">
.main {
  height: 100vh;
  background: url('/bj-invest.png') no-repeat 100%;
  background-size: cover;
  padding: 12px;

  .cardBox {
    background: #ffffff;
    //box-shadow: 0px 0px 16px 0px rgba(172, 172, 172, 0.33);
    box-shadow: 0px 6px 16px 0px rgba(77, 119, 205, 0.25);
    //box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 10px;
    padding: 12px;
  }

  .balanceBox {
    margin-top: 15px;
  }

  .infoBox {
    display: flex;
    justify-content: space-evenly;
    margin: 8px 0;
    text-align: center;
  }

  .fundTag {
    line-height: normal;
    color: #ffffff;
    font-size: 11px;
    margin-left: 5px;
    background-color: red;
    padding: 0px 2px 2px 2px;
    border-radius: 5px;
  }
}
</style>

<route lang="json">
{
"name": "invest"
}
</route>
