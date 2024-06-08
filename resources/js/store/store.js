import { createStore } from 'vuex';
import items from './items';


export default createStore({
    state: {
        loading: false,
    },
    getters: {
        loading: (state) => state.loading,
    },
    mutations: {
        loadingOn: (state) => {
            state.loading = true;
        },
        loadingOff: (state) => {
            state.loading = false;
        },
    },
    modules: {
        model: items,
    },
});
