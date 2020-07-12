import regeneratorRuntime from 'regenerator-runtime'
global.regeneratorRuntime = regeneratorRuntime

import util from './utils/util'

global.util = util

import R from 'ramda'
// import { promises } from 'fs'
// import { resolve } from 'path'
// import { reject } from 'lodash'

global.R = R

const asyncWrap = fn =>(options={})=>new Promises((resolve)=>{
    let conf = {
        success:res=>{
            console.log(res);
            resolve(res)
        }
    }
    wx[fn](R.merge(conf,options))
})

wx.getSystemInfoSync = asyncWrap('getSystem')
wx.loginAsync = asyncWrap('login')
wx.getUserInfoAsync = asyncWrap('getUserInfo')
wx.reqAsync = asyncWrap('request')