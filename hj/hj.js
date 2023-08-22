// ==UserScript==
// @name         海角社区脚本
// @namespace    haijiao-script
// @version      0.0.24
// @author       memopac
// @description  海角社区视频解析
// @license      MIT
// @icon         https://pomf2.lain.la/f/erejxtfo.ico
// @match        *://*.haijiao.com/*
// @match        *://*/post/details*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.27.1
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.3.5
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=e,document.head.append(t)})(" .crack_container{position:fixed;top:80px;right:20px}.crack_title{font-size:20px;font-weight:700;text-align:center;border:1px solid #000;cursor:pointer;display:block}.crack_player{position:fixed;top:0;bottom:0;left:0;right:0}.crack_player .iframeBox{width:70vw;margin:auto} ");

(function (DPlayer, hls_js, $) {
    'use strict';

    var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
    var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
    function W() {
        var e = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890", t = (this.encode = function(i2) {
            var a, n, o, r, s, c, l = "", u = 0;
            for (i2 = t(i2); u < i2.length; )
                o = (a = i2.charCodeAt(u++)) >> 2, r = (3 & a) << 4 | (a = i2.charCodeAt(u++)) >> 4, s = (15 & a) << 2 | (n = i2.charCodeAt(u++)) >> 6, c = 63 & n, isNaN(a) ? s = c = 64 : isNaN(n) && (c = 64), l = l + e.charAt(o) + e.charAt(r) + e.charAt(s) + e.charAt(c);
            return l;
        }, this.decode = function(t2) {
            var a, n, o, r, s, c, l = "", u = 0;
            for (t2 = t2.replace(/[^A-Za-z0-9\*\#]/g, ""); u < t2.length; )
                o = e.indexOf(t2.charAt(u++)), a = (15 & (r = e.indexOf(t2.charAt(u++)))) << 4 | (s = e.indexOf(t2.charAt(u++))) >> 2, n = (3 & s) << 6 | (c = e.indexOf(t2.charAt(u++))), l += String.fromCharCode(o << 2 | r >> 4), 64 != s && (l += String.fromCharCode(a)), 64 != c && (l += String.fromCharCode(n));
            return i(l);
        }, function(e2) {
            e2 = e2.replace(/\r\n/g, "\n");
            for (var t2 = "", i2 = 0; i2 < e2.length; i2++) {
                var a = e2.charCodeAt(i2);
                a < 128 ? t2 += String.fromCharCode(a) : t2 = 127 < a && a < 2048 ? (t2 += String.fromCharCode(a >> 6 | 192)) + String.fromCharCode(63 & a | 128) : (t2 = (t2 += String.fromCharCode(a >> 12 | 224)) + String.fromCharCode(a >> 6 & 63 | 128)) + String.fromCharCode(63 & a | 128);
            }
            return t2;
        }), i = function(e2) {
            for (var t2, i2, a = "", n = 0, o = 0; n < e2.length; )
                (t2 = e2.charCodeAt(n)) < 128 ? (a += String.fromCharCode(t2), n++) : 191 < t2 && t2 < 224 ? (o = e2.charCodeAt(n + 1), a += String.fromCharCode((31 & t2) << 6 | 63 & o), n += 2) : (o = e2.charCodeAt(n + 1), i2 = e2.charCodeAt(n + 2), a += String.fromCharCode((15 & t2) << 12 | (63 & o) << 6 | 63 & i2), n += 3);
            return a;
        };
    }
    const src = "https://hits.dwyl.com/memopac/haijiao-script.svg?style=flat-square";
    const isMobile = () => {
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            navigator.userAgent.toLowerCase()
        );
    };
    function isValidHttpUrl(str) {
        const pattern = new RegExp(
            "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
            // fragment locator
            "i"
        );
        return pattern.test(str);
    }
    function main(url) {
        try {
            let init = function() {
                crackBtn = $('<div class="crack_title" id="crack_anal">解析</div>');
                jumpLink1 = $(
                    '<a class="crack_title" target="_blank" id="crack_jump">跳转播放1</a>'
                ).hide();
                jumpLink2 = $(
                    '<a class="crack_title" target="_blank" id="crack_jump">跳转播放2</a>'
                ).hide();
                downloadLink = $(
                    '<a class="crack_title" target="_blank" id="crack_jump">下载视频</a>'
                ).hide();
                copyBtn = $(
                    '<div class="crack_title" id="crack_copy"><img src="" width="94"/></div>'
                ).hide();
                container = $(`<div class="crack_container" id="crack_container"></div>`).append(crackBtn).append(jumpLink1).append(jumpLink2).append(downloadLink).append(copyBtn);
                crackBtn.one("click", crack);
                $("body").append(container);
            }, crack = function() {
                crackBtn.html("解析成功");
                const encodeUrl2 = `https://m3u8play.com/?play=${encodeURIComponent(
                    url
                )}`;
                const downloadUrl = `https://tools.thatwind.com/tool/m3u8downloader#m3u8=${encodeURIComponent(
                    url
                )}&referer=${window.location.href}&filename=${$(
                    "#details-page > div.header > h2 > span"
                ).text()}`;
                const encodeUrl1 = `https://m.auok.run/player/#${url}`;
                const sellContainer2 = getSellerContainer();
                jumpLink1.attr("href", encodeUrl1);
                jumpLink2.attr("href", encodeUrl2);
                downloadLink.attr("href", downloadUrl);
                if (sellContainer2) {
                    if (isMobile()) {
                    } else {
                        const video = $("<div></div>");
                        new DPlayer({
                            container: video[0],
                            autoplay: false,
                            theme: "#FADFA3",
                            loop: true,
                            lang: "zh",
                            screenshot: true,
                            hotkey: true,
                            preload: "auto",
                            video: {
                                url,
                                type: "hls"
                            }
                        });
                        $(sellContainer2).append(video);
                    }
                }
                copyBtn.on("click", () => {
                    _GM_setClipboard(url, "text/plain");
                });
                jumpLink1.show();
                jumpLink2.show();
                downloadLink.show();
                copyBtn.show().find("img").attr("src", src);
                return;
            }, track = function() {
                init();
                crack();
            };
            let crackBtn;
            let jumpLink1;
            let jumpLink2;
            let downloadLink;
            let copyBtn;
            let container;
            const sellContainer = getSellerContainer();
            if (sellContainer) {
                track();
                return;
            }
            setTimeout(() => {
                track();
            }, 2e3);
        } catch (error) {
        }
    }
    function getCodeFromString(strInput) {
        const str = String(strInput);
        const dataArr = str.split("\n").filter((str2) => !str2.includes("#"));
        const first = dataArr.shift();
        const isUrl = isValidHttpUrl(first);
        let currentCode = "";
        if (isUrl) {
            const lastSlashIndex = first.lastIndexOf("/");
            const lastDotIndex = first.lastIndexOf(".");
            currentCode = first.substring(lastSlashIndex + 1, lastDotIndex);
        } else {
            currentCode = first.split(".")[0];
        }
        const code = currentCode.substring(0, currentCode.length - 1);
        return code;
    }
    function formatUrl(url, code) {
        const lastSlashIndex = url.lastIndexOf("/");
        const lastDotIndex = url.lastIndexOf(".");
        const tmpCode = url.substring(lastSlashIndex + 1, lastDotIndex);
        const newUrl = url.replace(tmpCode, code);
        return newUrl;
    }
    function crackUrl(url) {
        _GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: function({ response }) {
                const code = getCodeFromString(response);
                if (code) {
                    const newUrl = formatUrl(url, code);
                    main(newUrl);
                }
            }
        });
    }
    function mainCrackAudio(audios) {
        const sellContainer = getSellerContainer();
        if (!sellContainer) {
            return;
        }
        audios.forEach((audio) => {
            const $audio = $(
                `<audio src="${audio.remoteUrl}" controls="controls"></audio>`
      );
        $(sellContainer).append($audio);
    });
      if ($("#crack_container").length === 0) {
          const copyBtn = $(
              `<div class="crack_title" id="crack_copy"><img src="${src}" width="94"/></div>`
      );
        const container = $(
            `<div class="crack_container" id="crack_container"></div>`
      ).append(copyBtn);
        $("body").append(container);
    }
  }
    function mainCrackImage(images) {
        const notRenderImages = images.filter((image) => {
            return $(`img[data-id="${image.id}"]`).length === 0;
        });
        notRenderImages.forEach((image) => {
            const url = image.remoteUrl;
            if (!url) {
                return;
            }
            _GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function({ response }) {
                    let imgSrc = new W().decode(response);
                    imgSrc = imgSrc.replace(/\0.*$/g, "");
                    const img = $(
                        `<img src="${imgSrc}" data-id="${image.id}"  title="点击查看大图">`
          );
            img.on("error", () => {
                img.remove();
            });
            const sellContainer = getSellerContainer();
            if (!sellContainer) {
                return;
            }
            $(sellContainer).append(img);
            if ($("#crack_container").length === 0) {
                const copyBtn = $(
                    `<div class="crack_title" id="crack_copy"><img src="${src}" width="94"/></div>`
            );
              const container = $(
                  `<div class="crack_container" id="crack_container"></div>`
            ).append(copyBtn);
              $("body").append(container);
          }
        }
      });
    });
  }
    let injectEntryUrl = "";
    function getSellerContainer() {
        const element = document.querySelector("span.sell-btn") || document.querySelector("div.pagecontainer") || document.querySelector("div.publicContainer");
        return element;
    }
    (() => {
        let oldUrl = window.location.href;
        const mutationObserver = new MutationObserver(() => {
            const newUrl = window.location.href;
            const isHaiJiaoPid = window.location.href.includes("?pid=");
            const sellContainer = getSellerContainer();
            if (!sellContainer) {
                return;
            }
            if (oldUrl !== newUrl) {
                oldUrl = newUrl;
                if (isHaiJiaoPid) {
                    if (injectEntryUrl !== window.location.href) {
                        injectEntry();
                    }
                } else {
                    const hide$Element = $("#crack_container");
                    if (hide$Element.length > 0) {
                        hide$Element.remove();
                    }
                }
            } else {
                if (isHaiJiaoPid && injectEntryUrl !== window.location.href) {
                    injectEntry();
                }
            }
        });
        const removeArrList = [
            ".pagecontainer .containers",
            ".vipbtn",
            "span[data-sell]",
            ".preview-title"
        ];
        console.log("1", 1);
        function injectEntry() {
            const sellContainer = getSellerContainer();
            if (sellContainer) {
                let [pid] = window.location.search.match(/\d+/) || [];
                if (!pid) {
                    return;
                }
                const formatUrl2 = `${location.origin}/api/topic/${pid}`;
                injectEntryUrl = window.location.href;
                removeArrList.forEach((item) => $(item).remove());
                _GM_xmlhttpRequest({
                    method: "GET",
                    url: formatUrl2,
                    onload: function({ response }) {
                        const formatData = JSON.parse(response);
                        if (formatData == null ? void 0 : formatData.data) {
                            try {
                                const isStringData = Object.prototype.toString.call(formatData.data) === "[object String]";
                                let data = formatData.data;
                                if (isStringData) {
                                    data = JSON.parse(atob(atob(atob(formatData.data))));
                                }
                                const attachments = data.attachments;
                                const images = [];
                                const videos = [];
                                const audios = [];
                                attachments.forEach((element) => {
                                    if (element.category === "images") {
                                        images.push(element);
                                    } else if (element.category === "video") {
                                        videos.push(element);
                                    } else if (element.category === "audio") {
                                        audios.push(element);
                                    }
                                });
                                if ((videos == null ? void 0 : videos.length) > 0) {
                                    const usefulData = videos[0];
                                    const url = usefulData == null ? void 0 : usefulData.remoteUrl;
                                    if (url) {
                                        const isRealM3u8 = url.includes(".m3u8");
                                        if (isRealM3u8) {
                                            crackUrl(url);
                                        } else {
                                            const w = new W();
                                            const decodeUrl = w.decode(url);
                                            if (decodeUrl) {
                                                crackUrl(decodeUrl);
                                            }
                                        }
                                    }
                                }
                                if ((images == null ? void 0 : images.length) > 0) {
                                    mainCrackImage(images);
                                }
                                if ((audios == null ? void 0 : audios.length) > 0) {
                                    mainCrackAudio(audios);
                                }
                            } catch (error) {
                                console.log("海角解析失败了: ", error);
                            }
                        }
                    }
                });
            }
        }
        if (!isMobile()) {
            setTimeout(() => {
                mutationObserver.disconnect();
            }, 120 * 1e3);
        }
        mutationObserver.observe(document.body, {
            attributes: true,
            childList: true
        });
    })();

    function findSpanElement() {
        var spanLZ = document.querySelector("#details-page > div.header > div.statistics > div.atl-info.text-center > span:nth-child(1) > a");
        var spanTitle = document.querySelector("#details-page > div.header > h2 > span");
        if (spanLZ && spanTitle && spanLZ.innerText && spanTitle.innerText) {
            var spanLZText = spanLZ.innerText;
            var spanTitleText = spanTitle.innerText;
            var combinedText =  "[" + spanLZText + "]" + spanTitleText;
            console.log(combinedText);
            document.title = combinedText;
        } else {
            setTimeout(findSpanElement, 750); // 设置延时重新调用函数
        }
    }
    findSpanElement(); // 调用递归函数开始搜索
})(DPlayer, Hls, jQuery);
