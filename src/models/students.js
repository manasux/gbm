import {
  getAllStudents,
  getStudent,
  getStudentTasks,
  setApproval,
  updateStudentDetails,
  getStudentUploadedNotes,
  getStudentUploadedAttachments,
  getStudentStats as getStudentStatService,
} from '@/services/student';

const StudentModel = {
  namespace: 'students',
  state: {
    studentList: null,
    student: null,
    taskList: null,
    studentNotes: [],
    studentAttachments: [],
    studentStats: null,
  },
  effects: {
    *getStudents({ payload }, { call, put }) {
      const response = yield call(getAllStudents, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'studentList',
      });
    },
    *getStudent({ payload }, { call, put }) {
      const response = yield call(getStudent, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'student',
      });
    },
    *updateStudentDetails({ payload }, { call, put }) {
      const response = yield call(updateStudentDetails, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'student',
      });
      return response;
    },
    *getStudentTasks({ payload }, { call, put }) {
      const response = yield call(getStudentTasks, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'taskList',
      });
      return response;
    },
    *setApproval({ payload }, { call, put, select }) {
      const res = yield call(setApproval, payload);
      const list = yield select((state) => state.students.studentList);
      list.records = list.records.filter((c) => c.partyId !== payload.studentId);
      yield put({
        type: 'setStates',
        payload: { ...list },
        key: 'studentList',
      });
      return res;
    },
    *approveStudent({ payload }, { call }) {
      const res = yield call(setApproval, payload);
      return res;
    },
    *getStudentTaskNotes({ payload }, { call, put }) {
      const res = yield call(getStudentUploadedNotes, payload);
      yield put({
        type: 'setStates',
        payload: res.notes,
        key: 'studentNotes',
      });
      return res;
    },
    *getStudentTaskAttachments({ payload }, { call, put }) {
      const res = yield call(getStudentUploadedAttachments, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'studentAttachments',
      });
      return res;
    },
    *getStudentStats({ payload }, { call, put }) {
      const res = yield call(getStudentStatService, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'StudentStats',
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
export default StudentModel;
