;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
// 以上为JS-cookie
// 设置一个时间为7天的cookie Cookies.set('name', 'value', { expires: 7 });
// 获取cookie  Cookies.get('nothing');
// 删除cookie Cookies.remove('name', { path: '' }); // removed!


// 以下正式开始
;(function(global, factory) {
  // 调用一些factory方法
  var factoryMethods = factory(global)

  var appGuess = {
    apiRoot: 'http://elahive.club/api/', // 接口路径

    initDom: function initDom() {
      // 调用实例
      //console.error(factoryMethods.formatDate('1562590479', 'yyyy-MM-dd HH:mm:ss'))
      // factoryMethods.formatDate('1562590479', 'yyyy-MM-dd HH:mm:ss')

      Cookies.set('name', 'value', { expires: 7 });

      // 初始化API地址
      // this.initApi()

      // Ajax设置
      $.ajaxSetup({
        // type: 'POST',
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        timeout: 5000,
        cache:false,
        xhrFields: {
          withCredentials: true
        }
      })

      // 请求用户初始化接口
      this.initData()
      
      // 初始化选择语言积分数
      this.initBetUl()

      // 初始化一些dom操作
      this.initSomeDom()
    },
    // initApi: function initApi() {
    //   var _Self = this;
    //   var localHost = window.location.host;
    //   // 
    //   if(localHost == 'pact.youzu.com') {
    //     _Self.apiRoot = ''
    //   } else {
    //     _Self.apiRoot = ''
    //   }
    // },
    initData: function initData() {
      var _Self = this;
      $.ajax({
        data: {},
        type: 'GET',
        url: _Self.apiRoot + '1.json',
        xhrFields: {
          withCredentials: false // 设置为true时开启cookies，但是方法会报错
        },
        success: function(res) {
            // TODO res及其必要元素判空等逻辑
            // if () {
            var info = res.data[0];

            // 总奖金池
            var amounts = parseFloat(info.amounts[0] + info.amounts[1]).toFixed(2);
            $('.module-two').find('h4').empty().html('当前奖池<span>'+amounts+'</span>积分')

            // 大盘指数
            var dataTime = new Date(parseInt(info.id) * 1000);
            var dataMonth = dataTime.getMonth() + 1;
            var dataDate  = dataTime.getDate();
            var dataHour = dataTime.getHours();
            var dataMinute = dataTime.getMinutes();
            $('.mark').html(dataMonth + '月' + dataDate + '日 大盘指数:<span class="mark-desc">12000  2.58%</span>');

            // 价格波动 // TODO 可以考虑数字颜色——红涨绿跌，根据incressRate的正负识别涨跌
            var incressRate = ((info.prices[1] - info.prices[0]) * 100 / info.prices[0]).toFixed(2);
            $('.mark-desc').html(info.prices[0] + '   ' + incressRate + '%');

            // 进度百分比
            var leftPercent = $('.percent');
            var rightPercent = $('.right-percent');
            var upPercent = Math.round(info.wallets[0] * 100 / (info.wallets[0] + info.wallets[1]));
            var progressBar = upPercent + '%';
            var downProgressBar = (100 - upPercent) + '%';
            leftPercent.animate({width: progressBar});
            leftPercent.html(progressBar);
            rightPercent.animate(downProgressBar);
            rightPercent.html(downProgressBar);

            // TODO cookies里需要存储竞猜选择及时间戳
			// 根据时间及cookies识别——竞猜按钮/已竞猜/不能竞猜/竞猜结果
            if (dataHour == 15 && dataMinute <= 30) {
                // TODO 是否需要轮询接口以自动刷新？哪个接口及字段是结果？
                // 15:00  到15:30  显示竞猜结果  判断依据是本地提交的记录,
                //如果cookie没有值，提示当日预言已经截止，请15:30分后预言下一场
            } else if (dataHour >= 12 && dataHour < 15) {
                // TODO 识别cookies里的竞猜选择并展示文案
                // 12:00  到15:00     不能竞猜，等待下一场,
                //cookie有值显示，你已经预言"涨", 预计15:30分出结果
                //界面显示。当日预言已经截止，请15:30分后预言下一场
            } else {
                // TODO 可以竞猜，需要识别cookies里的时间戳是否是本轮竞猜，是则禁止，不是则清理、允许用户竞猜、存储cookies
                // T-1日的15：30到T日的12:00  ：
                //先比较cookie,如果没有值可以竞猜，有值显示，你已经预言"", 预计15:30分出结果，
                //如果没有值 界面显示 涨和跌的按钮
            }

          // }
        },
        error: function(err) {
          console.error(err);
        },
        complete: function() {

        }
      })
    },

    // 点击档位，结果预览
    initBetUl: function initBetUl() {
      var prodictResult = $('.prodict-result'), prodictStr= '', str = '猜对预计可得<span>40积分</span>，仅供参考';
      $('.bet-ul li').on('click', function(el) {
		//TODO 这里记得修改7月9号的那个日期，那个日期是从api接口里面返回。
		//点击涨和跌的时候记得使用内部浏览器打开www.baid.com即可。
        el.preventDefault();
        $(this).addClass('current').siblings('li').removeClass('current');
        var thisVal = $(this).data('value');
        prodictStr = '猜对预计可得<span>' + thisVal + '</span>，仅供参考'
        prodictResult.empty().html(prodictStr);
      })
    },

    initSomeDom: function initSomeDom() {
      var lookWrap = $('#look_wrap'), downBtn = $('.down-btn');
      $('span.close').on('click', function(el) {
        el.preventDefault()
        var dialogWrap = $('.dialog-wrap')
        dialogWrap.fadeOut(300);
      })

      $('.btns-box div').on('click', function(el) {
        var $this = $(this)
        el.preventDefault()
        // 看涨
        if($this.hasClass('up')) {
          lookWrap.find('.look').removeClass('look-down').addClass('look-up')
          downBtn.find('h5').empty().text('我要看涨')
        } else { // 看跌
          lookWrap.find('.look').removeClass('look-up').addClass('look-down')
          downBtn.find('h5').empty().text('我要看跌')
        }
        lookWrap.fadeIn(300)
      })
    }
  }

  window.appGuess = appGuess;
  appGuess.initDom();

})(typeof window !== "undefined" ? window : this, function(window, $, noGlobal ) {

  var formatDate =   function formatDate(time, fmt) {
    if(time == '' || time == null || time == undefined) {
      return;
    }
    if (arguments.length === 0) {
      return null;
    }
    if ((time + '').length === 10) {
      time = +time * 1000
    }
    var timer;
    if (typeof time == 'object') {
      timer = time;
    } else {
      timer = new Date(parseInt(time));
    }

    if (!fmt) {
      fmt = "yyyy-MM-dd HH:mm:ss";
    }
    var o = {
      "M+": timer.getMonth() + 1, //月份         
      "d+": timer.getDate(), //日         
      "h+": timer.getHours() % 12 == 0 ? 12 : timer.getHours() % 12, //小时         
      "H+": timer.getHours(), //小时         
      "m+": timer.getMinutes(), //分         
      "s+": timer.getSeconds(), //秒         
      "q+": Math.floor((timer.getMonth() + 3) / 3), //季度         
      "S": timer.getMilliseconds() //毫秒         
    };
    var week = {
      "0": "日",
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
      "5": "五",
      "6": "六"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (timer.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[timer.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  return {
    formatDate: formatDate
  }
})