export default function getNowTime() {
    let now = new Date();
    let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
    let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let today = now.getDate(); //获取当前日(1-31)
    let hour = now.getHours(); //获取当前小时数(0-23)
    let minute = now.getMinutes(); //获取当前分钟数(0-59)
    let second = now.getSeconds(); //获取当前秒数(0-59)
    let dayOfWeek = now.getDay(); //获取当前星期几(0-6,0代表星期日)

    let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    let nowTime = `${year}年${fillZero(month)}月${fillZero(today)}日 ${weekArr[dayOfWeek]} ${fillZero(hour)}:${fillZero(minute)}:${fillZero(second)}`;

    return nowTime;
}

function fillZero(str: any) {
    var realNum;
    if (str < 10) {
        realNum = '0' + str;
    } else {
        realNum = str;
    }
    return realNum;
}