import apiEndPoints from '@/utils/apiEndPoints';
import { callApi } from '@/utils/apiUtils';

// Add Company Page form creation API Services

export const createCompany = ({ body }) =>
  callApi({ uriEndPoint: apiEndPoints.company.createCompany.v1, body })
    .then((res) => res)
    .catch(() => {});

export const createCompanyPartners = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.createCompanyPartners.v1, body, pathParams })
    .then((res) => res)
    .catch(() => {});

export const createEmployee = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.createEmployee.v1, body, pathParams })
    .then((res) => res)
    .catch(() => {});

// Add Company Page form GET API Services

export const getCompanyList = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getCompanyList.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getCompanyDetail = ({ pathParams }) => {
  return callApi({ uriEndPoint: apiEndPoints.company.getCompanyDetail.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
};

export const getCompanyPartners = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getCompanyPartners.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getEmployeesInfo = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getEmployeesInfo.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getCompany = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getCompany.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

// Add Company Page form Update API Services

export const UpdateCompany = ({ body, pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.UpdateCompany.v1, body, pathParams })
    .then((res) => res)
    .catch(() => {});

export const updateCompanyPartners = ({ pathParams, body }) =>
  callApi({ uriEndPoint: apiEndPoints.company.updateCompanyPartners.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});

export const updateEmployeesInfo = ({ pathParams, body }) =>
  callApi({ uriEndPoint: apiEndPoints.company.updateEmployeesInfo.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});
// Add Company Page form DELETE API Services
export const deleteCompanyPartners = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.deleteCompanyPartners.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const deleteCompanyEmployees = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.deleteCompanyEmployees.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

// ********************* //

export const getAssigneeList = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getAssigneeList.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getParticularAssignee = ({ pathParams }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getParticularAssignee.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getSupervisors = ({ query }) =>
  callApi({ uriEndPoint: apiEndPoints.company.getSupervisors.v1, query })
    .then((res) => res)
    .catch((err) => err);
