// 'use strict';

import { Notification } from 'element-ui';

/**
 *
 * @param error
 * @returns {*}
 */
export function exceptionAxios(error) {
    let errorRes = '';
    if(error['response']['data']){
        errorRes = error['response']['data'];
    }else{
        errorRes = error;
    }
    return errorRes;
}

/**
 *
 * @param title
 * @param error
 */
export function exceptionWarning(title,error) {
    let msg = '';
    if(error["msg"]) {
        msg = error["msg"];
    } else {
        msg = error;
    }
    Notification.warning({
        title: title,
        message: msg,
        type: 'warning'
    });

}