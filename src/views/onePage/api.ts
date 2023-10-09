import request from '@/requset/index'

// 讯飞url
export const getWebsocketUrl = () => {
    return request.post({ url: '/admin-api/ai/speech-recognition/url' })
}
// 文字流 
// export const aiComment = (data: any) => {
//     return request.post({ url: '/digital-human/text2voice', data })
// }

// 语音
export const audioInfo = (data: any) => {
    return request.post({ url: '/digital-human/speech-synthesis', data })
}