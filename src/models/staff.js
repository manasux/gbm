import {
  createStaff,
  getStaffList,
  inviteUser,
  disableStaff,
  getStaffDetails,
  updateStaffDetails,
  staffClassAssociation,
  deleteStaffClassAssociation,
} from '@/services/staff';

const Model = {
  namespace: 'staff',
  state: {
    0: null,
    classInfo: null,
    staffDetails: null,
    staffList: null,
  },
  effects: {
    *createStaff({ payload, cb }, { call }) {
      const res = yield call(createStaff, payload);
      if (cb) cb(res);
      return res;
    },
    *inviteUser({ payload, cb }, { call }) {
      const res = yield call(inviteUser, payload);
      if (cb) cb(res);
      return res;
    },
    *getStaffList({ payload }, { call, put }) {
      const res = yield call(getStaffList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'staffList',
      });
    },
    *disableStaff({ payload }, { call, select, put }) {
      const res = yield call(disableStaff, payload);
      if (res) {
        const list = yield select((state) => state.staff.staffList);
        const index = list.result.findIndex((p) => p.id === payload.pathParams.staffId);
        list.result[index].enabled = payload.pathParams.type === 'deactivate' ? 'N' : 'Y';
        yield put({
          type: 'setStates',
          payload: { ...list },
          key: 'staffList',
        });
      }
      return res;
    },
    *getStaffDetails({ payload }, { call, put }) {
      const response = yield call(getStaffDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'staffDetails',
      });
    },
    *updateStaffDetails({ payload }, { call, put }) {
      const response = yield call(updateStaffDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'staffDetails',
      });
      return response;
    },
    *staffClassAssociation({ payload }, { call }) {
      const res = yield call(staffClassAssociation, payload);
      return res;
    },
    *deleteStaffClassAssociation({ payload }, { call }) {
      const res = yield call(deleteStaffClassAssociation, payload);
      return res;
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
