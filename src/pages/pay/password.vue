<script setup lang="ts">
import {showFailToast, showSuccessToast} from "vant";
import {captcha, sendSmsUser} from "@/api/csAuth";
import {getUserEmail, setWalletPwd, updateWalletPwd} from "@/api/csUser";
import {Encrypt} from "@/utils/secret";
import {getUserId} from "@/utils/auth";
import router from "@/router";

const {t} = useI18n()

const setPwd = ref(false);
const value = ref('');
const info = ref(t('common.setPayPwd'));
const showKeyboard = ref(true);
const errorInfo = ref('');
const password = ref('');
const type = ref(undefined);

const sendCodeStr = ref(t('user.sendCode'));
const countDown = ref(null);
const code = ref('');
const email = ref('');

const sendTime = ref(true);
//人机验证弹窗
const verifyShow = ref(false);
//人机验证弹窗
const verifyData = ref(null);
const verifyCode = ref('');

const verify = () => {
  if (!email.value) {
    showFailToast(t('user.emailNot'));
    return;
  }
  verifyCode.value = ''
  captcha().then(res => {
    if (res.code === 200) {
      verifyShow.value = true;
      verifyData.value = res.data
    }
  })
};

const sendCode = () => {
  sendSmsUser(verifyData.value.uuid, verifyCode.value).then(res => {
    if (res.code === 200) {
      sendTime.value = false;
      countDown.value.start();
      showSuccessToast(t('common.sendSuccess'))
    }
  })
};

const onFinish = () => {
  sendTime.value = true;
  countDown.value.reset();
  sendCodeStr.value = t('common.resend')
};

watch(value, (newVal) => {
  if (newVal.length === 6) {
    if (password.value) {
      if (newVal !== password.value) {
        showFailToast(t('common.passwordTowErr'));
        info.value = t('common.setPayPwd')
        password.value = ''
        value.value = ''
      } else {
        let userId = getUserId();
        let encrypt = Encrypt(password.value, userId);
        if (setPwd.value) {
          setWalletPwd(encrypt).then(res => {
            if (res.code === 200) {
              showSuccessToast(t('common.setSuc'));
              retreat();
            } else {
              info.value = t('common.setPayPwd')
              password.value = ''
              value.value = ''
            }
          })
        } else {
          updateWalletPwd(code.value, encrypt).then(res => {
            if (res.code === 200) {
              showSuccessToast(t('common.updateSuc'));
              retreat();
            } else {
              type.value = 2
              code.value = ''
              password.value = ''
              value.value = ''
            }
          })
        }
      }
    } else {
      info.value = t('common.affPayPwd')
      password.value = newVal
      value.value = ''
    }
  }
});

function retreat() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

function verifyEmail() {
  if (!code.value) {
    showFailToast(t('user.codeNot'));
    return;
  }
  type.value = 1
  info.value = t('user.payPwdNot')
}

onMounted(() => {
  getUserEmail().then(res => {
    if (res.code === 200) {
      if (res.data) {
        setPwd.value = false
        type.value = 2
        email.value = res.data
      } else {
        setPwd.value = true
        type.value = 1
      }
    }
  })
})

</script>

<template>
  <div class="main">
    <div v-if="type === 1">
      <div style="text-align: center; margin-bottom: 20px; margin-top: 20vh">
        <span>{{ info }}</span>
      </div>
      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        :info="t('user.passwordSix')"
        :error-info="errorInfo"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard
        :hide-on-click-outside="false"
        v-model="value"
        :show="showKeyboard"
        @blur="showKeyboard = false"
      />
    </div>
    <div v-else-if="type === 2">
      <div style="text-align: center; margin-bottom: 20px; margin-top: 20vh">
        <span>{{ t('common.updatePayPwd') }}</span>
      </div>
      <van-form label-align="top">
        <van-cell-group inset>
          <van-field
            readonly
            v-model="email"
            :placeholder="t('user.emailNot')"
          />
          <van-field
            v-model="code"
            type="number"
            center
            clearable
            :placeholder="t('user.codeNot')"
          >
            <template #button>
              <van-button @click="verify" size="small" round plain hairline type="primary">
                <span v-show="sendTime">{{ sendCodeStr }}</span>
                <van-count-down v-show="!sendTime" :time="60000" ref="countDown" :auto-start="false"
                                @finish="onFinish" format="ss"/>
              </van-button>
            </template>
          </van-field>
        </van-cell-group>

        <div style="margin: 16px;">
          <van-button @click="verifyEmail" color="linear-gradient(-61deg, #4C93FF, #2964E6)" round block
                      type="primary"
                      native-type="submit">
            {{ t('common.apply') }}
          </van-button>
        </div>
      </van-form>
    </div>

    <van-dialog v-model:show="verifyShow" @confirm="sendCode" :title="t('common.machineVerify')" show-cancel-button>
      <div class="verifyBox">
        <img height="50px" :src="'data:image/png;base64,' + verifyData.img" alt="">
        <van-icon @click="verify" class="vReplay" name="replay"/>
      </div>
      <div>
        <van-field style="font-size: 17px;" v-model="verifyCode" type="digit" :placeholder="t('user.codeNot')"/>
      </div>
    </van-dialog>
  </div>

</template>

<style scoped lang="less">
.verifyBox {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.vReplay {
  position: absolute;
  right: 50px;
  font-size: 25px;
  top: 19px;
}
</style>
<route lang="json">
{
"name": "payPassword",
"meta": {
"title": "",
"i18n": "menus.payPassword"
}
}
</route>