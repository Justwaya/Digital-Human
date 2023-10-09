<template>
    <div class="container-img">
        <!-- <video ref="videoRef" class="picture" autoplay @pause="pause"></video> -->
        <video ref="videoRef2" class="pictureTwo" autoplay @pause="pause"></video>
    </div>
</template>
  
<script setup lang='ts'>
import flvjs from 'flv.js'
const videoRef = ref()
const videoRef2 = ref()
let flvplayer: any
let ws: any

const videoArray = ref([])
const status = ref(false)
const videoShow = ref(true)
const instance = getCurrentInstance();
const messageNum = ref()

const initWebSocket = () => {
    ws = new WebSocket('ws://192.168.110.172:5656')
    ws.onopen = () => {
        console.log('连接成功')
    }
    ws.onmessage = async (e) => {
        const blob = new Blob([e.data], { type: 'video/flv' });
        const videoURL = URL.createObjectURL(blob)

        if (!flvplayer) {
            flvplayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true, // 是否是直播流
                url: videoURL,
            }, { autoCleanupSourceBuffer: true })
            flvplayer.attachMediaElement(videoRef2.value)
            // flvplayer.attachMediaElement(videoRef.value)
            flvplayer.load()
            videoRef2.value.playbackRate = 0.75
            flvplayer.play()
            // videoRef.value.currentTime = videoRef.value.duration;
        } else {
            videoArray.value.push(videoURL)
            if (status.value) {
                pause()
                status.value = false
            }
        }
        if (messageNum.value && messageNum.value >= 0) {
            messageNum.value -= 1
        }
    }
}
watch(messageNum, (newVal) => {
    // console.log('videoRef2.value.duration', videoRef2.value);
    if (newVal == 0) {
        setTimeout(() => {
            instance?.proxy?.$Bus.emit('display')
        }, videoRef2.value.duration * 1000)
    }
})

const pause = () => {
    if (videoArray.value.length == 0) {
        status.value = true
        return false
    }
    flvplayer.pause()
    flvplayer = null
    flvplayer = flvjs.createPlayer({
        type: 'flv',
        isLive: false, // 是否是直播流
        url: videoArray.value.shift() || '',
    }, { autoCleanupSourceBuffer: true })
    // if (videoShow.value) {
    flvplayer.attachMediaElement(videoRef2.value)
    // } else {
    // flvplayer.attachMediaElement(videoRef.value)
    // }
    // videoRef.value.playbackRate = 2
    flvplayer.load()
    videoRef2.value.playbackRate = 0.75
    flvplayer.play()
}
instance?.proxy?.$Bus.on('sendNum', (data: any) => {
    if (data) {
        messageNum.value = data
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

    /* background-color: skyblue; */
    .picture {
        /* width: 100%; */
        height: 100vh;
        /* width: 100vw; */
    }

    .pictureTwo {
        /* width: 100%; */
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>