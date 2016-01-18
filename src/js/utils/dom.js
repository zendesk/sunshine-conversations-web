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
