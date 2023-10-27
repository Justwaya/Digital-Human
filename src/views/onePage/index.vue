<template>
    <div class="container" ref="containRef">
        <div class="head">
            <div class="head-text">
                <div class="date">{{ currentDate }}</div>
                <div class="imgContent">
                    mimic
                    <img src="@/assets/image/smail.png" alt="img" @click="fullScreen">
                </div>
            </div>
        </div>
        <VideoStream ref="videoStreamRef" />
        <!-- <div class="word">
            <div class="admin-text">{{ initText }}</div>
        </div> -->
        <main class="main">
            <div class="main-inner">
                <div class="main-container" ref="mainRef">
                    <div v-for="(item, index) in  list " :key="index" ref="listRef" class="main-container-inner"
                        :class="item.role == 'USER' ? 'user' : 'ai'">
                        <div class="admin">
                            <div v-if="item.role == 'AI'" class="ai-content">
                                <div class="test">AI生成</div>
                                <div class="content" @click="handleStop">停止回答</div>
                            </div>
                            <div class="line"></div>
                            <div class="admin-text">{{ item.info }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <CountDown />
    </div>
</template>

<script setup lang='ts'>
import VideoStream from './componment/Stream/videoStream.vue';
import currentTime from '@/utils/currentTime'
import CountDown from './componment/XunFiVoice/countDown.vue'
import { getCurrentInstance } from 'vue'

const listRef = ref()
const mainRef = ref()
let ws: any = null
const list = ref<any>([
    { info: '11111111111', role: 'USER' },
    { info: '2222222222', role: 'AI' },
    { info: '11111111111', role: 'USER' },
    { info: '2222222222', role: 'AI' },
    { info: '11111111111', role: 'USER' },
    { info: '2222222222', role: 'AI' },
    { info: '11111111111', role: 'USER' },
    { info: '2222222222', role: 'AI' },
    { info: '11111111111', role: 'USER' },
    { info: '2222222222', role: 'AI' },

])
const instance = getCurrentInstance()
let dataList = ref()
// const initText = ref('您好，我是AI助手小星')
// const isUserLive = ref(false)
// const isAILeave = ref(false)
const clearTextTime = 3000  //3s
let userTimer: any
let aiTimer: any
const videoStreamRef = ref()

interface listType {
    role: string,
    info: string,
    imgURL: string
}
// 收集用户消息
instance?.proxy?.$Bus.on('dataList', (res: any) => {
    const { data = '', status } = res
    if (data) {
        if (list.value.at(-1)?.role === 'USER' && !status) {
            list.value.at(-1).info = data
        } else {
            list.value.push({ info: data, role: 'USER', imgURL: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' })
        }
        // isAILeave.value = false
    }
})
// AI 文本框消失
instance?.proxy?.$Bus.on('display', () => {
    // isAILeave.value = true
    clearTimeout(aiTimer)
    aiTimer = setTimeout(() => {
        list.value.length > 2 ?
            list.value.shift() : clearTimeout(aiTimer)
    }, clearTextTime)
})
// 用户 发送消息
instance?.proxy?.$Bus.on('ended', () => {
    clearTimeout(userTimer)
    const data = list.value.filter((item: listType) => item.role === 'USER')
    console.log("🚀 ~ file: index.vue:83 ~ data:", data)
    if (data && data.length > 0)
        sendMassage(data.at(-1).info)
    // isUserLive.value = true
    // 3s后 删除用户消息
    if (list.value.length > 2) {
        userTimer = setTimeout(() => {
            // list.value = list.value.filter((item: listType) => item.info != data.at(-1).info)
            list.value.shift()
        }, clearTextTime)
    }

})
const initWebsocket = () => {
    ws = new WebSocket('ws://192.168.110.172:6949')
    ws.onopen = () => {
        console.log('文本 websocket 连接成功')
        sendMassage('请详细介绍一下天津')    //临时 
    }
    ws.onmessage = (e) => {
        if (dataList.value) {
            list.value.at(-1).info += e.data
        } else {
            dataList.value = e.data
            list.value.push({ info: dataList.value, role: 'AI', imgURL: 'https://c-ssl.dtstatic.com/uploads/blog/202207/09/20220709150824_97667.thumb.400_0.jpg' })
        }
    }
}

const sendMassage = (data: string) => {

    ws.send(JSON.stringify(data))
    dataList.value = ''
}

const handleStop = () => {
    ws.send("stop")//结束帧
    videoStreamRef.value.stopConmunite()
}

watch(() => list.value,
    (newVal) => {
        // 自动滚动至底部
        nextTick(() => {
            if (newVal.length > 0) {
                listRef.value[newVal.length - 1]?.scrollIntoView();
            }
        })
    }, { deep: true }
)

/** 全屏 */
const containRef = ref()
const isScreent = ref(true)
const fullScreen = () => {
    console.log(isScreent.value);
    if (isScreent.value) {
        containRef.value.requestFullscreen()
        isScreent.value = !isScreent.value
    } else {
        containRef.value.exitFullscreen()
    }
}

let timer: any = null
onBeforeUnmount(() => {
    if (ws && ws.readyState == WebSocket.OPEN) {
        ws.close()
    }
    clearInterval(timer)
})

const currentDate = ref()
onMounted(async () => {
    // 页面底部
    mainRef.value.scrollTop = mainRef.value.scrollHeight
    initWebsocket()
    timer = setInterval(() => {
        currentDate.value = currentTime()
    }, 1000)
})

</script>
<style scoped lang="scss">
@import './index.scss';
</style>