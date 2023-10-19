<template>
    <div class="footer-container" v-if="playStatus">
        <van-floating-bubble axis="lock" :icon="img" magnetic="x" @click="handleClick" class="footer-button"
            v-model:offset="offset" />
        <div v-show="showHalfcir">
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
const XFSTATICTIME = 5000 //讯飞静默时间 ms

const offset = ref({ x: -1, y: 300 });
// 获取全局的 vue 实例
const instance = getCurrentInstance();
// let times: any = null

const playStatus = ref(true)
instance?.proxy?.$Bus.on('display', () => {
    playStatus.value = true
})
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

const iatRecorder = new IatRecorder('en_us', 'mandarin', '1190c8d0', XFSTATICTIME)
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
        // await instance?.proxy?.$Bus.emit('dataList', { data: '...', status: true })
        await instance?.proxy?.$Bus.emit('dataList', { status: true })

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
            await instance?.proxy?.$Bus.emit('dataList', { data: content.value, status: false })
        }
    } else {
        console.log('关闭录音');
        iatRecorder.stop()
        playStatus.value = false
        clearStatus()
        instance?.proxy?.$Bus.emit('ended')
    }
}
iatRecorder.onWillStatusChange = function (oldStatus: string, newStatus: string) {
    if (newStatus == 'ing') {
        countTime()
    } else if (newStatus == 'end') {
        console.log('清空状态');
        showHalfcir.value = false
        // iatRecorder.stop()
        clearStatus()
        // instance?.proxy?.$Bus.emit('dataList', { data: content.value, status: false })
        // instance?.proxy?.$Bus.off('dataList')
    }
}
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
<style  lang="scss">
@import './index.scss';
</style>