var configureStore = (process.env.NODE_ENV === 'development' ? require('./configure-dev') : require('./configure-prod')).configureStore;

export const store = configureStore({});
