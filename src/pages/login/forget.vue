<script setup lang="ts">
import router from "@/router";
import {Encrypt} from "@/utils/secret";
import {captcha, forgetPassword, sendSmsCode} from "@/api/csAuth";
import {showSuccessToast} from "vant";
import {langFormat, OFFICIAL_WEBSITE} from "@/stores/mutation-type";
import {locale} from "@/utils/i18n";

const {t} = useI18n()

const account = ref('');
const password = ref('');
const code = ref('');
const sendCodeStr = ref(t('user.sendCode'));
const countDown = ref(null);
const checked = ref(false);

const sendTime = ref(true);
//人机验证弹窗
const verifyShow = ref(false);
//人机验证弹窗
const verifyData = ref(null);
const verifyCode = ref('');

const verify = () => {
  if (!account.value) {
    showToast(t('user.accountNot'));
    return;
  }
  if (!checked.value) {
    showToast(t('common.privacy'));
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
  //发送验证码
  sendSmsCode(account.value, verifyData.value.uuid, verifyCode.value).then(res => {
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

function retreat() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

function resetPassword() {
  if (!account.value) {
    showToast(t('user.emailNot'));
    return;
  }
  if (!code.value) {
    showToast(t('user.codeNot'));
    return;
  }
  if (!password.value) {
    showToast(t('user.newPwdNot'));
    return;
  }
  if (!checked.value) {
    showToast(t('common.privacy'));
    return;
  }
  let encrypt = Encrypt(password.value, '');
  forgetPassword(account.value, code.value, encrypt).then(res => {
    if (res.code === 200) {
      showSuccessToast(t('common.resetSuccess'))
      router.push({name: 'login'})
    }
  })
}

function gotoPrivacy() {
  window.location.href = OFFICIAL_WEBSITE + "/privacy/" + langFormat(locale.value) + ".html"
}

</script>

<template>
  <div class="main">
    <div class="text-#FFFFFF text-26px">
      <div @click="retreat" class="mb-25px">
        <van-icon name="cross"/>
      </div>
      <div class="mb-10px">
        <span>{{ t('user.hello') }}</span>
      </div>
      <div>
        <span>{{ t('user.welcome') }}</span>
      </div>
    </div>
    <div class="logBox mt-20px">
      <div class="titleBox">
        <span>{{ t('user.resetPwd') }}</span>
      </div>
      <van-form label-align="top">
        <van-cell-group inset>
          <van-field
            v-model="account"
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
          <van-field
            v-model="password"
            type="password"
            :placeholder="t('user.newPwdNot')"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button @click="resetPassword" color="linear-gradient(-61deg, #4C93FF, #2964E6)" round block
                      type="primary"
                      native-type="submit">
            {{ t('user.reset') }}
          </van-button>
        </div>
      </van-form>

    </div>

    <van-dialog v-model:show="verifyShow" @confirm="sendCode" :title="t('common.machineVerify')" show-cancel-button>
      <div class="verifyBox">
        <img :src="'data:image/png;base64,' + verifyData.img" alt="">
        <van-icon @click="verify" class="vReplay" name="replay"/>
      </div>
      <div>
        <van-field v-model="verifyCode" type="digit" :placeholder="t('user.codeNot')"/>
      </div>
    </van-dialog>

    <div class="deal">
      <div style="display: flex; justify-content: center;">
        <van-checkbox icon-size="16px" shape="square" v-model="checked">
          <span class="text-#FFFFFF text-14px">{{ t('common.readAgree') }}</span>
        </van-checkbox>
        <span @click="gotoPrivacy" class="text-#71E3D6 text-14px">{{ t('user.privacy') }}</span>
      </div>
    </div>
  </div>

</template>

<style scoped lang="less">
.main {
  height: 100vh;
  background: url("/bj-login.png") no-repeat 100%;
  background-size: cover;
  padding: 15px;

  .logBox {
    height: 310px;
    background-color: #FFFFFF;
    border-radius: 10px;
    box-shadow: 0 1px 32px 0 rgba(29, 52, 155, 0.4);
  }

  //样式穿透
  :deep(.van-tabs__wrap) {
    border-radius: 10px;
  }

  :deep(.van-field__body) {
    border-radius: 10px;
    background-color: #F6F8FA;
    height: 40px;
    padding: 10px;
  }

  .deal {
    position: absolute;
    bottom: 13px;
    left: 0;
    width: 100%;
  }

  .verifyBox {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .vReplay {
    position: absolute;
    right: 35px;
    font-size: 33px;
    top: 20px;
  }

  .titleBox {
    height: 50px;
    color: #FFFFFF;
    text-align: center;
    font-size: 18px;
    line-height: 50px;
    border-radius: 10px 10px 0 0;
    background-color: #2A73ED;
  }

}

</style>

<route lang="json">
{
"name": "forget",
"meta": {
"i18n": "menus.login"
}
}
</route>