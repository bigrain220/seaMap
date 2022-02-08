import service from "@/network/require";

const request = {
    get(url, params, headers, options = {}) {
        if (params) {
            options.params = params
        }
        if (headers) {
            options.headers = headers
        }
        return service.get(url, options)
    },
    post(url, data, params, headers) {
        let options = {};

        if (params) {
            options.params = params
        }
        if (headers) {
            options.headers = headers
        }
        return service.post(url, data, options)
    },
    put(url,data, params, headers) {
        let options = {};

        if (params) {
            options.params = params
        }
        if (headers) {
            options.headers = headers
        }
        return service.put(url,data, options)
    },
    delete(url, params, headers) {
        let options = {};

        if (params) {
            options.params = params
        }
        if (headers) {
            options.headers = headers
        }
        return service.delete(url, options)
    }
};

export default request;
