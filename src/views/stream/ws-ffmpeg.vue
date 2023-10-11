<template>
    <div class="container-img">
        <video ref="videoRef" class="pictureTwo" autoplay></video>

    </div>
</template>
  
<script setup lang='ts'>
import { FFmpeg } from '@ffmpeg/ffmpeg'
const videoRef = ref()
let ws: any

const videoArray = ref<Array<string>>([])
const instance = getCurrentInstance();
const messageNum = ref()
let ffmpeg: any = null


const initWebSocket = () => {
    // ws = new WebSocket('ws://192.168.110.172:5656')
    ws.onopen = async () => {
        console.log('连接成功')
        ffmpeg = new FFmpeg()
        console.log("🚀 ~ file: videoStream.vue:20 ~ ffmpeg:", ffmpeg)
        await ffmpeg.load();
    }
    ws.onmessage = async (e) => {
        const newData = new Uint8Array(e.data);
        ffmpeg.writeFile(
            "input.flv",
            newData
        );
        console.log(11111111111);
        // 执行 FFmpeg 命令行工具, 把 AVI 转码为 MP4
        await ffmpeg.exec("-i", "input.flv", "output.mp4");
        // 把 MP4 文件从 FFmpeg 文件系统中取出
        const output = ffmpeg.readFile("output.mp4");
        console.log("🚀 ~ file: videoStream.vue:37 ~ output:", output)
        videoRef.value.src = URL.createObjectURL(new Blob([output.buffer], { type: "video/mp4" }));
    }
}

watch(messageNum, (newVal) => {
    if (newVal == 0) {
        setTimeout(() => {
            instance?.proxy?.$Bus.emit('display')
        }, videoRef.value.duration * 1000)
    }
})
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