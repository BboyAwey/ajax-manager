// use global count instead of jquery global event because it does't support cross domain request
window.__apiCount__ = 0
let apiCounter = {
  add () {
    window.__apiCount__++
  },
  remove () {
    window.__apiCount__--
  },
  get: function () {
    return window.__apiCount__
  }
}

// function getMessage (xhr) {
//   let message = ''
//   try {
//     let response = JSON.parse(xhr.responseText)
//     message = response.message || response.msg
//   } catch (e) {
//     message = xhr.responseText
//   }
//   if (xhr.status === 0 && xhr.statusText === 'timeout') message = '请求超时'
//   if (xhr.status === 200 && !message) message = xhr.statusText
//   return message
// }
// function handleError (errTextMap = {}, xhr, toast) {
//   let message = getMessage(xhr)
//   if (message) console.warn('Ajax: ' + message)
//   if (xhr.status !== 200 && toast) toast({message: errTextMap[xhr.status] || message || '请求失败', duration: 3500})
// }
// function handleSuccess (xhr, toast) {
//   let message = getMessage(xhr)
//   if (xhr.status === 200) {
//     if (toast) toast({ message: '请求成功' })
//   } else {
//     if (toast) {
//       toast({
//         message: '请求异常',
//         iconClass: 'ion-android-cancel'
//       })
//     }
//     if (message) console.warn('Ajax: ' + message)
//   }
// }

if (!window.__apiConfig__) window.__apiConfig__ = {}
if (!window.__apiRoot__) window.__apiRoot__ = null
function getApi (modelName, modelConfig = {}, registerConfig = {}, config = {}) {
  let windowApiConfig = window.__apiConfig__[modelName]
  if (!windowApiConfig) windowApiConfig = {}
  let api = windowApiConfig.url ||
    config.url ||
    modelConfig.url ||
    registerConfig.url || ''
  let apiRoot = window.__apiRoot__ ||
    config.__apiRoot ||
    modelConfig.__apiRoot ||
    registerConfig.__apiRoot || ''
  let abandonGlobalApiRoot = windowApiConfig.abandonGlobalApiRoot ||
    config.__abandonGlobalApiRoot ||
    modelConfig.__abandonGlobalApiRoot ||
    registerConfig.__abandonGlobalApiRoot
  return abandonGlobalApiRoot ? api : (apiRoot + api)
}

// let defaultErrTextMap = {
//   '400': '请求参数错误',
//   '401': '您未登陆，请登录',
//   '403': '没有权限',
//   '404': '未找到相关接口',
//   '408': '请求超时',
//   '500': '服务器错误'
// }

let apiRegister = function (models = {}, registerConfig = {}, jquery) {
  let $ = jquery
  // globle config
  $.ajaxSetup(Object.assign({}, models.__globlal || {}, {
    // reset data and event
    data: null,
    beforeSend: null,
    success: null,
    error: null,
    complete: null
  }))
  let globalEvents = { // events set in __global and register should be add in this array
    beforeSend: [],
    success: [],
    error: [],
    complete: []
  }
  function fireGlobalEvents (funcArray, argsArray) {
    for (let i = 0; i < funcArray.length; i++) {
      if (typeof funcArray[i] === 'function') funcArray[i](...argsArray)
    }
  }
  function fireLocalEvent (localEvent, argsArray) {
    if (typeof localEvent === 'function') localEvent(...argsArray)
  }
  let startAndStopEvents = {
    ajaxStart: [],
    ajaxStop: []
  }
  function fireStartAndStopEvents (eventType, argsArray) {
    for (let i = 0; i < startAndStopEvents[eventType].length; i++) {
      if (typeof startAndStopEvents[eventType][i] === 'function') startAndStopEvents[eventType][i](...argsArray)
    }
  }
  let api = {}
  for (let key in models) {
    if (!/^__/g.test(key)) {
      api[key] = function (config = {}, triggerAjaxStartAndStopEvent = true) {
        // merge event
        Object.keys(globalEvents).map(eventName => {
          if (registerConfig[eventName]) globalEvents[eventName].push(registerConfig[eventName])
          if (models.__globlal[eventName]) globalEvents[eventName].push(models.__globlal[eventName])
        })
        Object.keys(startAndStopEvents).map(eventName => {
          if (registerConfig[eventName]) startAndStopEvents[eventName].push(registerConfig[eventName])
          if (models.__globlal[eventName]) startAndStopEvents[eventName].push(models.__globlal[eventName])
        })

        let localEvents = {
          beforeSend: null,
          success: null,
          error: null,
          complete: null
        }
        Object.keys(localEvents).map(eventName => {
          localEvents[eventName] = config[eventName] || models[key][eventName]
        })
        // merge data
        let allData = Object.assign(
          {},
          registerConfig.data || {},
          models.__globlal.data || {},
          models[key].data || {},
          config.data || {})
        // merge config
        let allConfig = Object.assign(
          {},
          registerConfig || {},
          models[key] || {},
          config,
          {
            url: getApi(key, models[key], registerConfig, config),
            data: allData,
            beforeSend (xhr) {
              if (triggerAjaxStartAndStopEvent) {
                apiCounter.add()
                fireStartAndStopEvents('ajaxStart', [xhr])
              }
              fireGlobalEvents(globalEvents.beforeSend, [xhr])
              fireLocalEvent(localEvents.beforeSend, [xhr])
            },
            success (data, statusText, xhr) {
              fireGlobalEvents(globalEvents.success, [data, statusText, xhr])
              fireLocalEvent(localEvents.success, [data, statusText, xhr])
            },
            error (xhr, statusText, error) {
              fireGlobalEvents(globalEvents.error, [xhr, statusText, error])
              fireLocalEvent(localEvents.error, [xhr, statusText, error])
            },
            complete (xhr, statusText) {
              if (triggerAjaxStartAndStopEvent) {
                apiCounter.remove()
                fireStartAndStopEvents('ajaxStop', [xhr, statusText])
              }
              fireGlobalEvents(globalEvents.complete, [xhr, statusText])
              fireLocalEvent(localEvents.complete, [xhr, statusText])
            }
          }
        )
        // format data when post application json
        if (allConfig.contentType && allConfig.contentType.toLowerCase().trim() === 'application/json') {
          allConfig.data = JSON.stringify(allData)
        }
        // if got window api config use the type in it
        if (window.__apiConfig__ && window.__apiConfig__[key] && window.__apiConfig__[key].type) {
          allConfig.type = window.__apiConfig__[key].type
        }
        return $.ajax(allConfig)
      }
    }
  }
  return api
}

export default apiRegister
