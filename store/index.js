import { createStore, combineReducers, compose } from "redux";
import { reduxFirestore } from "redux-firestore";
import rootReducer from "./reducers";
import { firebase } from "../firebase";

// Provide timestamp settings to silence warning about deprecation
firebase.db.settings({ timestampsInSnapshots: true })

// Add reduxFirestore store enhancer to store createtor
const createStoreWithFirebase = compose(reduxFirestore(firebase.app))(createStore);

const initStore = () => {
  const store = createStoreWithFirebase(rootReducer);

  return store;
};

export default initStore;
