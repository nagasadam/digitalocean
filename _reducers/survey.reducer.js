import { surveyConstants } from '../_constants';
import { func } from 'prop-types';
const initialState = {
    pending: false,
    questions: [],
    error: null
}

export function activesurvey(state = initialState, action){
  switch(action.type){
    case surveyConstants.GET_ACTIVE_REQUEST:
      return { loading: true };
    case surveyConstants.GET_ACTIVE_SUCCESS:
      return  action.activesurveys
    case surveyConstants.GET_ACTIVE_FAILURE:
      return { error: action.error };
      default:
        return state
  }
}

export function inactivesurvey(state = initialState, action){
  switch(action.type){
    case surveyConstants.GET_INACTIVE_REQUEST:
      return { loading: true };
    case surveyConstants.GET_INACTIVE_SUCCESS:
      return  action.inactivesurveys
    case surveyConstants.GET_INACTIVE_FAILURE:
      return { error: action.error };
      default:
        return state
  }
}

export function survey(state = initialState, action) {
  switch (action.type) {
    case surveyConstants.CREATE_REQUEST:
      return { loading: true };
    case surveyConstants.CREATE_SUCCESS:
      return {};
    case surveyConstants.CREATE_FAILURE:
      return {};
    case surveyConstants.UPDATE_REQUEST:
      return { loading: true };
    case surveyConstants.UPDATE_SUCCESS:
      return {};
    case surveyConstants.UPDATE_FAILURE:
      return {};
    case surveyConstants.UPDATE_STATUS_REQUEST:
      return { loading: true };
    case surveyConstants.UPDATE_STATUS_SUCCESS:
      return {};
    case surveyConstants.UPDATE_STATUS_FAILURE:
      return {};
    case surveyConstants.SUBMIT_ANSWER_REQUEST:
      return { loading: true };
    case surveyConstants.SUBMIT_ANSWER_SUCCESS:
      return {};
    case surveyConstants.SUBMIT_ANSWER_FAILURE:
      return {};
    case surveyConstants.GETALL_REQUEST:
      return { loading: true };
    case surveyConstants.GETALL_SUCCESS:
      return  action.surveys
    case surveyConstants.GETALL_FAILURE:
      return { error: action.error };

    case surveyConstants.GET_RESULT_REQUEST:
      return { loading: true };
    case surveyConstants.GET_RESULT_SUCCESS:
      return  action.result
    case surveyConstants.GET_RESULT_FAILURE:
      return { error: action.error };
    case surveyConstants.GET_COMMENT_REQUEST:
      return { loading: true };
    case surveyConstants.GET_COMMENT_SUCCESS:
      return  action.comments
    case surveyConstants.GET_COMMENT_FAILURE:
      return { error: action.error };
    case surveyConstants.GETLATEST_REQUEST:
      return { loading: true };
    case surveyConstants.GETLATEST_SUCCESS:
      return  action.latestsurveys
    case surveyConstants.GETLATEST_FAILURE:
      return { 
        error: action.error
      };
    case surveyConstants.GETBYID_REQUEST:
      return { loading: true };
    case surveyConstants.GETBYID_SUCCESS:
      return  action.survey
    case surveyConstants.GETBYID_FAILURE:
      return { error: action.error};

    case surveyConstants.SEARCH_REQUEST:
      return { loading: true };
    case surveyConstants.SEARCH_SUCCESS:
      return  action.searchresult
    case surveyConstants.SEARCH_FAILURE:
      return { error: action.error};

    case surveyConstants.VERIFY_DCODE_REQUEST:
      return { loading: true };
    case surveyConstants.VERIFY_DCODE_SUCCESS:
      return  action.survey
    case surveyConstants.VERIFY_DCODE_FAILURE:
      return { 
        error: action.error
      };
    case surveyConstants.DOWNLOAD_REPORT_REQUEST:
      return { loading: true };
    case surveyConstants.DOWNLOAD_REPORT_SUCCESS:
      return  action.reports
    case surveyConstants.DOWNLOAD_REPORT_FAILURE:
      return { 
        error: action.error
      };
    case surveyConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        loading: true
      };
    case surveyConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        
      };
    case surveyConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        error: action.error
          }
    default:
      return state
  }
}