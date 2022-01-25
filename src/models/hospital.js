import {
  allHospital,
  createHospital,
  createHospitalContacts,
  getAllHospitalStafs,
} from '@/services/hospital';

const Model = {
  namespace: 'hospital',
  state: {
    hospitalList: null,
  },
  effects: {
    *createHospital({ payload }, { call }) {
      const res = yield call(createHospital, payload);
      return res;
    },
    *allHospital({ payload }, { call, put }) {
      let res;
      let err;
      try {
        res = yield call(allHospital, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'hospitalList',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *createHospitalContacts({ payload }, { call }) {
      const res = yield call(createHospitalContacts, payload);
      return res;
    },

    *getAllHospitalStafs({ payload }, { call, put }) {
      let res;
      let err;
      try {
        res = yield call(getAllHospitalStafs, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'allhospitalStafsList',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
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
