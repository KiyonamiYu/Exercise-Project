/**
 * 获取今日的年份、月份、日期
 */
const getToday = str => {
    const TODAY_SEPARATOR = '.';

    const today = {};
    if(str.length === 0) {
        const date = new Date();
        today.year = date.getFullYear();
        today.month = date.getMonth() + 1;
        today.date = date.getDate();
    } else {
        const date = str.split(TODAY_SEPARATOR);
        today.year = date[0];
        today.month = date[1];
        today.date = date[2];
    }
    return today;
}

/**
 * 解析一行事件的终止时间
 */
const getLineTime = str => {
    const TIME_SEPARATOR = '.';
    const strs = str.split(TIME_SEPARATOR);
    return Number.parseInt(strs[0]) * 60 + Number.parseInt(strs[1]);
}

/**
 * 分析一整行，将事件的各个要素解析出来。
 */
function getEvent(aLine, startTime) {

    const ELE_SEPARATOR = ' ';

    const strs = aLine.split(ELE_SEPARATOR);

    let lineTime = getLineTime(strs[0]);
    if(isNaN(lineTime)) {      // 过滤空行（空行 或者 true 都会使 lineTime 为 null
        return null;
    }
    if(lineTime < startTime) {  // 下午时间重新轮回
        lineTime += 12 * 60;
    }

    return {
        lineTime,
        type: strs[1],
        detail: strs[2],
        value: lineTime - startTime
    }
}

/**
 * 入口!!!
 */
const linesProcess = lines => {

    const result = [];

    const today = getToday(lines[0]);       // 第一行：明确日期，或者默认空行即今日

    // 处理所有事件
    let startTime = 0;
    for(let i = 1; i < lines.length; i ++) {
        if(lines[i] === '\n') {
            continue;
        }
        const event = getEvent(lines[i], startTime);
        if(event != null) {
            result.push(event);
            startTime = event.lineTime;
        }
    }
    let isForce = false;
    if(lines[lines.length - 1] === 'force') {   // 强制覆盖模式
        isForce = true;
    }
    return [isForce, today, result];
}


module.exports = linesProcess;