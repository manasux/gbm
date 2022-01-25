const { defaults } = require('./defaults');

export const hospital = {
  createHospital: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/customers',
    },
  },
  createHospitalContacts: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/customers/invite/staff/email',
    },
  },
  allHospital: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/customers',
    },
  },

  getAllHospitalStafs: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/customers/staff',
    },
  },
};
