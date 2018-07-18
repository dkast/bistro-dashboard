const INITIAL_STATE = {
  sideBarExpanded: false,
  sideBarSelected: "home"
};

const applySetSideBarExpanded = (state, action) => ({
  ...state,
  sideBarExpanded: action.sideBarExpanded
});

function uiReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SIDEBAR_EXPANDED_SET":
      return applySetSideBarExpanded(state, action);
      break;
    default:
      return state;
  }
}

export default uiReducer;
