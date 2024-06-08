import tools from '@/utils/tools';
import http from '@/utils/http';


export default {
    namespaced: true,

    state() {
        return {
            Items: null,
        }
    },
    getters: {
        Items: (state) => state.Items,
    },
    mutations: {
        setItems(state, value) {
            state.Items = value;
        },
    },
    actions: {
        getItems(context) {
            context.commit('setItems', null);
            const ep = http.api.baseApiUrl(`adv/panels_list`);
            function GetPromise(resolve, reject) {
                function OnThen(res) {
                    context.commit('setPanelList', res.data.payload);
                    resolve(res);
                }
                function OnCatch(err) {
                    reject(err.response);
                }
                function OnFinally() {}
                let params = {};
                http.api.client.get(ep, params).then(OnThen).catch(OnCatch).finally(OnFinally);
            }

            return new Promise((resolve, reject) => GetPromise(resolve, reject));
        },

    }
}
