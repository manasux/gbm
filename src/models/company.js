import {
  getCompanyList,
  getAssigneeList,
  getParticularAssignee,
  createCompany,
  createEmployee,
  getSupervisors,
  getCompanyPartners,
  getCompanyDetail,
  getEmployeesInfo,
  createCompanyPartners,
  getCompany,
  updateCompanyPartners,
  updateEmployeesInfo,
  UpdateCompany,
  deleteCompanyPartners,
  deleteCompanyEmployees,
} from '@/services/company';

const Model = {
  namespace: 'company',
  state: {
    assigneeList: [],
    companyDetail: {},
    companyPartnerDetail: {},
    companyEmployeeInfo: {},
  },
  effects: {
    // Add Company Page form Creation API methods

    *createCompany({ payload }, { call, put }) {
      const res = yield call(createCompany, payload);
      return res;
    },
    *createCompanyPartners({ payload }, { call, put }) {
      const res = yield call(createCompanyPartners, payload);
      return res;
    },
    *createEmployee({ payload }, { call, put }) {
      const res = yield call(createEmployee, payload);
      return res;
    },

    // Add Company Page form GET API methods

    *getCompanyList({ payload }, { call, put }) {
      const res = yield call(getCompanyList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'companyList',
      });
    },
    *getCompanyDetail({ payload }, { call, put }) {
      const res = yield call(getCompanyDetail, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'companyDetail',
      });
      return res;
    },
    *getCompany({ payload }, { call, put }) {
      const res = yield call(getCompany, payload);
      return res;
    },
    *getCompanyPartners({ payload }, { call, put }) {
      const res = yield call(getCompanyPartners, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'companyPartnerDetail',
      });
      return res;
    },

    *getEmployeesInfo({ payload }, { call, put }) {
      const res = yield call(getEmployeesInfo, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'companyEmployeeInfo',
      });
      return res;
    },

    // Add Company Page form Update API methods

    *UpdateCompany({ payload }, { call, put }) {
      const res = yield call(UpdateCompany, payload);
      return res;
    },

    *updateCompanyPartners({ payload }, { call, put }) {
      const res = yield call(updateCompanyPartners, payload);
      return res;
    },

    *updateEmployeesInfo({ payload }, { call, put }) {
      const res = yield call(updateEmployeesInfo, payload);
      return res;
    },
    // Add Company Page form DELETE API methods
    *deleteCompanyPartners({ payload }, { call, put }) {
      const res = yield call(deleteCompanyPartners, payload);
      return res;
    },

    *deleteCompanyEmployees({ payload }, { call, put }) {
      const res = yield call(deleteCompanyEmployees, payload);
      return res;
    },
    // ***************************//

    *getAssigneeList({ payload }, { call, put }) {
      const res = yield call(getAssigneeList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'assigneeList',
      });
    },
    *getParticularAssignee({ payload }, { call, put }) {
      const res = yield call(getParticularAssignee, payload);
      return res;
    },

    *getSupervisors({ payload }, { call, put }) {
      const res = yield call(getSupervisors, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'supervisorList',
      });
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
