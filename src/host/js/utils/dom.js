export function waitForPage(next) {
    if ((document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') && document.body) {
        next();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            next();
        });
    }
}

export function generateMediaQuery(rule) {
    const parts = ['screen'];

    if (rule.minHeight) {
        parts.push(`(min-height: ${rule.minHeight}px)`);
    }

    if (rule.maxHeight) {
        parts.push(`(max-height: ${rule.maxHeight}px)`);
    }

    if (rule.minWidth) {
        parts.push(`(min-width: ${rule.minWidth}px)`);
    }

    if (rule.maxWidth) {
        parts.push(`(max-width: ${rule.maxWidth}px)`);
    }
    return parts.join(' and ');
}
