import axios from 'axios';
import store from '@/store/store';

const axiosInstance = axios.create({});

const axiosProtectedInstance = axios.create({
    baseURL: import.meta.env.VITE_VUE_APP_PHP_API,
});

const axiosSSEProtectedInstance = axios.create({
    baseURL: import.meta.env.VITE_VUE_APP_PHP_API,
    headers: {
        'Accept': 'text/event-stream',
    },
    responseType: 'stream',
    adapter: 'fetch'
});
//const apiRel = "";
//DEBUG

const firebase = {
    apiKey: import.meta.env.VITE_VUE_APP_FIREBASE_API_KEY || 'missing-firebase-api-key',
    authDomain: import.meta.env.VITE_VUE_APP_FIREBASE_AUTH_DOMAIN || 'missing-firebase-auth-domain',
    databaseUrl: import.meta.env.VITE_VUE_APP_DATABASE_URL || 'missing-firebase-database-url',
    projectId: import.meta.env.VITE_VUE_APP_PROJECT_ID || 'missing-firebase-project-id',
    storageBucket: import.meta.env.VITE_VUE_APP_STORAGE_BUCKET || 'missing-firebase-storage-bucket',
    messagingSenderId: import.meta.env.VITE_VUE_APP_MESSAGING_SENDER_ID || 'missing-firebase-messaging-sender-id',
    appId: import.meta.env.VITE_VUE_APP_APP_ID || 'missing-firebase-app-id',
};

const firebaseApi = axios.create({
    baseURL: firebase.databaseUrl,
});

/*
if (process.env.VUE_APP_USERNAME && process.env.VUE_APP_PASSWORD) {
    const authString = process.env.VUE_APP_USERNAME + ":" + process.env.VUE_APP_PASSWORD;
    axiosInstance.defaults.headers.common['Authorization'] = "Basic " + btoa(authString);
}
*/

axiosProtectedInstance.interceptors.request.use((config) => {
    //console.log("Auth:", config);
    config.headers.Authorization = 'Bearer ' + store.getters.authToken;
    config.headers['X-User-Id'] = store.getters.authUserId;

    return config;
});

axiosSSEProtectedInstance.interceptors.request.use((config) => {
    //console.log("Auth:", config);
    config.headers.Authorization = 'Bearer ' + store.getters.authToken;
    config.headers['X-User-Id'] = store.getters.authUserId;
    return config;
});

axiosProtectedInstance.interceptors.response.use((res) => {
    //console.log("AXIOS RESP STATUS", res.status);
    return res;
});

axiosSSEProtectedInstance.interceptors.response.use((res) => {
    //console.log("AXIOS RESP STATUS", res.status);
    return res;
});

if (import.meta.env.VITE_VUE_APP_DEBUG) {
    axiosInstance.interceptors.request.use((c) => {
        //console.log("Axios REQUEST:", c);
        return c;
    });
    axiosInstance.interceptors.response.use((response) => {
        //console.log("Axios RESPONSE:", response);
        return response;
    });
    firebaseApi.interceptors.request.use((c) => {
        //console.log("ToFirebase REQUEST:", c);
        return c;
    });
    firebaseApi.interceptors.response.use((response) => {
        //console.log("ToFirebase RESPONSE:", response);
        return response;
    });
    axiosProtectedInstance.interceptors.request.use((c) => {
        //console.log("Axios PROTECTED REQUEST:", c);
        return c;
    });
    axiosProtectedInstance.interceptors.response.use(
        (response) => {
            //console.log("Axios PROTECTED RESPONSE:", response);
            return response;
        },
        (error) => {
            console.log(error);
            console.log(error.response.status);
            if (error.response.status === 403) {
                store.commit('logout');
                window.location.href = '/';
            }

            return Promise.reject(error);
        }
    );
}
export default {
    getUrl: (endpoint) => {
        //version = version || 1
        //return apiRel.replace("-version-", "v"+version) + endpoint;
        return endpoint;
    },
    withGetParams: (url, params) => {
        if (typeof params === 'object') {
            const keys = Object.keys(params);
            if (keys.length) {
                let c = 0;
                keys.forEach((k) => {
                    url += c > 0 ? '&' : '?';
                    url += k + '=' + encodeURIComponent(params[k]);
                    c++;
                });
            }
        }
        if (import.meta.env.VITE_VUE_APP_DEBUG) {
            console.log('PARAMS', params, 'URL', url);
        }
        return url;
    },
    firebase,
    firebaseApi,
    newErr: ({ msg }) => {
        return {
            data: {
                error: {
                    message: msg,
                },
            },
        };
    },
    firebaseEp: (context, url) => {
        const token = context.getters.authToken;
        const userId = context.getters.authUserId;
        const ep = url + '/' + userId + '.json?auth=' + token;
        //console.log("FIBA EP: ", ep);
        return ep;
    },
    client: axiosInstance,
    api: {
        client: axiosProtectedInstance,
        sse:axiosSSEProtectedInstance,
        paApiUrl(url) {
            return '/paapi' + url;
        },
        /**
         * @deprecated
         * @param url
         * @returns {string}
         */
        mwsApiUrl(url) {
            return '/mws' + url;
        },
        internalUrl(url) {
            return '/internal' + url;
        },
        baseApiUrl(url) {
            return '/' + url;
        },
    },
};
