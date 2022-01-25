const { defaults } = require('./defaults');

export const common = {
  uploadContent: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/content',
      headerProps: {
        'Content-Type': 'multipart/form-data',
      },
    },
  },
  pinCodeContent: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/common/check/postal/code/:pinCode',
    },
  },
  checkServer: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/ping',
    },
  },
};
