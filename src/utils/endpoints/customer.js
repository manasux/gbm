const { defaults } = require('./defaults');

export const customer = {

    deleteCustomer: {
        v1: {
            ...defaults.methods.DELETE,
            ...defaults.versions.v1,
            uri: '/customers/contacts/:contactId',
        },
    },
    getCustomer: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/customers/:customerId',
        },
    },

    updateCustomer: {
        v1: {
            ...defaults.methods.PUT,
            ...defaults.versions.v1,
            uri: '/customers/:customerId',
        },
    },

    updateCustomerContents: {
        v1: {
            ...defaults.methods.POST,
            ...defaults.versions.v1,
            uri: '/party/:partyId/contents',
        },
    },

    // API endpoint to get customer documents

    getCustomerContents: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/party/:customerId/contents',
        },
    },

    // API endpoint to get all subscription plans
    getSubscriptionPlans: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/billing/plans',
        },
    },


    // API endpoint to delete customer contents
    deleteCustomerContents: {
        v1: {
            ...defaults.methods.DELETE,
            ...defaults.versions.v1,
            uri: '/party/:partyId/content/:contentId',
        },
    },

    allCustomers: {
        v1: {
            ...defaults.methods.GET,
            ...defaults.versions.v1,
            uri: '/customers',
        },
    },

    // API endpoint to Activate/Deactivate customer
    enableDisableCustomer: {
        v1: {
            ...defaults.methods.POST,
            ...defaults.versions.v1,
            uri: '/party/:partyId/:customerStatus',
        },
    },


};
