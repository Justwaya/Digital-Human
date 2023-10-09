<template>
  <div class="footer-container">
      <div class="video-container">
          <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
              :options="playerOptions">
          </video-player>
      </div>
  </div>
</template>

<script setup lang='ts'>

const playerOptions = {
  //播放速度
  playbackRates: [0.5, 1.0, 1.5, 2.0],
  //如果true,浏览器准备好时开始回放。
  autoplay: false,
  // 默认情况下将会消除任何音频。
  muted: false,
  // 导致视频一结束就重新开始。
  loop: false,
  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  preload: 'auto',
  language: 'zh-CN',
  // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  aspectRatio: '16:9',
  // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  fluid: true,
  sources: [{
      //类型
      type: "video/flv",
      //url地址
      src: 'rtmp://192.168.110.181/demo/stream-1'
  }],
  //你的封面地址
  poster: '',
  //允许覆盖Video.js无法播放媒体源时显示的默认信息。
  notSupportedMessage: '此视频暂无法播放，请稍后再试',
  controlBar: {
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      //全屏按钮
      fullscreenToggle: true
  }
}


const initWebSocket = () => {

}

onMounted(() => {
  initWebSocket()
})

</script>
<style scoped lang="scss">
.footer-button {
  z-index: 999999;
  width: 62px;
  height: 62px;
}

.circle-half {
  position: absolute;
  left: -30px;
  width: 450px;
  height: 100px;
  background: rgb(135, 180, 222);
  border-radius: 50% / 100% 100% 0 0;
  bottom: 50px;
}

.footer-input {
  position: absolute;
  bottom: 160px;
  right: 31vw;
}

.circle {
  position: absolute;
  bottom: 9px;
  left: 154px;
}

::v-deep(.van-icon__image) {
  font-size: 30px;
  text-align: center;
}
</style>