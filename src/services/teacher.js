import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

export const getAllTeachers = (query) =>
  callApi({ uriEndPoint: apiEndPoints.teachers.getTeachers.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getTeacherTasks = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.teachers.getTeacherTasks.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const searchTasks = ({ query }) =>
  callApi({ uriEndPoint: apiEndPoints.teachers.searchTasks.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getTeacherTaskNotes = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.teachers.getTaskNote.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getTeacherTaskAttachments = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.teachers.getTaskAttachment.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
