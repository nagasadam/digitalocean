import { questionbankConstants } from '../_constants';
import { questionbankService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const questionbankActions = {
    create,
    getAll,
    update,
    _delete
};

function create(question) {
    return dispatch => {
        dispatch(request(question));

        questionbankService.create(question)
            .then(
                question => { 
                    dispatch(success());
                    dispatch(alertActions.success('Question Created Successful'));
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(question) { return { type: questionbankConstants.CREATE_REQUEST, question } }
    function success(question) { return { type: questionbankConstants.CREATE_SUCCESS, question } }
    function failure(error) { return { type: questionbankConstants.CREATE_FAILURE, error } }
}

function update(id, question) {
    return dispatch => {
        dispatch(request(id, question))

        questionbankService.update(id, question)
            .then(
                question => {
                    dispatch(success());
                    dispatch(alertActions.success('Question Updated Successful'));
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            )
    }
    function request(question) { return { type: questionbankConstants.UPDATE_REQUEST, question } }
    function success(question) { return { type: questionbankConstants.UPDATE_SUCCESS, question } }
    function failure(error) { return { type: questionbankConstants.UPDATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        questionbankService.getAll()
            .then(
                questions => dispatch(success(questions)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: questionbankConstants.GETALL_REQUEST } }
    function success(questions) { return { type: questionbankConstants.GETALL_SUCCESS, questions } }
    function failure(error) { return { type: questionbankConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));
        questionbankService.delete(id)
            .then(
                user => {
                    dispatch(success(id));
                    history.push('/admin/group');
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: questionbankConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: questionbankConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: questionbankConstants.DELETE_FAILURE, id, error } }
}