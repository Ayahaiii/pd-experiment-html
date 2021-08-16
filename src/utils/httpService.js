import axios from 'axios';
import router from '../router'
import VueCookies from 'vue-cookies';
import { GetQueryValue1, isMobile } from './utils';
let qs = require('qs');

axios.defaults.withCredentials = true;

let host = window.location.hostname

// let _baseUrl = `192.168.0.132:8077/pdapi`;
let _baseUrl = `192.168.0.132:8077/pdapi`;
let baseUrl = `http://${_baseUrl}`;

let baseAuthUrl = `http://175.102.15.229:18900/uums`;

const _isMobile = isMobile();

/**
 * get 请求
 */
const httpGet = async function(url = '', data = {}, type) {
    // 刷新Token
    let tempUrl = url.indexOf("centerAuth") != -1 ? baseAuthUrl : baseUrl;
    if (type == 'base') {
        tempUrl = baseUrl;
    } else if (type == 'auth') {
        tempUrl = baseAuthUrl;
    } else if (type == 'cawi') {
        tempUrl = cawiBaseUrl;
    } else if (type == 'tool') {
        tempUrl = toolBaseUrl;
    }

    let _token = GetQueryValue1("tokenWeb")
    if (!_token) {
        _token = VueCookies.get("tokenWeb")
    }
    const instance = axios.create({
        baseURL: tempUrl,
        withCredentials: false,
        headers: {
            'Accept': 'application/json;charset=UTF-8',
            'content-type': 'application/json',
            'Authorization': _token ? 'Bearer ' + _token : ""
        }
    });
    return instance.get(url, {
        params: data
    }).then((result) => {
        var res = result.data;
        if (res && res.code === 0) {
            return Promise.resolve(res);
        } else {
            if (res.code === 15000) {
                this.$message({
                    message: '系统异常',
                    type: 'warning'
                });
                return res;
            } else if (res.code === 10000) {
                this.$message({
                    message: res.message,
                    type: 'warning'
                });
                return res;
            }
            return Promise.resolve(res);
        }
    }).catch((error) => {
        let res = error.response
        if ((res.status === 400 || res.status === 401) && !_isMobile) {
            if (res.data) {
                this.$message({
                    message: res.data.message,
                    type: 'warning'
                });
                this.$cookies.remove("tokenWeb");
                this.$cookies.remove("tokenWebRefresh");
                this.$cookies.remove("userInfo");
            } else {
                this.$message({
                    message: '登录信息已失效,请重新登录',
                    type: 'warning'
                });
            }
            router.push('/pd/login');
            return res;
        } else if (res.status === 500 && !_isMobile) {
        }
        res = {
            code: -1,
            message: '网络请求异常，请稍后再试或联系客服！'
        }
        return res;
    })
}

/**
 * post 请求
 */
const httpPost = async function(url = '', data = {}, type) {
    let tempUrl = url.indexOf("centerAuth") != -1 ? baseAuthUrl : baseUrl;
    if (type == 'base') {
        tempUrl = baseUrl;
    } else if (type == 'auth') {
        tempUrl = baseAuthUrl;
    } else if (type == 'cawi') {
        tempUrl = cawiBaseUrl;
    } else if (type == 'tool') {
        tempUrl = toolBaseUrl;
    }
    // 刷新Token
    // if (!VueCookies.isKey("tokenWeb") && VueCookies.isKey("tokenWebRefresh")) {
    //   await this.httpPostRefreshToken('/oauth/token', VueCookies.get("tokenWebRefresh"))
    // }
    let _token = GetQueryValue1("tokenWeb")
    if (!_token) {
        _token = VueCookies.get("tokenWeb")
    }
    const instance = axios.create({
        baseURL: tempUrl,
        withCredentials: false,
        headers: {
            'Accept': 'application/json;charset=UTF-8',
            'content-type': 'application/json',
            'Authorization': _token ? 'Bearer ' + _token : ""
        }
    });
    return instance.post(url, JSON.stringify(data)).then((result) => {
        var res = result.data;
        if (res && res.code === 0) {
            return Promise.resolve(res);
        } else {
            if (res.code === 15000 && !_isMobile) {
                // router.push('/stop');
             

                // this.$cookies.remove("tokenWeb");
                // this.$cookies.remove("tokenWebRefresh");
                // this.$cookies.remove("userInfo");
                return res;
            } else if (res.status === 1000 && !_isMobile) {
                router.push('/unauthorized');
                return res;
            } else {
                if (url.indexOf('/w1/redPacket/getBonusResult') == -1) {
                    this.$message({
                        message: res.message,
                        type: 'warning'
                    });
                }
                return Promise.resolve(res);
            }

        }
    }).catch(() => {
        let res = {
            code: -1,
            message: '网络请求异常，请稍后再试或联系客服！'
        }
        return res;
    })
}

/**
 * post 请求 uums
 */
const httpPostIsAnonymous = function(url = '', data = {}) {
    const instance = axios.create({
        baseURL: baseAuthUrl,
        withCredentials: false,
        headers: {
            'Accept': 'application/json;charset=UTF-8',
            'content-type': 'application/json'
        }
    });
    return instance.post(url, JSON.stringify(data)).then((result) => {
        var res = result.data;
        if (res && res.code === 0) {
            return Promise.resolve(res);
        } else {
            if (res.code === 15000) {
                this.$message({
                    message: '网络请求异常，请稍后再试或联系客服！',
                    type: 'warning'
                });
                return res;
            }
            return Promise.resolve(res);
        }
    }).catch(() => {
        let res = {
            code: -1,
            message: '网络请求异常，请稍后再试或联系客服！'
        }
        return res;
    })
}

/**
 * 认证请求
 */
const httpPostToken = function(url = '', data) {
    const instance = axios.create({
        baseURL: baseAuthUrl,
        withCredentials: false,
        headers: {
            'Authorization': 'Basic bW9uZXR3YXJlOm1vbmV0d2FyZTIwMTkuQHNoLmNvbQ==',
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });
    return instance.post(url, data).then((result) => {
        var res = result.data;
        if (result && result.status === 200) {
            if (res != null && res.access_token != null && res.access_token != '') {
                this.$cookies.set("tokenWeb", res.access_token, 24 * 60 * 60);
                // this.$cookies.set("tokenWebRefresh", res.refresh_token, 25 * 60 * 60);
                this.$cookies.set("userInfo", JSON.stringify(res.userInfo), 24 * 60 * 60);
                res = {
                    code: 0,
                    message: '登录成功'
                }
                return Promise.resolve(res);
            } else {
                res = {
                    code: -1,
                    message: '认证失败，请稍后再试或联系客服！'
                }
                return res;
            }
        }
    }).catch((error) => {
        let res = error.response
        if (res.status === 400 || res.status === 401 || res.status === 500) {
            res = {
                code: res.data.code,
                message: res.data.message
            }
            return res;
        }
        res = {
            code: -1,
            message: '网络请求异常，请稍后再试或联系客服！'
        }
        return res;
    })
}

/**
 * 刷新token请求
 */
const httpPostRefreshToken = function(url = '', refreshToken) {
    var ip = window.localStorage.getItem("ip");
    var city = window.localStorage.getItem("city");
    var client = "RI";
    var data = `grant_type=refresh_token&refresh_token=${refreshToken}&clientType=${client}&ip=${ip}&city=${city}`
    const instance = axios.create({
        baseURL: baseAuthUrl,
        withCredentials: false,
        headers: {
            'Authorization': 'Basic bW9uZXR3YXJlOm1vbmV0d2FyZTIwMTkuQHNoLmNvbQ==',
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });
    return instance.post(url, data).then((result) => {
        var res = result.data;
        if (result && result.status === 200) {
            if (res != null && res.access_token != null && res.access_token != '') {
                VueCookies.set("tokenWeb", res.access_token, 24 * 60 * 60);
                VueCookies.set("tokenWebRefresh", res.refresh_token, 25 * 60 * 60);
                VueCookies.set("userInfo", JSON.stringify(res.userInfo), 24 * 60 * 60);
                res = {
                    code: 0,
                    message: '登录成功'
                }
                return Promise.resolve(res);
            } else {
                res = {
                    code: -1,
                    message: '认证失败，请稍后再试或联系客服！'
                }
                return res;
            }
        }
    }).catch((error) => {
        let res = error.response
        if (res.status === 400 || res.status === 401 || res.status === 500) {
            res = {
                code: res.data.code,
                message: res.data.message
            }
            return res;
        }
        res = {
            code: -1,
            message: '网络请求异常，请稍后再试或联系客服！'
        }
        return res;
    })
}

export {
    baseUrl,
    toolBaseUrl,
    baseAuthUrl,
    cawiBaseUrl,
    _cawiBaseUrl,
    _toolBaseUrl,
    httpGet,
    httpPost,
    httpPostIsAnonymous,
    httpPostToken,
    httpPostRefreshToken
}