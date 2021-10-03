import { userConstants } from '../_constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.UPDATE_REQUEST:
      return {
        loading: true
      };
    case userConstants.UPDATE_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.UPDATE_FAILURE:
      return { 
        error: action.error
      };

    case userConstants.GETBYID_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETBYID_SUCESS:
      return {
        items: action.users
      };
    case userConstants.GETBYID_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state
  }
}