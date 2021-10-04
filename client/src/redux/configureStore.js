import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  // Reducers should be added into the object below as key: reducer
  //   combineReducers({}),
  composeWithDevTools()
);

export { store };
