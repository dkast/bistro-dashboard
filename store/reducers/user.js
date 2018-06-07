const INITIAL_STATE = {
  users: []
};

const applySetUsers = (state, action) => ({
  ...state,
  users: action.users
});

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "USERS_SET":
      return applySetUsers(state, action);
      break;
    default:
      return state;
  }
}

export default userReducer;
