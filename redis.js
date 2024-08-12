const config = require('./config.js') ;
const Redis = require('ioredis')
// 创建Redis客户端实例
const RedisCli = new Redis({
    host: config.redis_host,       // Redis服务器主机名
    port: config.redis_port,        // Redis服务器端口号
    password: config.redis_passwd, // Redis密码
})
/**
 * 监听错误信息
 */
RedisCli.on("error", function (error){
    console.log("RedisCli connect error",error)
    RedisCli.quit();
})
/**
 * 根据key获取value
 * @param {*} key 
 * @returns 
 */
async function GetRedis(key){
    try {
        const result = await RedisCli.get(key)
        if (result == null) {
            console.log('result:','<'+result+'>', 'This key cannot be find...')
            return null
        }
        console.log('result:','<'+result+'>', 'Get key success!...')
        return result
    } catch (error) {
        console.log('GetRedis error is', error);
        return null
    }
}
/**
 * 根据key查询redis中是否存在key
 * @param {*} key 
 * @returns 
 */
async function QueryRedis(key) {
    try {
        const result = await RedisCli.exists(key)
        if (result == 0) {
            console.log('result:','<'+result+'>', 'This key cannot be find...')
            return null
        }
        console.log('result:','<'+result+'>',key+' exists!...')
        return result
    } catch (error) {
        console.log('QueryRedis error is', error);
        return null
    }
}
/**
 * 设置key和value，并过期时间
 * @param {*} key 
 * @param {*} value 
 * @param {*} exptime 
 * @returns 
 */
async function SetRedisExpire(key, value, exptime) {
    try {
        // 设置键和值
        await RedisCli.set(key, value)
        // 设置过期时间（以秒为单位）
        await RedisCli.expire(key, exptime)
        return true
    } catch (error) {
        console.log('SetRedisExpire error is', error);
        return false;
    }
}
/**
 * 退出函数
 */
function Quit(){
    RedisCli.quit();
}

module.exports = {GetRedis, QueryRedis, Quit, SetRedisExpire,}