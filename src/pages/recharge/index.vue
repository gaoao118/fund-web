<script setup lang="ts">
import usdt from '~/svg/usdt.svg'
import copy from '~/svg/copy.svg'
import {showSuccessToast} from "vant";
import QrcodeVue from "qrcode.vue"
import {getPayConfig, recharge} from "@/api/csPay";
import {uploadFile} from "@/api";
import router from "@/router";

const columns = ref([]);

const amount = ref(undefined);
const fieldValue = ref('');
const payId = ref('');
const showPicker = ref(false);
const configList = ref([]);
const address = ref('');
const loading = ref(false);

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
      address.value = res.data[0].address
      payId.value = res.data[0].id
    }
  })
}

function uploadCheck() {
  if (!amount.value || amount.value <= 0) {
    showFailToast('请输入充值金额')
    return false;
  }
  return true;
}

//文件上传
const afterRead = (file) => {
  loading.value = true
  uploadFile(file.file).then(res => {
    if (res.code === 200) {
      let url = res.data;
      recharge(payId.value, amount.value, url).then(res => {
        if (res.code === 200) {
          showSuccessToast('提交成功');
        }
      })
    }
    loading.value = false
  })
};

function gotoRecord() {
  router.push({name: 'userRecord', query: {type: 1}})
}

onMounted(() => {
  getConfig();
})

</script>

<template>
  <div class="main">
    <div @click="gotoRecord" class="recordBox">
      <span>充值记录</span>
    </div>

    <div class="cardBox flex">
      <div style="width: 50px; line-height: 46px; margin-left: 15px; color: #999999; font-size: 14px">
        <span>金额</span>
      </div>
      <van-field style="border-radius: 10px" v-model="amount" type="digit" placeholder="请输入充值金额"/>
    </div>

    <div class="cardBox flex mt-10px">
      <div style="width: 50px; line-height: 46px; margin-left: 15px; color: #999999; font-size: 14px">
        <span>网络</span>
      </div>
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        placeholder="选择充值网络"
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

    <div class="cardBox mt-10px pt-15px pb-15px">
      <div class="flex items-center justify-center">
        <img style="height: 30px; width: 30px" :src="usdt" alt="">
        <div>
          <span>USDT</span>
        </div>
      </div>

      <div class="flex justify-center mt-10px">
        <div class="qrCodeBox">
          <qrcode-vue :value="address" :size="165"/>
        </div>
      </div>
    </div>

    <div class="cardBox flex mt-10px">
      <div style="width: 50px; line-height: 46px; margin-left: 15px; color: #999999; font-size: 14px">
        <span>地址</span>
      </div>
      <van-field style="border-radius: 10px; padding: 10px 10px 0 0; " v-model="address">
        <template #button>
          <div class="flex" @click="addressCopy">
            <img style="height: 20px; width: 20px; display: inline-block; " :src="copy" alt="">
          </div>
        </template>
      </van-field>
    </div>

    <div class="bottomBox">
      <van-uploader @click-upload="uploadCheck" :readonly="!amount" :after-read="afterRead" :max-count="1">
        <van-button style="width: 80vw; height: 42px;" round block type="primary" :loading="loading"
                    color="linear-gradient(-61deg, #4C93FF, #2964E6)" native-type="submit">
          已转账，上传截图
        </van-button>
      </van-uploader>

    </div>

    <div class="text-14px mt-10px">
      <span>注意</span>
    </div>
    <div class="text-12px text-#999999">
      <p>
        1.此地址仅可转入USDT-{{ fieldValue }}资产，转入其他资产无法找回
      </p>
      <p>
        2.请勿上传虚假的充值截图，一经查实，平台将予以处罚
      </p>
    </div>
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
  width: 100vw;
  padding: 10px;
  background-color: #FFFFFF;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>

<route lang="json">
{
"name": "recharge",
"meta": {
"title": "充值"
}
}
</route>