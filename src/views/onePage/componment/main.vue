<template>
    <div class="main-container" ref="mainRef">
        <div v-for="(item, index) in  list " :key="index" ref="listRef" class="main-container-inner">
            <!-- <transition
                :class="[(item.role == 'USER' && isUserLive) || (item.role == 'AI' && isAILeave) ? 'animate__animated animate__fadeOut animate__delay-3s' : '']"> -->
            <div class="admin">
                <div class="admin-avator">
                    <van-image fit="fill" :src="item.imgURL" class="image" />
                </div>
                <div class="admin-text">{{ item.info }}</div>
                <div v-if="item.role == 'AI'"><van-button type="danger" icon="close" @click="handleStop"></van-button>
                </div>
            </div>
            <!-- </transition> -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getCurrentInstance } from 'vue'

const listRef = ref()
const mainRef = ref()
let ws: any = null
const list = ref<any>([
    { info: 'hello', role: 'USER', imgURL: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' },
])
const instance = getCurrentInstance()
// const infoData = ref()  //消息存储
let dataList = ref()
const isUserLive = ref(true)
const isAILeave = ref(false)
let messageNum = ref(0) //消息数量
let timer = null

// 订阅用户发送消息
instance?.proxy?.$Bus.on('dataList', (res: any) => {
    const { data, status } = res
    if (data) {
        // list.value.push({ info: data, role: 'USER', imgURL: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' })
        if (list.value.at(-1).role === 'USER' && !status) {
            list.value.at(-1).info = data
        } else {
            list.value.push({ info: data, role: 'USER', imgURL: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' })
        }
        // infoData.value = data
        isAILeave.value = false
    }
})
// 订阅文本框消失时间
instance?.proxy?.$Bus.on('display', () => {
    isAILeave.value = true
})
// 订阅 发送消息
instance?.proxy?.$Bus.on('ended', () => {
    const data = list.value.filter(item => {
        return item.role === 'USER'
    })
    console.log("🚀 ~ file: main.vue:59 ~ data:", data)
    sendMassage(data.at(-1).info)
})
// watch(infoData, (newV) => {
//     sendMassage(newV)
//     console.log('触发播放事件');
//     instance?.proxy?.$Bus.emit('openFlv')
// })
const initWebsocket = () => {
    ws = new WebSocket('ws://192.168.110.172:6949')
    // ws = new WebSocket('ws://localhost:8080')
    ws.onopen = () => {
        console.log('文本 websocket 连接成功')
        sendMassage('自我介绍')    //临时 
    }
    ws.onmessage = (e) => {
        if (dataList.value) {
            list.value.at(-1).info += e.data
        } else {
            dataList.value = e.data
            list.value.push({ info: dataList.value, role: 'AI' })
        }
        messageNum.value += 1
    }
}
const sendMassage = (data: string) => {
    ws.send(JSON.stringify(data))
    dataList.value = ''
}
const handleStop = () => {
    sendMassage("{'stop'}") //结束帧
}
// 自动滚动至底部
watch(() => list.value,
    (newVal) => {
        nextTick(() => {
            listRef.value[newVal.length - 1].scrollIntoView();
        })
    }, { deep: true }
)
// 1s 
watch(messageNum, (newVal, oldValue) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        instance?.proxy?.$Bus.emit('sendNum', messageNum.value)
    }, 1500);

})

onBeforeUnmount(() => {
    console.log('关闭 文字 websocket');
    if (ws && ws.readyState == WebSocket.OPEN) {
        ws.close()
    }
})
onMounted(async () => {
    // 页面底部
    mainRef.value.scrollTop = mainRef.value.scrollHeight
    initWebsocket()
})


</script>
<style scoped lang="scss">
.main-container {
    overflow-y: scroll;
    height: 100%;

    .main-container-inner {
        padding: 0 8px;
        display: flex;
        width: 80%;
        margin: 6px 0;
    }

    .user-container {
        padding: 10px 8px;
        display: flex;
        flex-direction: row-reverse;
    }

    .admin {
        display: flex;
    }

    .admin-avator {
        padding: 0 10px;

        .image {
            width: 40px;
            height: 40px;
        }
    }

    .admin-text {
        // background-color: rgba(240, 240, 240, 0.2);
        padding: 5px 12px;
        line-height: 30px;
        margin: auto 0;
        word-wrap: break-word;
        word-break: break-all;

        // 毛玻璃效果
        background: rgba(255, 255, 255, 0.2);
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
        border-radius: 8px;
    }
}

.van-button {
    width: 30px;
    height: 35px;
    margin-left: 10px;
    opacity: 0.8;
}
</style>