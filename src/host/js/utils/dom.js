export function waitForPage(next) {
    if ((document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') && document.body) {
        next();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            next();
        });
    }
}
