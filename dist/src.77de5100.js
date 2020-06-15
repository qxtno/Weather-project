// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const button = document.querySelector('#butonek');
const input = document.querySelector('#location');
const weatherContainer = document.querySelector('#weather_container');
const locationContainer = document.querySelector('#location_list');
const baseUrl = 'https://api.openweathermap.org/data/2.5';
const appId = '&appid=81e564bdda8adddbc2d805694d19cdac';
const unitsType = '&units=metric';
const lang = '&lang=pl';
const iconString = '';
const iconBaseUrl = 'http://openweathermap.org/img/wn/';
const iconUrlBack = '@2x.png';
input.value = 'lublin';
button === null || button === void 0 ? void 0 : button.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
  if (locationContainer != null) {
    locationContainer.innerHTML = '';
  }

  const location = input.value;
  input.value = '';

  if (location == null || location == '') {
    alert('Pole nie może być puste');
  } else {
    const locationData = yield searchLocation(location);
    console.log('list', locationData);
    locationData.list.forEach(element => {
      console.log('element', element);
      const listItemId = element.id;
      const listItemName = element.name;
      const icon = element.weather[0].icon;
      const locationButton = document.createElement('button');
      locationButton.innerHTML = element.name;
      locationContainer === null || locationContainer === void 0 ? void 0 : locationContainer.append(locationButton);
      locationButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (weatherContainer != null) {
          weatherContainer.innerHTML = '';
        }

        if (locationContainer != null) {
          locationContainer.innerHTML = '';
        }

        console.log('pobieram pogode dla: ', listItemName);
        const weatherData = yield getWeatherDataFromId(listItemId);

        if (weatherData.cod == '404') {
          alert(`Nie znaleziono prognozy dla ${listItemName}`);
        } else {
          const locationElement = document.createElement('div');
          weatherContainer === null || weatherContainer === void 0 ? void 0 : weatherContainer.append(locationElement);
          appendWeatherData(locationElement, weatherData);
          const locationElementIcon = document.createElement('div');
          weatherContainer === null || weatherContainer === void 0 ? void 0 : weatherContainer.append(locationElementIcon);
          appendIcon(locationElementIcon, icon);
          console.log(icon);
        }

        console.log('weather', weatherData);
      }));
    });
  }
}));

function getWeatherDataFromId(listItemId) {
  return __awaiter(this, void 0, void 0, function* () {
    const responseId = yield fetch(`${baseUrl}/weather?id=${listItemId}${unitsType}${appId}${lang}`);
    return responseId.json();
  });
}

function getWeatherData(location) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(`${baseUrl}/weather?q=${location}${unitsType}${appId}${lang}`);
    return response.json();
  });
}

function searchLocation(location) {
  return __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(`${baseUrl}/find?q=${location}${unitsType}${appId}${lang}`);
    return response.json();
  });
}

function appendIcon(div, icon) {
  const iconImg = document.createElement('IMG');
  iconImg.setAttribute('src', `${iconBaseUrl}${icon}${iconUrlBack}`);
  iconImg.setAttribute('width', '100');
  iconImg.setAttribute('height', '100');
  iconImg.setAttribute('alt', 'Weather Icon');
  document.body.appendChild(iconImg);
}

function appendWeatherData(div, weatherData) {
  const feels_like_span = document.createElement('span');
  feels_like_span.innerHTML = weatherData.main.feels_like;
  div === null || div === void 0 ? void 0 : div.append(feels_like_span);
  const temp_span = document.createElement('span');
  temp_span.innerHTML = weatherData.main.temp;
  div === null || div === void 0 ? void 0 : div.append(temp_span);
  const temp_max_span = document.createElement('span');
  temp_max_span.innerHTML = weatherData.main.temp_max;
  div === null || div === void 0 ? void 0 : div.append(temp_max_span);
  const temp_min_span = document.createElement('span');
  temp_min_span.innerHTML = weatherData.main.temp_min;
  div === null || div === void 0 ? void 0 : div.append(temp_min_span);
  const pressure_span = document.createElement('span');
  pressure_span.innerHTML = weatherData.main.pressure;
  div === null || div === void 0 ? void 0 : div.append(pressure_span);
  const humidity_span = document.createElement('span');
  humidity_span.innerHTML = weatherData.main.humidity;
  div === null || div === void 0 ? void 0 : div.append(humidity_span);
  const description_span = document.createElement('span');
  description_span.innerHTML = weatherData.weather[0].description;
  div === null || div === void 0 ? void 0 : div.append(description_span);
  const weather_main_span = document.createElement('span');
  weather_main_span.innerHTML = weatherData.weather[0].main;
  div === null || div === void 0 ? void 0 : div.append(weather_main_span);
  const wind_span = document.createElement('span');
  wind_span.innerHTML = weatherData.wind.speed;
  div === null || div === void 0 ? void 0 : div.append(wind_span);
  const wind_direction_span = document.createElement('span');
  wind_direction_span.innerHTML = weatherData.wind.deg;
  div === null || div === void 0 ? void 0 : div.append(wind_direction_span);
  const clouds_span = document.createElement('span');
  clouds_span.innerHTML = weatherData.clouds.all;
  div === null || div === void 0 ? void 0 : div.append(clouds_span);
  const name_span = document.createElement('span');
  name_span.innerHTML = weatherData.name;
  div === null || div === void 0 ? void 0 : div.append(name_span);
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62574" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map