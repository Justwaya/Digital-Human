<template>
    <div class="container-img">
        <video ref="videoRef2" class="pictureTwo" autoplay v-show="endedVido" @pause="videoNextPause"></video>
        <video ref="videoRef" class="picture" autoplay @pause="pause" @canplay="canplay" v-show="endedVido"></video>
        <video src="../../assets/video/staticStanding.mp4" autoplay muted class="pictureThree" loop></video>
    </div>
</template>
  
<script setup lang='ts'>
import flvjs from 'flv.js'

const SPEED = 0.8
const SPEEDNEXT = 0.9

let ws: any

const videoRef = ref<HTMLVideoElement | any>()
const videoRef2 = ref<HTMLVideoElement | any>()
let flvplayer: any
let flvplayerNext: any
const videoArray = ref<Array<string>>([])
const videoArrayNext = ref<Array<string>>([])

const status = ref(false)       //数组列表
const videoStatus = ref('')     //stop play
const instance = getCurrentInstance();
const endedVido = ref(true)    //视频结束
const firPlay = ref(false)      //首次播放


const initWebSocket = () => {
    ws = new WebSocket('ws://192.168.110.172:5656')
    ws.onopen = () => {
        console.log('连接成功')
    }
    ws.onmessage = async (e) => {
        if (e.data == 'stop') {
            videoStatus.value = 'stop'
            return false
        }
        videoStatus.value = 'play'
        const blob = new Blob([e.data], { type: 'video/flv' });
        const videoURL = URL.createObjectURL(blob)

        if (!flvplayer) {
            firPlay.value = true
            flvplayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true, // 是否是直播流
                url: videoURL,
            }, { autoCleanupSourceBuffer: true })
            flvplayer.attachMediaElement(videoRef.value)
            flvplayer.load()
            videoRef.value.playbackRate = SPEED
            flvplayer.play()

            flvplayerNext = flvjs.createPlayer({
                type: 'flv',
                isLive: true, // 是否是直播流
                url: videoURL,
            }, { autoCleanupSourceBuffer: true })
            flvplayerNext.attachMediaElement(videoRef2.value)
            flvplayerNext.load()
            videoRef2.value.playbackRate = SPEEDNEXT
            videoRef2.value.muted = true
            flvplayerNext.play()
        } else {
            videoArray.value.push(videoURL)
            videoArrayNext.value.push(videoURL)
            if (status.value) {
                pause()
                status.value = false
            }
        }
    }
}
const canplay = () => {
    // pauseNext()
    if (!firPlay.value) {
        pauseNext()
        endedVido.value = true
    }
    firPlay.value = false
}
const pause = () => {
    if (videoArray.value.length == 0) {
        status.value = true
        return false
    }
    // flvplayer.pause()
    // flvplayer = null
    flvplayer = flvjs.createPlayer({
        type: 'flv',
        isLive: false, // 是否是直播流
        url: videoArray.value.shift() || '',
    }, { autoCleanupSourceBuffer: true })
    flvplayer.attachMediaElement(videoRef.value)
    flvplayer.load()
    videoRef.value.playbackRate = SPEEDNEXT
    videoRef.value.muted = true
    // flvplayer.play()
}

const pauseNext = () => {
    // endedVido.value = false
    if (videoArrayNext.value.length !== 0) {
        flvplayerNext = flvjs.createPlayer({
            type: 'flv',
            isLive: false, // 是否是直播流
            url: videoArrayNext.value.shift() || '',
        }, { autoCleanupSourceBuffer: true })
        flvplayerNext.attachMediaElement(videoRef2.value)
        flvplayerNext.load()
        videoRef2.value.playbackRate = SPEED
        videoRef2.value.muted = false
        flvplayerNext.play()
        flvplayer.play()
    }

}
const videoNextPause = () => {
    if (videoStatus.value == 'stop') {
        console.log('播放完毕');
        endedVido.value = false
        instance?.proxy?.$Bus.emit('display')
    }
}
onBeforeUnmount(() => {
    console.log('关闭websocket');
    if (ws && ws.readyState == WebSocket.OPEN) {
        ws.close()
    }
    videoArray.value.length = 0
    videoArrayNext.value.length = 0
})
onMounted(() => {
    initWebSocket()
})
</script>
<style scoped>
.container-img {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    /* background-color: skyblue; */
    .picture {
        height: 100vh;
        /* height: 50vh; */
        /* width: 50vw; */
        /* width: 80vw; */
    }

    .pictureTwo {
        /* width: 50vw; */
        /* height: 50vh; */

        height: 100vh;
        /* width: 80vw; */
        position: absolute;
        top: 0;
        left: 0;
    }

    .pictureThree {
        height: 100vh;
        /* width: 80vw; */
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
}
</style>