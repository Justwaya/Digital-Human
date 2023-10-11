<template>
    <div class="container-img">
        <!-- <video ref="videoRef" class="pictureTwo" autoplay></video> -->
        <video class="artplayer-app"></video>
    </div>
</template>
  
<script setup lang='ts'>
import Artplayer from "artplayer";
import flvjs from 'flv.js'

const videoURL = ref('')
const art = new Artplayer({
    container: '.artplayer-app',
    url: videoURL.value
    customType: {
        flv: function (video, url)
    }
})

const videoRef = ref()
let ws: any

const videoArray = ref<Array<string>>([])
const instance = getCurrentInstance();
const messageNum = ref()
const videoDataBuffer = ref([]);



const initWebSocket = () => {
    ws = new WebSocket('ws://192.168.110.172:5656')
    ws.onopen = () => {
        console.log('连接成功')
    }
    ws.onmessage = async (e) => {
        const blob = new Blob([e.data], { type: 'video/flv' });
        videoURL.value = URL.createObjectURL(blob)
    }
}
instance?.proxy?.$Bus.on('sendNum', (data: any) => {
    if (data) {
        messageNum.value = data
    }
})
watch(messageNum, (newVal) => {
    if (newVal == 0) {
        setTimeout(() => {
            instance?.proxy?.$Bus.emit('display')
        }, videoRef.value.duration * 1000)
    }
})
onBeforeUnmount(() => {
    console.log('关闭websocket');
    if (ws && ws.readyState == WebSocket.OPEN) {
        ws.close()
    }
    videoArray.value.length = 0
})
onMounted(() => {
    initWebSocket()
})
</script>
<style scoped>
.container-img {
    .artplayer-app {
        /* width: 100%; */
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>