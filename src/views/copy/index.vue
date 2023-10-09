<template>
    <div class="header-container">
        <div class="container-img">
            <video ref="videoRef" class="picture" autoplay></video>
        </div>
    </div>
</template>
  
<script setup lang='ts'>
import flvjs from 'flv.js'
const videoRef = ref()
let flvplayer: any
// const URL = 'http://192.168.110.181//live?app=demo&stream=test'
// const URL = 'http://localhost:8080'

const initWebSocket = () => {
    flvplayer = flvjs.createPlayer({
        type: 'flv',
        isLive: true, // 是否是直播流
        url: URL,
    }, { autoCleanupSourceBuffer: true })
    flvplayer.attachMediaElement(videoRef.value)
    flvplayer.load()
    flvplayer.play()
}

onMounted(() => {
    initWebSocket()
})
</script>
<style scoped>
.container-img {
    height: 100%;
    width: 100vw;

    .picture {
        width: 100%;
        height: 100%;
    }

    .pictureTwo {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>