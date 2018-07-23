const INITIAL_STATE = {
  sideBarExpanded: false,
  sideBarSelected: "/"
};

const applySetSideBarExpanded = (state, action) => ({
  ...state,
  sideBarExpanded: action.sideBarExpanded
});

const applySetSideBarSelected = (state, action) => ({
  ...state,
  sideBarSelected: action.sideBarSelected
});

function uiReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SIDEBAR_EXPANDED_SET":
      return applySetSideBarExpanded(state, action);
      break;
    case "SIDEBAR_SELECTED_SET":
      return applySetSideBarSelected(state, action);
    default:
      return state;
  }
}

export default uiReducer;
