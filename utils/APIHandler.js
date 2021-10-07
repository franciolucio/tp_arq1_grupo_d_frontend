"use strict";
import * as axios from "axios";
import * as exceptionHandler from "./exceptionHandler";

export async function create(chunkEndUrl, params) {
    var config = {
        method: 'post',
        url: chunkEndUrl,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : params
    };
    axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(error => {
            throw exceptionHandler.exceptionAxios(error);
        });
}

export async function get(chunkUrl) {
    try {
        const response = await axios.get(chunkUrl, {
            headers: {
                Accept: "application/json",
            },
        });
        return response.data;
    } catch(error) {
        throw exceptionHandler.exceptionAxios(error);
    }
}

export async function update(chunkEndUrl, params) {
    var config = {
        method: 'put',
        url: chunkEndUrl,
        headers: { 
            'Content-Type': 'application/json'
        },
        data : params
    };
    axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(error => {
            throw exceptionHandler.exceptionAxios(error);
        });
}

export async function remove(chunkEndUrl, params) {
    await axios
        .delete(chunkEndUrl, {
            data: params,
            headers: {
                Accept: "application/json",
            },
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw exceptionHandler.exceptionAxios(error);
        });
}