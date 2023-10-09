<template>
    <div>
        <video src="" ref="videoRef"></video>
    </div>
</template>

<script setup lang='ts'>
import flvjs from 'flv.js'
import DPlayer from 'dplayer';

const websocketUrl = 'ws://192.168.110.172:5656'
// 创建 WebSocket 连接
const websocket = new WebSocket(websocketUrl);
const videoRef = ref()
const init = () => {
    console.log("🚀 ~ file: myDplayer.vue:33 ~ options.videoRef.value:", videoRef.value)

    let options = {
        container: videoRef.value,
        live: true,
        autoplay: true,
        video: {
            type: 'customFlv',
            customType: {
                customFlv: function (video, player) {
                    const mediaSource = new MediaSource();
                    video.src = URL.createObjectURL(mediaSource);

                    mediaSource.addEventListener('sourceopen', function () {
                        const sourceBuffer = mediaSource.addSourceBuffer('video/flv;');
                        const flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: websocketUrl,
                            isLive: true,
                        });
                        flvPlayer.attachMediaElement(video);
                        flvPlayer.load();

                        let isAppending = false;
                        let isBufferFull = false;

                        sourceBuffer.addEventListener('updateend', function () {
                            if (!isAppending && isBufferFull && !sourceBuffer.updating) {
                                sourceBuffer.remove(0, player.currentTime - 30);
                                isBufferFull = false;
                            }
                        });

                        flvPlayer.on(flvjs.Events.MEDIA_INFO, function () {
                            if (!isAppending) {
                                isAppending = true;
                                sourceBuffer.appendBuffer(flvPlayer.mediaDataSource.data);
                            }
                        });


                    });
                },
            },
        },
    }
    const dp = new DPlayer(options);
    console.log(dp.plugins.flv); // flv 实例

}
onMounted(() => {
    init()
})
</script>
<style scoped></style>