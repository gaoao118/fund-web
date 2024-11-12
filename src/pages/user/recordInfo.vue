<script setup lang="ts">
import router from "@/router";
import {useRoute} from "vue-router";
import {getUserOrderInfo} from "@/api/csUser";
import {showImagePreview} from "vant";

const {t} = useI18n()

const orderId = ref(undefined);
const title = ref('');
const orderInfo = ref({
  proof: undefined,
  createTime: undefined,
  address: undefined,
  network: undefined,
  id: undefined,
  errorInfo: undefined,
  amount: undefined,
  audit: undefined,
});

function getRecordInfo() {
  getUserOrderInfo(orderId.value).then(res => {
    if (res.code === 200) {
      orderInfo.value = res.data
      if (res.data.orderType === 1) {
        title.value = t('pay.rechargeInfo')
      } else if (res.data.orderType === 2) {
        title.value = t('pay.withdrawInfo')
      }
    }
  })
}

function preview(img) {
  showImagePreview([img]);
}

function retreat() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

onMounted(() => {
  let route = useRoute();
  orderId.value = route.query.id
  getRecordInfo()
})
</script>

<template>
  <div class="main">
    <div class="flex justify-between pt-15px pb-15px pl-15px bg-#FFFFFF">
      <van-icon @click="retreat" style="font-size: 19px" name="arrow-left"/>
      <div class="mr-20px"><span>{{ title }}</span></div>
      <div></div>
    </div>

    <div class="cardBox text-center">
      <div v-if="orderInfo.audit === 1">
        <van-icon class="text-30px text-#3A76F2" name="underway"/>
        <div class="text-14px text-#666666 mt-7px mb-7px">{{ t('pay.audit') }}</div>
      </div>
      <div v-else-if="orderInfo.audit === 2">
        <van-icon class="text-30px text-#79b667" name="checked"/>
        <div class="text-14px text-#666666 mt-7px mb-7px">{{ t('pay.passed') }}</div>
      </div>
      <div v-else-if="orderInfo.audit === 3">
        <van-icon class="text-30px text-#EC4236" name="clear"/>
        <div class="text-14px text-#666666 mt-7px mb-7px">{{ t('pay.declined') }}</div>
      </div>
      <div v-if="orderInfo.amount >= 0" class="text-19px mr-7px">+{{ orderInfo.amount }}</div>
      <div v-else class="text-19px mr-7px">-{{ orderInfo.amount }}</div>
    </div>

    <div v-if="orderInfo.errorInfo" class="cardBox text-14px text-#EC4236">
      <span>{{ t('pay.declInfo') }}: {{ orderInfo.errorInfo }}</span>
    </div>

    <div class="cardBox">
      <div class="infoFont">
        <div><span>{{ t('pay.orderId') }}</span></div>
        <div><span>{{ orderInfo.id }}</span></div>
      </div>
      <div class="infoFont mt-18px">
        <div><span>{{ t('pay.networkType') }}</span></div>
        <div><span>USDT-{{ orderInfo.network }}</span></div>
      </div>
      <div class="infoFont mt-18px">
        <div><span>{{ t('pay.addressTransfer') }}</span></div>
        <div class="text-12px"><span>{{ orderInfo.address }}</span></div>
      </div>
      <div class="infoFont mt-18px">
        <div><span>{{ t('pay.createTime') }}</span></div>
        <div><span>{{ orderInfo.createTime }}</span></div>
      </div>
      <div v-if="orderInfo.proof" class="infoFont mt-18px">
        <div><span>{{ t('pay.screenshot') }}</span></div>
        <div>
          <van-image
            @click="preview(orderInfo.proof)"
            width="35"
            height="35"
            fit="cover"
            :src="orderInfo.proof"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  background-color: #f2f2f2;
  min-height: 100vh;

  .cardBox {
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 10px;
    margin: 15px;
  }

  .infoFont {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #555555;
    font-size: 14px;
  }
}


</style>

<route lang="json">
{
"name": "userRecordInfo"
}
</route>