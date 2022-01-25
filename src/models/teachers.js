import {
  getAllTeachers,
  getTeacherTasks,
  getTeacherTaskAttachments,
  getTeacherTaskNotes,
  searchTasks as searchTeacherTasks,
} from '@/services/teacher';

const TeachersModal = {
  namespace: 'teachers',
  state: {
    teacherList: null,
    teacherTasks: null,
    teacherTaskNotes: [],
    teacherTaskAttachments: [],
  },
  effects: {
    *getAllTeachers({ payload }, { call, put }) {
      const response = yield call(getAllTeachers, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'teacherList',
      });
    },
    *getTeacherTasks({ payload }, { call, put }) {
      const response = yield call(getTeacherTasks, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'teacherTasks',
      });
    },
    *getTeacherTaskNotes({ payload }, { call, put }) {
      const response = yield call(getTeacherTaskNotes, payload);
      yield put({
        type: 'setStates',
        payload: response.notes,
        key: 'teacherTaskNotes',
      });
    },
    *getTeacherTaskAttachments({ payload }, { call, put }) {
      const response = yield call(getTeacherTaskAttachments, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'teacherTaskAttachments',
      });
    },
    *searchTasks({ payload }, { call, put }) {
      const response = yield call(searchTeacherTasks, payload);
      yield put({
        type: 'setStates',
        payload: response,
        key: 'teacherTasks',
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
export default TeachersModal;
