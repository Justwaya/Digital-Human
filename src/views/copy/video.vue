<template>
    <div class="header-container">
        <div class="container-text">
            讯飞语音转换
        </div>
        <div class="container-img">
            <img :src="arr" class="picture">
            <!-- <img :src="imgData" class="picture"> -->
            <!-- <audio ref="audioRef"  :src="audioData" autoplay></audio> -->
            <audio ref="audioRef" autoplay></audio>
        </div>
    </div>
</template>

<script setup lang='ts'>
let ws: any;
const audioRef = ref()
const audioDataArray = ref<any>([])
// const currentAudioIndex = ref(0)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const audioData = ref('')

const images = ref<any>([])
let arr = ref('')


const start = ref(false)

watch(start, (newa) => {
    if (newa) {
        bagin()
    }
})
// watch(audioDataArray.value, () => {
//     filterData()
// })

const timers = ref()
function bagin() {
    timers.value = setInterval(() => {
        if (images.value.length > 0) {
            let newArr = images.value.splice(0, 1)
            arr.value = newArr[0]
        }
    }, 40)
}

function initWebSocket() {
    ws = new WebSocket("ws://192.168.110.172:8569")
    ws.onopen = function (e: any) {
        console.log('开启', e)
    }
    ws.onmessage = function (e: any) {
        start.value = true

        let data = JSON.parse(e.data)

        /** 图片处理 25帧 */
        images.value = []
        data.image.forEach((item: any) => {
            images.value.push('data:image/jpeg;base64,' + item)
        })

        /** 音频处理 */
        audioDataArray.value.push(data.audio)
        // audioData.value = 'data:audio/mpeg;base64,' + data.audio
        // audioRef.value.play()
        filterData()
    }


    ws.onclose = function () {
        console.log('关闭')
    }
    ws.onerror = function () {
        console.log('出错')
    }

}

const filterData = () => {
    audioRef.value.pause()
    const data = audioDataArray.value[0]
    const decodedData = Uint8Array.from(atob(data), c => c.charCodeAt(0)).buffer;
    audioContext.decodeAudioData(decodedData, buffer => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
        // currentAudioIndex.value = index + 1
    }, error => {
        console.error('Failed to decode audio data:', error);
    });

}


onMounted(() => {
    initWebSocket()
})
onBeforeUnmount(() => {
    ws.close()
})
</script>
<style scoped>
.container-text {
    margin: 20px 0;

}

.container-img {
    background-color: rgb(243, 243, 243);
    height: 100%;
    width: 100vw;

    .picture {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 0 auto;
        padding: 10px 8px;
    }
}
</style>