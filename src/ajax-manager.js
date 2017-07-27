// use global count instead of jquery global event because it does't support cross domain request
function getGlobal () {
  return window || global
}

let GLOBAL = getGlobal()

GLOBAL.__apiCount__ = 0
GLOBAL.__apiCounter = {
  add () {
    GLOBAL.__apiCount__++
  },
  remove () {
    GLOBAL.__apiCount__--
  },
  get: function () {
    return GLOBAL.__apiCount__
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

if (!GLOBAL.__apiConfig__) GLOBAL.__apiConfig__ = {}
if (!GLOBAL.__apiRoot__) GLOBAL.__apiRoot__ = null

function getUrl (modelName, modelConfig = {}, registerConfig = {}, config = {}) {
  let windowApiConfig = GLOBAL.__apiConfig__[modelName]
  if (!windowApiConfig) windowApiConfig = {}
  let url = windowApiConfig.url ||
    config.url ||
    modelConfig.url ||
    registerConfig.url || ''
  let apiRoot = GLOBAL.__apiRoot__ ||
    config.__apiRoot ||
    modelConfig.__apiRoot ||
    registerConfig.__apiRoot || ''
  let ignoreGlobalApiRoot = windowApiConfig.ignoreGlobalApiRoot ||
    config.__ignoreGlobalApiRoot ||
    modelConfig.__ignoreGlobalApiRoot ||
    registerConfig.__ignoreGlobalApiRoot
  return ignoreGlobalApiRoot ? url : (apiRoot + url)
}

let apiRegister = function (modelsArray = [], registerConfig = {}, jquery) {
  let $ = jquery
  // merge all models
  let models = {}
  modelsArray.forEach((m, i) => {
    for (let key in m) {
      let model = m[key]
        // test if there are api useing same name
      // if (key in models) throw new Error(`model: api should not have same name "${key}".`)
      if (key in models) console.warn(`ajaxManager: api in models should not have same name "${key}".`)
      models[key] = model
    }
    if (!models.__default) models.__default = {}
  })
  // globle config
  // $.ajaxSetup(Object.assign({}, models.__default || {}, {
  //   // reset data and event
  //   data: null,
  //   beforeSend: null,
  //   success: null,
  //   error: null,
  //   complete: null
  // }))
  let globalEvents = { // events set in __default and register should be add in this array
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
  let apis = {}
  for (let key in models) {
    if (!/^__/g.test(key)) {
      apis[key] = function (config = {}, triggerAjaxStartAndStopEvent = true, triggerGlobalEvents = true) {
        // merge event
        Object.keys(globalEvents).map(eventName => {
          if (registerConfig[eventName]) globalEvents[eventName].push(registerConfig[eventName])
          if (models.__default[eventName]) globalEvents[eventName].push(models.__default[eventName])
        })
        Object.keys(startAndStopEvents).map(eventName => {
          if (registerConfig[eventName]) startAndStopEvents[eventName].push(registerConfig[eventName])
          if (models.__default[eventName]) startAndStopEvents[eventName].push(models.__default[eventName])
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
          models.__default.data || {},
          models[key].data || {},
          config.data || {})
        // merge config
        let allConfig = Object.assign(
          {},
          models.__default || {},
          registerConfig || {},
          models[key] || {},
          config,
          {
            url: getUrl(key, models[key], registerConfig, config),
            data: allData,
            beforeSend (xhr) {
              if (triggerAjaxStartAndStopEvent) {
                GLOBAL.__apiCounter.add()
                fireStartAndStopEvents('ajaxStart', [xhr])
              }
              if (triggerGlobalEvents) fireGlobalEvents(globalEvents.beforeSend, [xhr])
              fireLocalEvent(localEvents.beforeSend, [xhr])
            },
            success (data, statusText, xhr) {
              if (triggerGlobalEvents) fireGlobalEvents(globalEvents.success, [data, statusText, xhr])
              fireLocalEvent(localEvents.success, [data, statusText, xhr])
            },
            error (xhr, statusText, error) {
              if (triggerGlobalEvents) fireGlobalEvents(globalEvents.error, [xhr, statusText, error])
              fireLocalEvent(localEvents.error, [xhr, statusText, error])
            },
            complete (xhr, statusText) {
              if (triggerAjaxStartAndStopEvent) {
                GLOBAL.__apiCounter.remove()
                fireStartAndStopEvents('ajaxStop', [xhr, statusText])
              }
              if (triggerGlobalEvents) fireGlobalEvents(globalEvents.complete, [xhr, statusText])
              fireLocalEvent(localEvents.complete, [xhr, statusText])
            }
          }
        )
        // if got window api config then use it
        if (GLOBAL.__apiConfig__ && GLOBAL.__apiConfig__[key] && GLOBAL.__apiConfig__[key].type) {
          allConfig = Object.assign({}, allConfig, GLOBAL.__apiConfig__[key])
        }
        // format data when post application json
        if (
          allConfig.method &&
          allConfig.method.toLowerCase().trim() === 'post' &&
          allConfig.contentType &&
          allConfig.contentType.toLowerCase().trim() === 'application/json') {
            allConfig.data = JSON.stringify(allData)
        }
        return $.ajax(allConfig)
      }
    }
  }
  return apis
}

export default apiRegister
