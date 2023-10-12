<template>
    <div class="main-container" ref="mainRef">
        <div class="admin adminInit">
            <div class="admin-avator">
                <van-image fit="fill"
                    src="https://c-ssl.dtstatic.com/uploads/blog/202207/09/20220709150824_97667.thumb.400_0.jpg"
                    class="image" />
            </div>
            <div class="admin-text">{{ initText }}</div>
        </div>
        <div v-for="(item, index) in  list " :key="index" ref="listRef" class="main-container-inner">
            <div class="admin">
                <div class="admin-avator">
                    <van-image fit="fill" :src="item.imgURL" class="image" />
                </div>
                <div class="admin-text">{{ item.info }}</div>
                <div v-if="item.role == 'AI'"><van-button type="danger" icon="close" @click="handleStop"></van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getCurrentInstance } from 'vue'

const listRef = ref()
const mainRef = ref()
let ws: any = null
const list = ref<any>([])
const instance = getCurrentInstance()
let dataList = ref()
const initText = ref('您好，我是天星科技的AI助手小星')
// const isUserLive = ref(false)
// const isAILeave = ref(false)
const clearTextTime = 3000  //3s
let userTimer: any
let aiTimer: any
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
    // ws = new WebSocket('ws://localhost:8080')    //临时
    ws.onopen = () => {
        console.log('文本 websocket 连接成功')
        // sendMassage('虞美人 · 粉融红腻莲房绽')    //临时 
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
onBeforeUnmount(() => {
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

    .adminInit {
        padding: 0 8px;
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