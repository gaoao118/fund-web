<script setup lang="ts">
import {useRoute} from "vue-router";
import {getBuyInfo, getFundPredict} from "@/api/funds";
import {fundBuy} from "@/api/csPay";
import {langFormat, OFFICIAL_WEBSITE} from "@/stores/mutation-type";
import {locale} from "@/utils/i18n";

const {t} = useI18n()

const amount = ref(undefined);
const profit = ref(0);
const checked = ref(true);
const checkedTwo = ref(true);
const fundId = ref(undefined)
const buyInfo = ref({})
const payShow = ref(false)
const payToken = ref('')
const payLoading = ref(false)

function getInfo(id) {
  getBuyInfo(id).then(res => {
    if (res.code === 200) {
      buyInfo.value = res.data;
      updateAmount(1000)
    }
  })
}

function addAmount(add) {
  amount.value = add
}

function updateAmount(num) {
  let val = num ? num : amount.value;
  if (val <= 0) {
    val = 1000
  }
  getFundPredict(fundId.value, val).then(res => {
    if (res.code === 200) {
      let data = res.data;
      profit.value = data.total
    }
  })
}

function payFundOrder() {
  if (!checkedTwo.value) {
    showToast(t('common.reading'));
    return;
  }
  payLoading.value = false
  let num = amount.value ? amount.value : 1000;
  fundBuy(fundId.value, num).then(res => {
    if (res.code === 200) {
      payToken.value = res.data
      payShow.value = true
      payLoading.value = true
    }
  }).catch(res => {
    payLoading.value = false
  })
}

function payClose() {
  payShow.value = false;
  payLoading.value = false
}

function gotoAgreement() {
  window.location.href = OFFICIAL_WEBSITE + "/investor/" + langFormat(locale.value) + ".html"
}

onMounted(() => {
  let route = useRoute();
  fundId.value = route.query.id
  getInfo(fundId.value)
})
</script>

<template>
  <div class="main">
    <div class="flex">
      <span>{{ buyInfo.name }}</span>
      <div v-if="buyInfo.hot" class="fundTag ml-8px">{{ t('fund.hot') }}</div>
      <div v-if="buyInfo.stable" class="fundTag" style="background-color: #4975ea">{{ t('fund.stable') }}</div>
    </div>
    <div class="cardBox buyBox">
      <div class="text-14px">
        <span class="ml-8px">{{ t('fund.buyAmount') }}</span>
        <van-field class="inputBox" placeholder="1000" v-model="amount" @update:model-value="updateAmount" type="digit">
          <template #button>
            <span style="font-size: 18px; color: #000000">USD</span>
          </template>
        </van-field>
        <div class="addAmount">
          <van-button @click="addAmount(4000)" round size="normal">4000</van-button>
          <van-button @click="addAmount(8000)" round size="normal">8000</van-button>
          <van-button @click="addAmount(10000)" round size="normal">10000</van-button>
          <van-button @click="addAmount(15000)" round size="normal">15000</van-button>
        </div>
      </div>
    </div>

    <div class="cardBox payType">
      <div class="flex justify-between">
        <div>
          <span>{{ t('fund.income') }}</span>
        </div>
        <div class="flex text-#787878 text-13px">
          <span><span class="text-#3A76F2 ">{{ profit }}</span> USD</span>
        </div>
      </div>
      <van-divider style="margin: 10px"/>

      <div class="flex justify-between">
        <div>
          <span>{{ t('fund.payType') }}</span>
        </div>
        <div class="flex text-#787878 text-13px">
          <span>{{ t('fund.balance') }}: <span class="text-#3A76F2 ">{{ buyInfo.balance }}</span> USD</span>
          <van-checkbox icon-size="16px" shape="square" v-model="checked">
          </van-checkbox>
        </div>
      </div>
    </div>

    <div class="cardBox infoBox">
      <div class="text-14px">
        <span>{{ t('fund.profile') }}</span>
      </div>
      <div class="text-14px">
        <div class="flex justify-between mt-10px">
          <div class="text-#999999">
            <span>{{ t('fund.fundName') }}</span>
          </div>
          <div>
            <span>{{ buyInfo.name }}</span>
          </div>
        </div>
        <div class="flex justify-between mt-10px">
          <div class="text-#999999">
            <span>{{ t('fund.fundCode') }}</span>
          </div>
          <div>
            <span>{{ buyInfo.id }}</span>
          </div>
        </div>
        <div class="flex justify-between mt-10px">
          <div class="text-#999999">
            <span>{{ t('fund.cycle') }}</span>
          </div>
          <div>
            <span>{{ buyInfo.cycle + t('common.day') }}</span>
          </div>
        </div>
        <div class="flex justify-between mt-10px">
          <div class="text-#999999">
            <span>{{ t('fund.totalProfit') }}</span>
          </div>
          <div>
            <span>{{ buyInfo.profit }}%</span>
          </div>
        </div>
        <div class="flex justify-between mt-10px">
          <div class="text-#999999">
            <span>{{ t('fund.amountDue') }}</span>
          </div>
          <div>
            <span>{{ amount ? amount : 1000 }}+{{ profit }}</span>
          </div>
        </div>
      </div>
    </div>

    <Pay :type="1" :pay-show="payShow" :payToken="payToken" :amount="amount ? amount : '1000'"
         @payClose="payClose"/>

    <div class="bottomBox">
      <div style="position: absolute; left: 0; top: -32px; display: flex; align-items: center;">
        <van-checkbox icon-size="16px" shape="square"
                      v-model="checkedTwo">
          <span class="text-#999999 text-14px">{{ t('common.readAgree') }}</span>
        </van-checkbox>
        <span class="text-#3A76F2 text-14px ml-5px" @click="gotoAgreement">{{ t('fund.agreement') }} </span>
      </div>

      <van-button style="width: 85%; height: 70%;" @click="payFundOrder" round block type="primary"
                  :loading="payLoading"
                  color="linear-gradient(-61deg, #4C93FF, #2964E6)" native-type="submit">
        {{t('fund.invest') }}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  padding: 15px;
  background-color: #f5f5f5;
  min-height: 30vh;

  .fundTag {
    color: #FFFFFF;
    font-size: 13px;
    margin-right: 5px;
    background-color: red;
    padding: 1px 3px;
    border-radius: 5px;
  }

  .cardBox {
    background-color: #FFFFFF;
    border-radius: 10px;
    margin-top: 15px;
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }

  .buyBox {
    margin-top: 10px;
    padding: 10px;
  }

  .inputBox {
    font-size: 25px;
    padding: 20px 10px 2px 10px;
    color: #000000
  }

  .addAmount {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;

    button {
      color: #787878;
      height: 25px;
      width: 70px;
    }
  }

  .payType {
    padding: 10px;
    font-size: 14px;

  }

  :deep(.van-checkbox__icon .van-icon) {
    border-radius: 5px;
    margin-left: 8px;
  }

  .infoBox {
    padding: 10px;
  }

  .bottomBox {
    height: 60px;
    width: 100vw;
    background-color: #FFFFFF;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }


}

</style>


<route lang="json">
{
"name": "subscribe",
"meta": {
"title": "",
"i18n": "menus.subscribe"
}
}
</route>