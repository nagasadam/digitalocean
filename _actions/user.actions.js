import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { store } from 'react-notifications-component';

export const userActions = {
    login,
    logout,
    forgot,
    update,
    register,
    getAll,
    getById,
    delete: _delete
};

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function forgot(user){
    return dispatch => {
        dispatch(request(user));

        userService.forgot(user)
            .then(
                user => {
                    store.addNotification({
                        title: 'User',
                        message: 'Reset Link Sent Successfully',
                        type: 'success',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                    history.push('/');
                },
                error => {
                    // dispatch(failure(error.toString()));
                    store.addNotification({
                        title: 'User',
                        message: error.toString(),
                        type: 'success',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                }
            )
    }

    function request(user) { return { type: userConstants.FORGOT_FAILURE, user } }
    function success(user) { return { type: userConstants.FORGOT_SUCESS, user } }
    function failure(error) { return { type: userConstants.FORGOT_FAILURE, error } }
}

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => { 
                    store.addNotification({
                        title: 'User',
                        message: 'Login Successful',
                        type: 'success',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                    history.push('/');
                },
                error => {
                    console.log(error)
                    // dispatch(failure(error.toString()));
                    store.addNotification({
                        title: 'User',
                        message: error.toString(),
                        type: 'danger',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function register(firstName, lastName, email, password) {
    return dispatch => {
        dispatch(request({email}));

        userService.register({firstName, lastName, email, password})
            .then(
                user => { 
                    dispatch(success());
                    store.addNotification({
                        title: 'User',
                        message: 'SignUp Successful',
                        type: 'success',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                    history.push('/');
                },
                error => {
                    // dispatch(failure(error.toString()));
                    store.addNotification({
                        title: 'User',
                        message: 'SignUp Failed',
                        type: 'danger',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function update(user) {
    return dispatch => {
        userService.update(user)
        .then(
            user => { 
                store.addNotification({
                    title: 'User Profile',
                    message: 'Update Successful',
                    type: 'success',             // 'default', 'success', 'info', 'warning'
                    container: 'top-right',                // where to position the notifications
                    animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                    animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                    dismiss: {
                      duration: 10000 
                    }
                  })
                },
                error => {
                    // dispatch(failure(error.toString()));
                    store.addNotification({
                        title: 'User Profile',
                        message: 'Update Failed',
                        type: 'danger',             // 'default', 'success', 'info', 'warning'
                        container: 'top-right',                // where to position the notifications
                        animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                        animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                        dismiss: {
                          duration: 10000 
                        }
                      })
                }
            );
    };

    function request(user) { return { type: userConstants.UPDATE_REQUEST, user } }
    function success(user) { return { type: userConstants.UPDATE_SUCCESS, user, message: 'Update Successful'} }
    function failure(error) { return { type: userConstants.UPDATE_FAILURE, error, message: 'Update Failed'} }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function getById() {
    return dispatch => {
        dispatch(request());

        userService.getById()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            ) ;
    };

    function request() { return { type: userConstants.GETBYID_REQUEST } }
    function success(users) { return { type: userConstants.GETBYID_SUCESS, users} }
    function failure(error) { return { type: userConstants.GETBYID_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}