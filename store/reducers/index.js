import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import sessionReducer from "./session";
import userReducer from "./user";

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  firestoreState: firestoreReducer
});

export default rootReducer;
