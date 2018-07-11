import { createStore, combineReducers, compose } from "redux";
import { reduxFirestore } from "redux-firestore";
import rootReducer from "./reducers";
import { firebase } from "../firebase";

// Add reduxFirestore store enhancer to store createtor
const createStoreWithFirebase = compose(reduxFirestore(firebase))(createStore);

const initStore = () => {
  const store = createStoreWithFirebase(rootReducer);

  return store;
};

export default initStore;
