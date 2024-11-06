<script setup lang="ts">
import copy from '~/svg/copy.svg'
import {showSuccessToast} from "vant";
import {getPayConfig, withdrawApply} from "@/api/csPay";
import router from "@/router";

const columns = ref([
  {text: 'ERC20', value: 'ERC20'},
  {text: 'TRC20', value: 'TRC20'}
]);

const amount = ref(undefined);
const fieldValue = ref('');
const showPicker = ref(false);
const configList = ref([]);
const payId = ref('');
const address = ref('');

const payShow = ref(false)
const payToken = ref('')
const payLoading = ref(false)

function payClose() {
  payShow.value = false;
  payLoading.value = false
}

function getConfig() {
  getPayConfig(1, 'USDT').then(res => {
    if (res.code === 200) {
      configList.value = res.data
      let arr = []
      for (let i = 0; i < res.data.length; i++) {
        let datum = res.data[i];
        arr.push({text: datum.network, value: datum.id});
      }
      columns.value = arr;
      fieldValue.value = res.data[0].network
      payId.value = res.data[0].id
    }
  })
}

function addressCopy() {
  navigator.clipboard.writeText(address.value).then(res => {
    showSuccessToast('复制成功');
  });
}

function onConfirm(options) {
  fieldValue.value = options.selectedOptions[0].text
  payId.value = options.selectedOptions[0].value
  showPicker.value = false
}

function apply() {
  if (!amount.value) {
    showToast('请输入提现金额');
    return;
  }
  if (!address.value) {
    showToast('请输入提现地址');
    return;
  }
  payLoading.value = true
  withdrawApply(payId.value, amount.value, address.value).then(res => {
    if (res.code === 200) {
      payToken.value = res.data
      payShow.value = true
    } else {
      payLoading.value = false
    }
  })
}

function gotoRecord() {
  router.push({name: 'userRecord', query: {type: 2}})
}

onMounted(() => {
  getConfig();
})

</script>

<template>
  <div class="main">
    <div @click="gotoRecord" class="recordBox">
      <span>提现记录</span>
    </div>
    <div class="cardBox flex mt-10px">
      <div style="width: 80px; line-height: 46px; margin-left: 15px; color: #999999; font-size: 14px">
        <span>提现金额</span>
      </div>
      <van-field v-model="amount" style="border-radius: 10px" placeholder="请输入提现金额"/>
    </div>

    <div class="cardBox flex mt-15px">
      <div style="width: 80px; line-height: 46px; margin-left: 15px; color: #999999; font-size: 14px">
        <span>提现网络</span>
      </div>
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        placeholder="选择提现网络"
        @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>

    <div class="cardBox flex mt-15px">
      <div style="width: 80px; line-height: 46px; margin-left: 15px; color: #999999; font-size: 14px">
        <span>到账地址</span>
      </div>
      <van-field style="border-radius: 10px; padding: 10px 10px 0 0; " v-model="address" placeholder="请输入到账地址">
        <template #button>
          <div class="flex" @click="addressCopy">
            <img style="height: 20px; width: 20px; display: inline-block; " :src="copy" alt="">
          </div>
        </template>
      </van-field>
    </div>


    <div class="text-14px mt-20px">
      <span>注意</span>
    </div>
    <div class="text-12px text-#999999">
      <p>
        1.请确认您的提现网络和地址信息，信息错误资产无法找回
      </p>
    </div>


    <div class="bottomBox">
      <van-button :loading="payLoading" style="width: 85%; height: 70%;" @click="apply" round block type="primary"
                  color="linear-gradient(-61deg, #4C93FF, #2964E6)" native-type="submit">
        确定
      </van-button>
    </div>

    <Pay :type="2" :pay-show="payShow" :payToken="payToken" title="余额提现" :amount="amount" @payClose="payClose"/>

  </div>
</template>

<style scoped lang="less">
.main {
  padding: 10px 15px;
  height: 94.3vh;
  background-color: #f2f2f2;
}

.recordBox {
  position: fixed;
  top: 15px;
  right: 9px;
  font-size: 13px;
  color: #666666;
  z-index: 999;
}

.cardBox {
  background-color: #FFFFFF;
  border-radius: 10px;
  //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  //box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.qrCodeBox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 185px;
  width: 185px;
  border-radius: 10px;
  border: #2A73ED solid 3px;
}

.bottomBox {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

<route lang="json">
{
"name": "withdraw",
"meta": {
"title": "提现"
}
}
</route>