import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import middleWare from "./apiMiddleware";

//import reducers
import catFactsReducer from "../appStore/reducers/catfactsReducer";

//combine multiple reducers
const reducers = combineReducers({
  catfactsList: catFactsReducer
});

export default function configureStore(initialState = {}) {
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk, middleWare.apiMiddleWare)
  );
  return store;
}
