"use strict";
import * as axios from "axios";
import * as exceptionHandler from "./exceptionHandler";

export async function get(chunkUrl) {
    try {

        const response = await axios.get(chunkUrl, {
            params: {},
            headers: {
                Accept: "application/json",
            },
        });
        return response.data;

    } catch(error) {

        throw exceptionHandler.exceptionAxios(error);
        
    }
}