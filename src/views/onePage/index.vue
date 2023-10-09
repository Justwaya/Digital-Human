<template>
    <div class="container">
        <VideoStream />
        <main class="main">
            <Main></Main>
        </main>
        <CountDown />
    </div>
</template>

<script setup lang='ts'>
import VideoStream from './componment/videoStream.vue';
// import VideoStream from '../copy/myDplayer.vue';
// import VideoStream from '../copy/index.vue';
// import VideoStream from '../copy/hls.vue';
// import VideoStream from '../copy/twoVideo.vue';
import Main from './componment/main.vue'
import CountDown from './componment/countDown.vue'


</script>
<style scoped lang="scss">
.container {
    height: 100%;
}

.main {
    // height: calc(100vh - 300px);
    width: 100%;
    height: 300px;
    position: absolute;
    bottom: 0;
    padding: 0;

}
</style>