import Smooch from './smooch';

if (window.__onSmoochHostReady__) {
    window.__onSmoochHostReady__(Smooch);
} else {
    console.error('Script loader not found. Please check out the setup instructions.');
}
