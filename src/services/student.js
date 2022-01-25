import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

export const getAllStudents = ({ query, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudents.v1, query, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getStudent = (pathParams) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudent.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getStudentTasks = ({ pathParams, query }) =>
  callApi({ uriEndPoint: apiEndPoints.students.getStudentTasks.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const setApproval = (pathParams) =>
  callApi({ uriEndPoint: apiEndPoints.students.setApproval.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const updateStudentDetails = ({ body, studentId }) => {
  return callApi({
    uriEndPoint: apiEndPoints.students.updateStudentDetails.v1,
    body,
    pathParams: { studentId },
  })
    .then((res) => res)
    .catch(() => {});
};
export const getStudentUploadedNotes = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentTaskNotes.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const getStudentUploadedAttachments = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentTaskAssignment.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});

export const getStudentStats = ({ pathParams }) =>
  callApi({
    uriEndPoint: apiEndPoints.students.getStudentStats.v1,
    pathParams,
  })
    .then((res) => res)
    .catch(() => {});
