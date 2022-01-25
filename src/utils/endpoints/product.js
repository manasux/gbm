const { defaults } = require('./defaults');

export const product = {
  uploadDocuments: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/:prodId/content',
    },
  },
  addComments: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/party/:party_id/communication',
    },
  },

  // API Endpoints for PMS attachment STARTs here
  // ********************************************
  addPmsAttachment: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/assets/pms/attachment',
    },
  },
  getPmsAttachment: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/assets/pms/attachments',
    },
  },

  deletePmsAttachments: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/assets/pms/content/:contentId',
    },
  },

  // API Endpoints for PMS attachment ENDs here
  // ********************************************

  // API Endpoints for complaint attachment STARTs here
  // ********************************************

  addComplaintAttachment: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/complaints/attachment',
    },
  },

  deleteComplaintAttachment: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/complaints/content/:contentId',
    },
  },
  getComplaintAttachments: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/complaints/attachments',
    },
  },

  // API Endpoints for complaint attachment ENDs here
  // ********************************************

  editUploadSharedDocuments: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:productId/content/:contentId',
    },
  },
  updateContent: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:productId/content/:contentId',
    },
  },
  deleteUploadedDocuments: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/:productId/content/:contentId',
    },
  },
  deleteProductDocument: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/:productId/content/:contentId',
    },
  },
  uploadDocs: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/:id/content',
      headerProps: {
        'Content-Type': 'multipart/form-data',
      },
    },
  },

  uploadContent: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/:productId/upload',
    },
  },
  updateDraft: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:productId',
    },
  },
  deleteProduct: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/:productId',
    },
  },
  getDocuments: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:productId/content',
    },
  },
  fetchComments: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/party/:party_id/communications',
    },
  },
  docTypes: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/content/types',
    },
  },
  createPendingEquipment: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:mainId/drafts/convert',
    },
  },
  getApprovalHistory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:productId/activities/approval',
    },
  },
  getProductDocuments: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:productId/content',
    },
  },
  getActivities: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:productId/activities',
    },
  },
  deleteMerchandise: {
    v1: {
      ...defaults.methods.DELETE,
      ...defaults.versions.v1,
      uri: '/products/:productId',
    },
  },
  createProduct: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
  submitProduct: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:productId/drafts/:draftId/convert',
    },
  },
  createDraft: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/drafts',
    },
  },
  allProduct: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
  uploadGlobalDocuments: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/:prodId/content',
      headerProps: {
        'Content-Type': 'multipart/form-data',
      },
    },
  },
  productResultDetail: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:productId',
    },
  },

  productList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/complaints',
    },
  },
  recallProduct: {
    v1: {
      ...defaults.methods.PUT,
      ...defaults.versions.v1,
      uri: '/products/:productId/status',
    },
  },
  getProductBrands: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/suppliers',
    },
  },
  getContractTypeList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/contract/types',
    },
  },
  getProductfamilyList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/families',
    },
  },

  getDepartmentList: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/customers/:customerId/departments',
    },
  },
  productTypes: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/types',
    },
  },
  alldrafts: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products',
    },
  },
  getProductDetails: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/:productId',
    },
  },
  checkExistingProduct: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/isExistingProductId',
    },
  },
  isProductAttributeExists: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/isExistingProductAttribute',
    },
  },
  getMerchandiseBrands: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/suppliers',
    },
  },
  getProductComplaints: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/complaints',
    },
  },

  getAllPMS: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/assets/stats',
    },
  },

  getProductPMS: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/assets/services',
    },
  },
  getTotalCountComplaints: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/complaints/count',
    },
  },

  getTotalBranchStats: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/customers/branches/:branchId',
    },
  },

  getTotalCountPMS: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/customers/:customerId/services/count',
    },
  },

  createProductComplaintsService: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/products/complaints',
    },
  },
  getComplaintPreview: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/products/complaints/:productId',
    },
  },
  getPmsHistory: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/assets/services',
    },
  },
  getParticularPMS: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/assets/:asset_id/services/:service_id',
    },
  },
  addRatingFeedback: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/party/:partyId/feedback',
    },
  },
  getFeedback: {
    v1: {
      ...defaults.methods.GET,
      ...defaults.versions.v1,
      uri: '/party/feedback',
    },
  },
  sendReminders: {
    v1: {
      ...defaults.methods.POST,
      ...defaults.versions.v1,
      uri: '/customers/send/email',
    },
  },

  /* comment it For now */
  // getProductResultList: {
  //   v1: {
  //     ...defaults.methods.GET,
  //     ...defaults.versions.v1,
  //     uri: '/products/result/:productId',
  //   },
  // },
};
