<script setup lang="ts">
import {bindingEmail, captcha, sendSmsCode} from "@/api/csAuth";
import {showSuccessToast} from "vant";
import router from "@/router";

const {t} = useI18n()

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
  sendSmsCode(email.value, verifyData.value.uuid, verifyCode.value).then(res => {
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

function affirmEmail() {
  if (!email.value) {
    showFailToast(t('user.emailNot'));
    return;
  }
  if (!code.value) {
    showFailToast(t('user.codeNot'));
    return;
  }
  bindingEmail(email.value, code.value).then(res => {
    if (res.code === 200) {
      showSuccessToast(t('common.boundSuc'))
      router.push({name: 'safety'})
    }
  })
}
</script>

<template>
  <div class="main">
    <div>
      <van-form label-align="top">
        <van-cell-group inset>
          <van-field
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
          <van-button @click="affirmEmail" color="linear-gradient(-61deg, #4C93FF, #2964E6)" round block
                      type="primary"
                      native-type="submit">
            {{ t('common.bound') }}
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
"name": "bindingEmail",
"meta": {
"title": "",
"i18n": "menus.bindingEmail"
}
}
</route>