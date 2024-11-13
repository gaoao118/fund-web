<script setup lang="ts">
import psdImg from '~/svg/password.svg'
import router from "@/router";
import {Encrypt} from "@/utils/secret";
import {captcha, sendSmsCode, smsLogin, userLogin} from "@/api/csAuth";
import {setToken} from '@/utils/auth'
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
const onSubmit = (values) => {
  console.log('submit', values);
};

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
  router.push({name: 'user'})
}

function login() {
  if (!account.value) {
    showToast(t('user.accountNot'));
    return;
  }
  if (!password.value) {
    showToast(t('user.passwordNot'));
    return;
  }
  if (!checked.value) {
    showToast(t('common.privacy'));
    return;
  }
  let encrypt = Encrypt(password.value, '');
  userLogin(account.value, encrypt).then(res => {
    if (res.code === 200) {
      setToken(res.data.token, res.data.userId);
      router.push({name: 'user'})
    }
  })
}

function userSmsLogin() {
  if (!account.value) {
    showToast(t('user.accountNot'));
    return;
  }
  if (!code.value) {
    showToast(t('user.codeNot'));
    return;
  }
  smsLogin(account.value, code.value).then(res => {
    if (res.code === 200) {
      setToken(res.data.token, res.data.userId);
      router.push({name: 'user'})
    }
  })
}

function gotoRegister() {
  router.push({name: 'register'})
}

function gotoForget() {
  router.push({name: 'forget'})
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
      <van-tabs>
        <van-tab :title="t('user.pwdLog')">
          <van-form label-align="top" @submit="onSubmit">
            <van-cell-group inset>
              <van-field
                v-model="account"
                :label="t('user.account')"
                :placeholder="t('user.accountNot')"
                left-icon="contact-o"
              />
              <van-field
                v-model="password"
                type="password"
                :label="t('user.password')"
                :placeholder="t('user.passwordNot')"
                :left-icon="psdImg"
              />
            </van-cell-group>
            <div class="flex justify-between text-#666666 text-14px px-19px" style="">
              <div @click="gotoRegister"><span>{{ t('user.register') }}</span></div>
              <div @click="gotoForget"><span>{{ t('user.forgetPwd') }}</span></div>
            </div>
            <div style="margin: 16px;">
              <van-button @click="login" round block type="primary" color="linear-gradient(-61deg, #4C93FF, #2964E6)"
                          native-type="submit">
                {{ t('user.login') }}
              </van-button>
            </div>
          </van-form>
        </van-tab>
        <van-tab :title="t('user.emailLogin')">
          <van-form label-align="top" @submit="onSubmit">
            <van-cell-group inset>
              <van-field
                v-model="account"
                :label="t('login.email')"
                :placeholder="t('login.pleaseEnterEmail')"
                left-icon="contact-o"
              />
              <van-field
                v-model="code"
                type="number"
                center
                clearable
                left-icon="passed"
                :label="t('user.code')"
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
            <div class="flex justify-between text-#666666 text-14px px-19px" style="">
              <div @click="gotoRegister"><span>{{ t('user.register') }}</span></div>
              <div @click="gotoForget"><span>{{ t('user.forgetPwd') }}</span></div>
            </div>
            <div style="margin: 16px;">
              <van-button @click="userSmsLogin" round block type="primary"
                          color="linear-gradient(-61deg, #4C93FF, #2964E6)" native-type="submit">
                {{ t('user.login') }}
              </van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
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
      <div style="width: 100%; display: flex; justify-content: center;">
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
    height: 320px;
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

}

</style>

<route lang="json">
{
"name": "login",
"meta": {
"i18n": "menus.login"
}
}
</route>