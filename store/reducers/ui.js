const INITIAL_STATE = {
  sideBarExpanded: false,
  routeSelected: "/"
};

const applySetSideBarExpanded = (state, action) => ({
  ...state,
  sideBarExpanded: action.sideBarExpanded
});

const applySetRouteSelected = (state, action) => ({
  ...state,
  routeSelected: action.routeSelected
});

function uiReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SIDEBAR_EXPANDED_SET":
      return applySetSideBarExpanded(state, action);
      break;
    case "SIDEBAR_SELECTED_SET":
      return applySetRouteSelected(state, action);
    default:
      return state;
  }
}

export default uiReducer;
