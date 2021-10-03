import { questionbankConstants } from '../_constants';
const initialState = {
    pending: false,
    questions: [],
    error: null
}

export function questionbank(state = initialState, action) {
  switch (action.type) {
    case questionbankConstants.CREATE_REQUEST:
      return { loading: true };
    case questionbankConstants.CREATE_SUCCESS:
      return {};
    case questionbankConstants.CREATE_FAILURE:
      return {};
    case questionbankConstants.UPDATE_REQUEST:
      return { loading: true };
    case questionbankConstants.UPDATE_SUCCESS:
      return {};
    case questionbankConstants.UPDATE_FAILURE:
      return {};
    case questionbankConstants.GETALL_REQUEST:
      return { loading: true };
    case questionbankConstants.GETALL_SUCCESS:
      return  action.questions
      
    case questionbankConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case questionbankConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        loading: true
      };
    case questionbankConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        question: state.questions && state.questions.filter(question => question._id !== action._id)
      };
    case questionbankConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        error: action.error
          }
    default:
      return state
  }
}

export const createQuestionBank = state => state.questions;
export const createQuestionBankPending = state => state.pending;
export const createQuestionBankError = state => state.error;