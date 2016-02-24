var configureStore = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? require('./configure-prod') : require('./configure-dev')).configureStore;

export const store = configureStore({});
