# ajax-manager
A jQuery ajax management tool

# install
```
npm install ajax-manager
```

# useage
```javascript
import ajaxManager from 'ajax-manager'

ajaxManager(models, globalConfig, jQuery)
```

# API

## `ajaxManager()`

Use `ajaxManager()` to register all your backend apis. It recieve there arguments:

* `models`: `Array`, required, each of the element is an object contains a bounch of backend apis
* `globalConfig`: `Object`, required, all the config set here will effect all the backend api calling
* `jquery`: `jQuery`, required, give me your jQuery!

```javascript
  import ajaxManager from 'ajax-manager'
  import $ from 'jquery'

  var userModels = {
    getUserInfoById: {
      // you can set any config that allowed in $.ajax() here
      methods: 'GET',
      url: 'http://127.0.0.1/get_user_info_by_id'
    },
    getUsers: {
      methods: 'GET',
      url: 'http://127.0.0.1/get_users'
    },
    register: {
      methods: 'POST',
      contentType: 'application/json'
      url: 'http://127.0.0.1/register'
    }
  }
  var globalConfig = {
    // you can set any config that allowed in $.ajax() here
    beforeSend () {
      console.log('ajax fire!')
    }
  }

  var apis = ajaxManager([userModels], globalConfig, $)
```

## `API()`

When apis register is done, the key of each api will be registered as a function of the returning object, and you can exce it to trigger ajax.
It recieved 3 arguments:

* `config`: `Object`, required, ajax config,
* `triggerAjaxStartAndStop`: `Boolean`, indicates if the ajax trigger start and stop event
* `triggerGlobalEvents`: `Boolean`, indicates if the ajax trigger global events 

This function return an jquery ajax object so it can call `done()`, `fail()`, `always()` function chainly.

```javascript
  apis.getUserInfoById({
    // you can set any config that allowed in $.ajax() here
    data: {
      id: 1
    },
    success (data, textStatus, qXHR) {
      console.log(success)
    },
    error (jqXHR, textStatus, errorThrown) {
      console.log(fail)
    }
  }, )
  .done((data, textStatus, jqXHR) => {})
  .fail((jqXHR, textStatus, errorThrown) => {})
  .always((data|jqXHR, textStatus, jqXHR|errorThrown) => {})
```


## Config

You can write config in both model difinition config, `ajaxManager(m, globalConfig, j)` and `API(config)`.You can find all the accepted config in [jQuery.ajax](http://api.jquery.com/jQuery.ajax/). All the config will be merged in one object just like `Object.assign(ajaxManagerConfig, modelDifinitionConfig, apiCallingConfig)` except events.

## Events

There are 3 kinds of events

* Global events
  * `beforeSend`
  * `success`
  * `error`
  * `complete`
* Start and stop events
  * `ajaxStart`
  * `ajaxStop`
* Local events
  * `beforeSend`
  * `success`
  * `error`
  * `complete`

Global events only sopported in `ajaxManager()` config, those events will triggered by every ajax firing unless it set `triggerGlobalEvents` to `false`.

Start and stop events only sopported in `ajaxManager()` config, this tow events only triggered when all the ajax start and all stoped(Just like `$( document ).ajaxStart()` and `$( document ).ajaxStop`).

Local events supported in model definition config and `API()` config. The same event set in both model definition config and `API()` config will only triggered one(the `API()` config local event)


# TODO LIST：
* useage examples