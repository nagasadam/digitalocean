import { dashboardConstants } from '../_constants';
import { dashboardService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const dashboardActions = {
    getData
};

function getData() {
    return dispatch => {
        dispatch(request());

        dashboardService.getData()
            .then(
                data => dispatch(success(data)),
                error => failure(error.toString())
            );
    };

    function request() { return { type: dashboardConstants.GETALL_REQUEST } }
    function success(data) { return { type: dashboardConstants.GETALL_SUCCESS, data } }
    function failure(error) { return { type: dashboardConstants.GETALL_FAILURE, error } }
}