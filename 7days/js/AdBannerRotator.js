/**
 * Bottom ad slot: rotates images from ads/manifest.json, random order without repeating
 * the same creative twice in a row. Click opens the mapped URL when HEAD check is not 404.
 *
 * Uses absolute URLs for creatives so paths work from any page URL. If fetch(manifest) fails
 * (common with file://), falls back to DEFAULT_BANNER_FILES so images still load.
 */
(function () {
    const DEFAULT_BANNER_FILES = [
        'ascension1.PNG', 'ascension10.PNG', 'ascension11.PNG', 'ascension12.PNG', 'ascension2.PNG',
        'ascension3.PNG', 'ascension4.PNG', 'ascension5.PNG', 'ascension6.PNG', 'ascension7.PNG',
        'ascension8.PNG', 'ascension9.PNG', 'banners4.PNG', 'biosurge.PNG', 'foodsafe.PNG',
        'gridstatus.PNG', 'groundtruth.PNG', 'myair.PNG', 'neighborhoodscore.PNG', 'newssignal.PNG',
        'quotes.PNG', 'quotes1.PNG', 'quotes10.PNG', 'quotes11.PNG', 'quotes2.PNG', 'quotes3.PNG',
        'quotes4.PNG', 'quotes5.PNG', 'quotes6.PNG', 'quotes7.PNG', 'quotes8.PNG', 'quotes9.PNG',
        'rastacamp.PNG', 'rastacamp1.PNG', 'rastacamp10.PNG', 'rastacamp11.PNG', 'rastacamp2.PNG',
        'rastacamp3.PNG', 'rastacamp4.PNG', 'rastacamp5.PNG', 'rastacamp6.PNG', 'rastacamp7.PNG',
        'rastacamp8.PNG', 'rastacamp9.PNG', 'skywatch.PNG', 'terrorwell.PNG', 'terrorwell1.PNG',
        'terrorwell10.PNG', 'terrorwell2.PNG', 'terrorwell3.PNG', 'terrorwell4.PNG', 'terrorwell5.PNG',
        'terrorwell6.PNG', 'terrorwell7.PNG', 'terrorwell8.PNG', 'terrorwell9.PNG', 'tools.PNG',
        'tools1.PNG', 'tools2.PNG', 'tools3.PNG', 'tools4.PNG', 'topa.PNG', 'topa1.PNG', 'topa2.PNG',
        'topa3.PNG', 'topa4.PNG', 'topa5.PNG', 'watersafe.PNG',
    ];

    const ROTATE_MS = 4000;
    let initRequested = false;
    let rotatorStarted = false;
    let rotateTimer = null;

    const PREFIX_URLS = [
        ['terrorwell', 'https://play.google.com/store/apps/details?id=com.djudo.terrorwell&hl=en-US&ah=a29ead4YAUj3Cpdu47W1cdyvDw4'],
        ['topa', 'https://djudo.gumroad.com/l/grove'],
        ['ascension', 'https://ascension.rastacamp.com'],
        ['foodsafe', 'https://foodsafe.rastacamp.com'],
        ['biosurge', 'https://biosurge.rastacamp.com'],
        ['gridstatus', 'https://gridstatus.rastacamp.com'],
        ['groundtruth', 'https://groundtruth.rastacamp.com'],
        ['myair', 'https://myair.rastacamp.com'],
        ['neighborhoodscore', 'https://neighborhoodscore.rastacamp.com'],
        ['newssignal', 'https://newssignal.rastacamp.com'],
        ['quotes', 'https://quotes.rastacamp.com'],
        ['rastacamp', 'https://rastacamp.com'],
        ['skywatch', 'https://skywatch.rastacamp.com'],
        ['watersafe', 'https://watersafe.rastacamp.com'],
        ['banners', 'https://rastacamp.com'],
    ];

    function manifestUrl() {
        return new URL('ads/manifest.json', window.location.href).href;
    }

    function toAbsoluteAdPaths(filenames) {
        const adsDir = new URL('ads/', window.location.href);
        return filenames.map((f) => {
            const clean = String(f).replace(/^\/+/, '');
            return new URL(clean, adsDir).href;
        });
    }

    function fileBase(path) {
        const i = path.lastIndexOf('/');
        return (i >= 0 ? path.slice(i + 1) : path).toLowerCase();
    }

    function clickUrlForAsset(path) {
        const base = fileBase(path);
        if (base.startsWith('tools')) return null;
        for (let i = 0; i < PREFIX_URLS.length; i++) {
            const pre = PREFIX_URLS[i][0];
            if (base.startsWith(pre)) return PREFIX_URLS[i][1];
        }
        return null;
    }

    let toastHideTimer = null;
    function showComingSoon() {
        let el = document.getElementById('ad-coming-soon-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'ad-coming-soon-toast';
            el.className = 'ad-coming-soon-toast';
            document.body.appendChild(el);
        }
        el.textContent = 'Coming soon — this page is not live yet.';
        if (toastHideTimer) clearTimeout(toastHideTimer);
        requestAnimationFrame(() => {
            el.classList.add('ad-coming-soon-toast--visible');
        });
        if (window.game && typeof window.game.addMessage === 'function') {
            window.game.addMessage('Coming soon — this page is not live yet.');
        }
        toastHideTimer = setTimeout(() => {
            el.classList.remove('ad-coming-soon-toast--visible');
        }, 3800);
    }

    function openAdDestination(url) {
        fetch(url, { method: 'HEAD', mode: 'cors', redirect: 'follow', cache: 'no-cache' })
            .then((res) => {
                if (res.status === 404) {
                    showComingSoon();
                    return;
                }
                window.open(url, '_blank', 'noopener,noreferrer');
            })
            .catch(() => {
                window.open(url, '_blank', 'noopener,noreferrer');
            });
    }

    function pickNextIndex(n, last) {
        if (n <= 0) return -1;
        if (n === 1) return 0;
        let idx = Math.floor(Math.random() * n);
        let guard = 0;
        while (idx === last && guard++ < 16) {
            idx = Math.floor(Math.random() * n);
        }
        return idx;
    }

    function initAdBannerRotator() {
        const slot = document.getElementById('ad-banner-slot');
        const img = document.getElementById('ad-banner-img');
        const hit = document.getElementById('ad-banner-hit');
        if (!slot || !img || !hit || slot.getAttribute('data-ad-rotator') !== 'true') return;
        if (initRequested) return;
        initRequested = true;

        let paths = [];
        let lastIndex = -1;
        let currentUrl = null;

        function applyBanner(path) {
            currentUrl = clickUrlForAsset(path);
            img.src = path;
            img.alt = 'Advertisement';
            const linked = !!currentUrl;
            hit.classList.toggle('ad-banner-hit--linked', linked);
            hit.tabIndex = linked ? 0 : -1;
            hit.setAttribute('aria-label', linked ? 'Advertisement — open link' : 'Advertisement');
            if (linked) hit.setAttribute('role', 'link');
            else hit.setAttribute('role', 'img');
        }

        function showNext() {
            if (paths.length === 0) return;
            const idx = pickNextIndex(paths.length, lastIndex);
            lastIndex = idx;
            applyBanner(paths[idx]);
        }

        function startWithFilenames(list) {
            if (rotatorStarted) return;
            const files = Array.isArray(list) && list.length > 0 ? list : DEFAULT_BANNER_FILES;
            paths = toAbsoluteAdPaths(files);
            if (paths.length === 0) return;
            rotatorStarted = true;

            hit.addEventListener('click', () => {
                if (currentUrl) openAdDestination(currentUrl);
            });
            hit.addEventListener('keydown', (e) => {
                if (!currentUrl) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openAdDestination(currentUrl);
                }
            });

            let skipDepth = 0;
            img.addEventListener('error', () => {
                if (paths.length <= 1 || skipDepth > paths.length) return;
                skipDepth += 1;
                showNext();
            });
            img.addEventListener('load', () => {
                skipDepth = 0;
            });

            showNext();
            rotateTimer = setInterval(showNext, ROTATE_MS);
        }

        fetch(manifestUrl())
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('manifest not ok'))))
            .then((data) => {
                const list = data && Array.isArray(data.banners) ? data.banners : [];
                startWithFilenames(list.length > 0 ? list : DEFAULT_BANNER_FILES);
            })
            .catch(() => {
                startWithFilenames(DEFAULT_BANNER_FILES);
            });
    }

    window.initAdBannerRotator = initAdBannerRotator;

    window.addEventListener('DOMContentLoaded', () => {
        initAdBannerRotator();
    });
})();
