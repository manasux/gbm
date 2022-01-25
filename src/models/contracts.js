import {
    getContracts,
    getContractCounts,
    sendContractRequest,
} from '@/services/contracts';


const Model = {
    namespace: 'contracts',
    state: {

    },
    effects: {


        *getContracts({ payload }, { call, put }) {
            const res = yield call(getContracts, payload);
            yield put({
                type: 'setStates',
                payload: res,
                key: 'contracts',
            });
        },
        *sendContractRequest({ payload }, { call, put }) {
            const res = yield call(sendContractRequest, payload);
            return res;
        },


        *getContractCounts({ payload }, { call, put }) {
            const res = yield call(getContractCounts, payload);
            yield put({
                type: 'setStates',
                payload: res?.contractsCount || res,
                key: 'contractsCount',
            });
        },
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
