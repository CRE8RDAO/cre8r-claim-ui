import { configureStore } from "@reduxjs/toolkit";
import web3Reducer from "./slices/web3Slice";

import monitorReducersEnhancer from "./enhancers/monitorReducers";
import loggerMiddleware from "./middlewares/logger";

const rootReducer = {
  web3: web3Reducer,
};
export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(loggerMiddleware),
    preloadedState,
    enhancers: [monitorReducersEnhancer],
  });

  // if (process.env.NODE_ENV !== "production" && module.hot) {
  //   module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  // }

  return store;
}
