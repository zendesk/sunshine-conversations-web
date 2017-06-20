import './utils/polyfills';
import './utils/raven';
import * as Smooch from './smooch';
parent.window.__onSmoochFrameReady__(Smooch);
