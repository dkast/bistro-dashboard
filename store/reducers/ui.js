const INITIAL_STATE = {
  sideBarExpanded: false,
  routeSelected: "/",
  showNotification: false
};

const applySetSideBarExpanded = (state, action) => ({
  ...state,
  sideBarExpanded: action.sideBarExpanded
});

const applySetRouteSelected = (state, action) => ({
  ...state,
  routeSelected: action.routeSelected
});

const applySetShowNotification = (state, action) => ({
  ...state,
  showNotification: action.showNotification
});

function uiReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SIDEBAR_EXPANDED_SET":
      return applySetSideBarExpanded(state, action);
      break;
    case "SIDEBAR_SELECTED_SET":
      return applySetRouteSelected(state, action);
      break;
    case "SHOW_NOTIFICATION_SET":
      return applySetShowNotification(state, action);
      break;
    default:
      return state;
  }
}

export default uiReducer;
