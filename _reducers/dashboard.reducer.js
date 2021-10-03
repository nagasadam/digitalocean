import { dashboardConstants } from '../_constants';
const initialState = {
    pending: false,
    data: [],
    error: null
}

export function dashboard(state = initialState, action) {
  switch (action.type) {
    case dashboardConstants.GETALL_REQUEST:
      return { loading: true };
    case dashboardConstants.GETALL_SUCCESS:
      return  {data: action.data}
    case dashboardConstants.GETALL_FAILURE:
      return { error: action.error };
    default:
      return state
  }
}