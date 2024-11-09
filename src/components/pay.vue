<script setup lang="ts">
import {defineEmits, toRefs} from 'vue'
import {Encrypt} from "@/utils/secret";
import {fundPayByBalance, userOpenManager, withdrawConfirm} from "@/api/csPay";
import {showSuccessToast} from "vant";
import {getUserId} from "@/utils/auth";
import router from "@/router";

const {t} = useI18n()

const password = ref('');
const showKeyboard = ref(true);
const title = ref('');

watch(password, (newVal) => {
  if (newVal.length === 6) {
    let userId = getUserId();
    let encrypt = Encrypt(password.value, userId);
    if (type.value === 1) {
      //余额支付
      fundPayByBalance(payToken.value, encrypt).then(res => {
        if (payResult(res)) {
          showSuccessToast(t('pay.paySuccess'));
          router.push({name: 'invest'})
        }
      })
    } else if (type.value === 2) {
      //提现支付
      withdrawConfirm(payToken.value, encrypt).then(res => {
        if (payResult(res)) {
          showSuccessToast(t('pay.applySuccess'));
          router.push({name: 'user'})
        }
      })
    } else if (type.value === 3) {
      userOpenManager(encrypt).then(res => {
        if (payResult(res)) {
          showSuccessToast(t('pay.applySuccess'));
          router.push({name: 'invite'})
        }
      })
    }
  }
});

function payResult(res) {
  if (res.code === 200) {
    emit('payClose', false)
    return true;
  } else {
    if (res.code === 806) {
      password.value = ''
    } else {
      emit('payClose', false)
    }
    return false;
  }
}

const props = defineProps({
  //子组件接收父组件传递过来的值
  payShow: Boolean,
  type: Number,
  amount: String,
  payToken: String
})
//使用父组件传递过来的值
const {payShow, type, amount, payToken} = toRefs(props)

watch(() => props.type, (newValue) => {
  if (newValue === 1) {
    title.value = t('pay.fundApply')
  } else if (newValue === 2) {
    title.value = t('pay.withdrawBalance')
  } else if (newValue === 3) {
    title.value = t('pay.openManager')
  }
}, {immediate: true, deep: true})

const emit = defineEmits(['payClose'])
const payClose = () => {
  password.value = ''
  //传递给父组件
  emit('payClose', false)
}
</script>

<template>
  <div class="payCom">
    <van-action-sheet @cancel="payClose" v-model:show="payShow" :close-on-click-overlay="false" :title="title">
      <div style="min-height: 390px">
        <div class="title text-center text-26px mb-20px">
          <div><span>{{ amount }}USD</span></div>
        </div>
        <!--<van-divider/>-->
        <!-- 密码输入框 -->
        <van-password-input
          :value="password"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
        />
        <!-- 数字键盘 -->
        <van-number-keyboard
          :hide-on-click-outside="false"
          v-model="password"
          :show="showKeyboard"
          @blur="showKeyboard = false"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<style scoped lang="less">

</style>