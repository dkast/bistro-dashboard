import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import sessionReducer from "./session";
import uiReducer from "./ui";

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  uiState: uiReducer,
  firestoreState: firestoreReducer
});

export default rootReducer;
