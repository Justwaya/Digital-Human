<template>
  <div class="header-container">
    <div class="container-text">
      讯飞语音转换
    </div>
    <div class="container-img">
      <video ref="videoRef" class="picture" autoplay @pause="pause" @ended="ended" @canplay="canplay"></video>
      <!-- <video ref="videoRef2" class="pictureTwo" autoplay muted @pause="pause" @canplay="canplay" @ended="ended"
              :style="videoShow ? 'overflow:hidden' : ''"></video> -->
    </div>
  </div>
</template>

<script setup lang='ts'>
import flvjs from 'flv.js'
const videoRef = ref()
// const videoRef2 = ref()
let flvplayer: any
let ws: any

const videoArray = ref([])
const status = ref(false)
// const videoShow = ref(true)

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
      })
      flvplayer.attachMediaElement(videoRef.value)
      flvplayer.load()
      flvplayer.play()
    } else {
      videoArray.value.push(videoURL)
      if (status.value) {
        pause()
        status.value = false
      }
    }
  }
}
const pause = () => {
  console.log("🚀 ~ file: index.vue:51 ~ videoArray.value.length:", videoArray.value.length)
  if (videoArray.value.length == 0) {
    status.value = true
    return false
  }

  if (flvplayer) {
    console.log('销毁实例');
    flvplayer.pause()
    flvplayer.unload()
    flvplayer.detachMediaElement()
    flvplayer.destroy()
    flvplayer = null
  }
  flvplayer = flvjs.createPlayer({
    type: 'flv',
    isLive: true, // 是否是直播流
    url: videoArray.value.shift() || '',
  })

  flvplayer.attachMediaElement(videoRef.value)
  flvplayer.load()
  // 切换样式
  // videoShow.value = !videoShow.value
  flvplayer.play()
}
// const ended = () => {
//   flvplayer.pause()
// }
// const canplay = () => {
//   console.log('待播放状态');
//   videoShow.value = !videoShow.value
//   flvplayer.play()
// }
onUnmounted(() => {
  ws.close()

})
onMounted(() => {
  initWebSocket()
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
    width: 300px;
    height: 120px;
    margin: 0 auto;
    padding: 10px 8px;
  }

  .pictureTwo {
    width: 300px;
    height: 120px;
    position: absolute;
    top: 80px;
    left: 70px;
  }
}
</style>