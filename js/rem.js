//rem.js
(function () {
	// 千万注意：不要添加入口函数
	// 同时引用的时候放到最前面

	// 获取html元素
	var html = document.documentElement;
	var body = document.body;
	// 获取屏幕的宽度
	var screenWidth = html.clientWidth;
	var timer = null;
	// 初始的设计图的大小
	var uiWidth = 750;
	// 初始的font-size的大小
	var fonts = 100;
	// 获取初始的比例
	var bili = uiWidth / fonts;
	// 根据当前屏幕大小动态去计算这个屏幕所对应font-size值
	html.style.fontSize = screenWidth / bili + 'px';

	// 上来的时候先执行一次
	getSize();

	window.onresize = getSize;

	function getSize() {
		// console.log(111)
		clearTimeout(timer);
		timer = setTimeout(function () {

			// 重新得到屏幕的宽度
			screenWidth = html.clientWidth;
			// 针对屏幕宽度做限定
			if (screenWidth <= 320) {
				html.style.fontSize = 320 / bili + 'px';
			} else if (screenWidth >= uiWidth) {
				html.style.fontSize = uiWidth / bili + 'px';
			} else {
				// 根据当前屏幕大小动态去计算这个屏幕所对应font-size值
				html.style.fontSize = screenWidth / bili + 'px';
			}
		}, 300);
	}
})();

// PageLoading();
//JS实现页面加载完毕之前loading提示效果 
function PageLoading() {
	//获取浏览器页面可见高度和宽度
	var _PageHeight = document.documentElement.clientHeight,
		_PageWidth = document.documentElement.clientWidth;
	//在页面未加载完毕之前显示的loading Html自定义内容
	var _LoadingHtml = '<div id="loadingDiv" class="pageloading loading" style="display:block;position:fixed;width:100%;height:' +
		_PageHeight + 'px;opacity:1;filter:alpha(opacity=80);z-index:10000;background:#15141a;"><div></div></div>';

	//呈现loading效果
	document.write(_LoadingHtml);

	//监听加载状态改变
	document.onreadystatechange = completeLoading;

	//加载状态为complete时移除loading效果
	function completeLoading() {
		if (document.readyState == "complete") {
			$('#loadingDiv').delay(300).fadeOut(500)
			// var loadingMask = document.getElementById('loadingDiv');
			// loadingMask.parentNode.removeChild(loadingMask);
		}
	}
};

//根据设备类型（pc或者移动端），重定向页面到对应类型url
function browserRedirect(mburl, pcurl) {
    var current_url = window.location.href;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {

        PageLoading();
        if (current_url.indexOf('m.gtarcade') > -1 || current_url.indexOf('terms') > -1 || current_url.indexOf('privacy') > -1 || current_url.indexOf('cookiesPolicy') > -1){
            return false;
        }
        window.location.href = mburl;
    } else {
        if (current_url.indexOf('www.gtarcade') > -1){
            return false;
        }
        window.location.href = pcurl

    }
}

function waitSend(target) {
    if(typeof $('.' + target) == undefined) {
        return false;
    }
    $('.' + target).click(function() {
        $(this).append('<span class="ani_dot">...</span>');
    });
}
$(function () {
    recover('sub');
});


function recover(target) {
	if (typeof $('.' + target) == undefined) {
		return false;
	}
	var timer;
	$('.' + target).click(function () {
		clearInterval(timer);
		$(this).attr('style','background:f3af5a');
		var that = $(this);
		timer = setTimeout(function() {
			that.attr('style','background:ff9000')
		}, 500);
	})
}

