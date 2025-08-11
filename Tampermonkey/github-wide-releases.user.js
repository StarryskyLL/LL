// ==UserScript==
// @name         GitHubReleases全宽显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅对 GitHub Releases 页面去除宽度限制，实现全宽显示
// @author       lay
// @match        https://github.com/*/*/releases*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面元素加载完毕
    function applyWideStyle() {
        const containerXL = document.querySelector('.application-main .container-xl');
        if (containerXL) {
            containerXL.style.maxWidth = 'none';
        }
        const containerLG = document.querySelector('.application-main .container-lg');
        if (containerLG) {
            containerLG.style.maxWidth = 'none';
            containerLG.style.marginLeft = '0';
        }
        const boxContainer = document.querySelector('#js-repo-pjax-container div[style^="--sticky-pane-height:"] > div[class^="Box-sc-"]');
        if (boxContainer) {
            boxContainer.style.maxWidth = 'none';
        }
    }

    // 直接运行一次
    applyWideStyle();

    // GitHub 有时用 PJAX 加载内容，动态监听 URL 变化重新应用样式
    let lastURL = location.href;
    new MutationObserver(() => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            applyWideStyle();
        }
    }).observe(document, {subtree: true, childList: true});
})();
