import isMobile from 'ismobilejs';

export function waitForPage() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve();
            });
        }
    });
}

export function preventMobilePageScroll() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.add('sk-widget-opened');
    if (isMobile.apple.device) {
        htmlEl.classList.add('sk-ios-device');
    }
}

export function allowMobilePageScroll() {
    const htmlEl = document.querySelector('html');
    htmlEl.classList.remove('sk-widget-opened');
    if (isMobile.apple.device) {
        htmlEl.classList.remove('sk-ios-device');
    }
}
