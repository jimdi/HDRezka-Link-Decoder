// ==UserScript==
// @name         HDRezka Link Decoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Decodes HDRezka tracking links to direct URLs
// @author       Jim_Di
// @match        https://rezka.ag/*
// @match        https://hdrezka.ag/*
// @match        https://rezka.fi/*
// @match        https://hdrezka.org/*
// @match        https://kvk.plus/*
// @grant        none
// @run-at       document-end
// @license MIT
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Проверка пути: только нужные разделы
    const VALID_PATHS = /^\/(films|series|cartoons|animation)\//;
    if (!VALID_PATHS.test(location.pathname)) return;
 
    function base64Decode(str) {
        try {
            return decodeURIComponent(
                atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            );
        } catch(e) { return null; }
    }
 
    function decodeHelpLinks() {
        const table = document.querySelector('table.b-post__info');
        if (!table) return;
 
        table.querySelectorAll('span[class^="b-post__info_rates"] a[href^="/help/"]')
            .forEach(link => {
                if (link.dataset.decoded) return;
                const match = link.href.match(/^https?:\/\/[^\/]+\/help\/([^\/]+)\/?$/);
                if (!match) return;
                const urlEncoded = base64Decode(match[1]);
                if (!urlEncoded) return;
                const decoded = decodeURIComponent(urlEncoded);
                link.href = decoded;
                link.dataset.decoded = '1';
            });
    }
 
    decodeHelpLinks();
    // Для динамической подгрузки контента (если используется SPA)
    const obs = new MutationObserver(decodeHelpLinks);
    obs.observe(document.body, { childList: true, subtree: true });
})();
