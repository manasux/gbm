import {
    deleteCustomer,
    getCustomer,
    getSubscriptionPlans,
    allCustomers
} from '@/services/customer';


const Model = {
    namespace: 'customer',
    state: {
        customerRecord: null
    },
    effects: {
        *deleteCustomer({ payload }, { call }) {
            const res = yield call(deleteCustomer, payload);
            return res;
        },
        // API method to get all subscription plans
        *getSubscriptionPlans({ payload }, { call, put }) {
            const res = yield call(getSubscriptionPlans, payload);

            yield put({
                type: 'setStates',
                payload: res,
                key: 'subscriptionPlanList',
            });

            return res;
        },

        *getCustomer({ payload }, { call, put }) {
            const res = yield call(getCustomer, payload);
            yield put({
                type: 'setStates',
                payload: res,
                key: 'customerRecord',
            });
            return res;
        },
        // *allCustomers({ payload }, { call, put }) {
        //     let res;
        //     let err;
        //     try {
        //         res = yield call(allCustomers, payload);
        //         yield put({
        //             type: 'setStates',
        //             payload: res,
        //             key: 'customerList',
        //         });
        //     } catch (error) {
        //         err = error;
        //     }
        //     return { err, res };
        // },

    },
    reducers: {
        setStates(state, { payload, key }) {
            return {
                ...state,
                [key]: payload,
            };
        },
    },
};
export default Model;
