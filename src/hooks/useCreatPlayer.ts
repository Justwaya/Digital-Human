import flvjs from 'flv.js'
export default function (videoURL: string) {
    flvjs.createPlayer({
        type: 'flv',
        isLive: true, // 是否是直播流
        url: videoURL,
    }, { autoCleanupSourceBuffer: true })
}