const { defaults } = require('./defaults');

export const contracts = {
    sendContractRequest: {
        v1: {
            ...defaults.methods.POST,
            ...defaults.versions.v1,
            uri: '/contracts/renewal/request',
        },
    },

    getContracts: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/contracts',
        },
    },


    getContractCounts: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/contracts/count',
        },
    },


};
