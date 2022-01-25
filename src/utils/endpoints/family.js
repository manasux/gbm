const { defaults } = require('./defaults');

export const family = {
  createFamily: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/families',
    },
  },
  getFamilies: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/families',
    },
  },
  getFamily: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/families/:familyId',
    },
  },
  updateFamily: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/families/:familyId',
    },
  },
  deleteFamily: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/families/:familyId',
    },
  },
};
