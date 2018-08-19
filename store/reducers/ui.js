const INITIAL_STATE = {
  sideBarExpanded: false,
  routeSelected: "/",
  notification: {
    visible: false,
    title: "",
    message: "",
    type: "success"
  }
};

const applySetSideBarExpanded = (state, action) => ({
  ...state,
  sideBarExpanded: action.sideBarExpanded
});

const applySetRouteSelected = (state, action) => ({
  ...state,
  routeSelected: action.routeSelected
});

const applySetNotification = (state, action) => ({
  ...state,
  notification: action.notification
});

function uiReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "SIDEBAR_EXPANDED_SET":
      return applySetSideBarExpanded(state, action);
      break;
    case "SIDEBAR_SELECTED_SET":
      return applySetRouteSelected(state, action);
      break;
    case "NOTIFICATION_SET":
      return applySetNotification(state, action);
      break;
    default:
      return state;
  }
}

export default uiReducer;
