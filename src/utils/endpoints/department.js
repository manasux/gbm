const { defaults } = require('./defaults');

export const department = {
  createDepartment: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/customers/:customerId/departments',
    },
  },
  getDepartments: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/customers/departments',
    },
  },
  deleteDepartment: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/customers/:customerId/departments/:departmentId',
    },
  },
  updateDepartment: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/customers/departments/:departmentId',
    },
  },
};
