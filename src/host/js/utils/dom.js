export function waitForPage(next) {
    if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
        next();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            next();
        });
    }
}
