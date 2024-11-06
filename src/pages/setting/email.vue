<script setup lang="ts">
import {bindingEmail, captcha, sendSmsCode} from "@/api/csAuth";
import {showSuccessToast} from "vant";
import router from "@/router";

const sendCodeStr = ref('发送验证码');
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
    showFailToast('请输入邮箱地址');
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
  sendSmsCode(email.value, verifyData.value.uuid, verifyCode.value).then(res => {
    if (res.code === 200) {
      sendTime.value = false;
      countDown.value.start();
      showSuccessToast('发送成功')
    }
  })
};

const onFinish = () => {
  sendTime.value = true;
  countDown.value.reset();
  sendCodeStr.value = "重新发送"
};

function affirmEmail() {
  if (!email.value) {
    showFailToast('请输入邮箱地址');
    return;
  }
  if (!code.value) {
    showFailToast('请输入验证码');
    return;
  }
  bindingEmail(email.value, code.value).then(res => {
    if (res.code === 200) {
      showSuccessToast('绑定成功')
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
            placeholder="请输入邮箱地址"
          />
          <van-field
            v-model="code"
            type="number"
            center
            clearable
            placeholder="请输入验证码"
          >
            <template #button>
              <!--                  <van-button size="small">发送验证码</van-button>-->
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
            绑定
          </van-button>
        </div>
      </van-form>
    </div>


    <van-dialog v-model:show="verifyShow" @confirm="sendCode" title="人机验证" show-cancel-button>
      <div class="verifyBox">
        <img height="50px" :src="'data:image/png;base64,' + verifyData.img" alt="">
        <van-icon @click="verify" class="vReplay" name="replay"/>
      </div>
      <div>
        <van-field style="font-size: 17px;" v-model="verifyCode" type="digit" placeholder="请输入验证码"/>
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
"title": "绑定邮箱"
}
}
</route>