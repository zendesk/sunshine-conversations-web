var configureStore = (process.env.NODE_ENV === 'production' ? require('./configure-prod') : require('./configure-dev')).configureStore;

export const store = configureStore({});
