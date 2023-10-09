<template>
    <div class="footer-container">
        <van-floating-bubble axis="lock" :icon="img" magnetic="x" @click="handleClick" class="footer-button"
            v-model:offset="offset" />
        <div v-show="showHalfcir">
            <!-- <div class="footer-input">
                <div class="input-inner">{{ content }}</div>
            </div> -->
            <van-circle :rate="rate" :speed="100" v-model:current-rate="currentRate" :stroke-width="70"
                start-position="bottom" class="circle">
            </van-circle>
        </div>
    </div>
</template>

<script setup lang='ts'>
import * as apis from '../api'
import { listProps, showNotify } from 'vant';
import { getCurrentInstance } from 'vue'
import img from '@/assets/image/voice.png'


let timer: any = ref(null);
let countTimer: any = ref(null)
const content = ref('')
import IatRecorder from '@/utils/IatRecorder'

const resultText = ref('')
const resultTextTemp = ref('')
const videoData: any = ref([])    //音频数据
const data: any = ref('') // 转码后的数据
const showHalfcir = ref(false)
const rate = ref(0)
const currentRate = ref(0)
const buttonType = ref<string>('primary')

const offset = ref({ x: -1, y: 300 });
// 获取全局的 vue 实例
const instance = getCurrentInstance();
// let times: any = null

// 计时器
const countTime = () => {
    countTimer.value = setInterval(() => {
        if (rate.value > 100) clearInterval(countTimer.value)
        // ＞3s 无录音 停止链接
        // if (rate.value > 5 && !content.value) {
        //     iatRecorder.stop()
        //     clearStatus()
        // }
        rate.value += 1.67
    }, 1000)
}

const iatRecorder = new IatRecorder('en_us', 'mandarin', '1190c8d0')
const handleClick = async () => {
    // websocketUrl.value = await apis.getWebsocketUrl() ?? ''
    // if (!websocketUrl.value) {
    //     showNotify({ type: 'warning', message: '获取websocket连接失败,请重试' });
    //     return
    // }
    showHalfcir.value = !showHalfcir.value
    if (showHalfcir.value) {
        buttonType.value = 'success'
        iatRecorder.start();
        // 发布状态 - 区别消息
        await instance?.proxy?.$Bus.emit('dataList', { data: '...', status: true })

        iatRecorder.onTextChange = async (text: string) => {
            // 3秒钟内没有说话，就自动关闭
            // if (text) {
            //     clearTimeout(times);
            //     times = setTimeout(() => {
            //         iatRecorder.stop()
            //     }, 3000);
            // };
            // let inputText = text
            // content.value = inputText.substring(0, inputText.length - 1);//文字处理
            content.value = text
            console.log("🚀 ~ file: countDown.vue:80 ~ content.value:", content.value)
            await instance?.proxy?.$Bus.emit('dataList', { data: content.value, status: false })
        }
    } else {
        instance?.proxy?.$Bus.emit('ended')
        iatRecorder.stop()
        clearStatus()
    }
}
iatRecorder.onWillStatusChange = function (oldStatus: string, newStatus: string) {
    if (newStatus == 'ing') {
        countTime()
    } else if (newStatus == 'end') {
        console.log('清空状态');
        // instance?.proxy?.$Bus.emit('dataList', content.value)
        showHalfcir.value = false
        console.log(newStatus, '结束连接');
        // iatRecorder.stop()
        clearStatus()
        // instance?.proxy?.$Bus.off('dataList')
    }
}
// const handleShow = () => {
//     showHalfcir.value = false
//     clearStatus()
// }
// 清空状态
const clearStatus = () => {
    clearInterval(timer.value)
    clearInterval(countTimer.value)
    rate.value = 0
    content.value = ''
    resultText.value = ''
    resultTextTemp.value = ''
    videoData.value = []
    data.value = []
    showHalfcir.value = false
    buttonType.value = 'primary'
}

</script>
<style scoped lang="scss">
.footer-container {
    .footer-button {
        // z-index: 999999;
        // width: 60px;
        // height: 60px;
        // position: relative;
        // width: var(--van-floating-bubble-size);
        // height: var(--van-floating-bubble-size);
    }

    .circle {
        position: absolute;
        left: 79.8vw;
        bottom: 47.3vh;
        // margin-bottom: 14px;
        width: 66px;
        height: 66px;
    }

    .footer-input {
        position: absolute;
        bottom: 160px;
        left: 125px;
        width: 200px;
        // height: 60px;
        // background-color: #fff;
        text-align: center;

        .input-inner {
            min-height: 20px;
            padding: 8px 10px;
            background-color: #fff;
            word-wrap: break-word;
            word-break: break-all;
        }
    }
}


::v-deep(.van-icon__image) {
    font-size: 30px;
    text-align: center;
}
</style>