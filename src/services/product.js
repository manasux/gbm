import { callApi } from '@/utils/apiUtils';
import { product } from '@/utils/endpoints/product';

export const createProduct = (body) =>
  callApi({
    uriEndPoint: product.createProduct.v1,
    body,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const createDraft = (body) =>
  callApi({
    uriEndPoint: product.createDraft.v1,
    body,
  })
    .then((res) => ({ ...res, status: 'ok' }))
    .catch((err) => ({ ...err, status: 'notok' }));
export const allproducts = (query) =>
  callApi({ uriEndPoint: product.allProduct.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getProductBrands = ({ query }) => {
  return callApi({ uriEndPoint: product.getProductBrands.v1, query })
    .then((res) => res)
    .catch(() => {});
};

export const getMerchandiseBrands = (query) =>
  callApi({ uriEndPoint: product.getMerchandiseBrands.v1, query })
    .then((res) => res)
    .catch(() => {});
export const getContractTypeList = (query) =>
  callApi({ uriEndPoint: product.getContractTypeList.v1, query })
    .then((res) => res)
    .catch(() => {});
export const getProductfamilyList = ({ query }) =>
  callApi({ uriEndPoint: product.getProductfamilyList.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getDepartmentList = ({ query, pathParams }) =>
  callApi({ uriEndPoint: product.getDepartmentList.v1, query, pathParams })
    .then((res) => res)
    .catch(() => {});

export const getProductTypesList = (query) =>
  callApi({ uriEndPoint: product.productTypes.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const alldrafts = (query) =>
  callApi({ uriEndPoint: product.alldrafts.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getProductItem = ({ query }) =>
  callApi({ uriEndPoint: product.allProduct.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const addProductItems = (body) =>
  callApi({ uriEndPoint: product.createProduct.v1, body })
    .then((res) => res)
    .catch(() => {});

export const submitProduct = ({ pathParams }) =>
  callApi({ uriEndPoint: product.submitProduct.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);
export const getDocType = ({ query }) =>
  callApi({ uriEndPoint: product.docTypes.v1, query })
    .then((res) => res)
    .catch(() => {});

export const getApprovalHistory = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getApprovalHistory.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);

export const createPendingEquipment = ({ pathParams }) =>
  callApi({ uriEndPoint: product.createPendingEquipment.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getProductDocuments = ({ pathParams, query }) =>
  callApi({ uriEndPoint: product.getProductDocuments.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const getActivities = ({ pathParams, query }) =>
  callApi({ uriEndPoint: product.getActivities.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);
export const uploadDocuments = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: product.uploadDocuments.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const editUploadSharedDocuments = ({ pathParams, body }) =>
  callApi({
    uriEndPoint: product.editUploadSharedDocuments.v1,
    pathParams,
    body,
  })
    .then((res) => res)
    .catch(() => {});
export const updateContent = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.updateContent.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});

export const deleteUploadedDocuments = ({ pathParams }) =>
  callApi({ uriEndPoint: product.deleteUploadedDocuments.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const deleteProductDocument = ({ pathParams }) =>
  callApi({ uriEndPoint: product.deleteProductDocument.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const uploadDocs = ({ pathParams, query, body }) =>
  callApi({ uriEndPoint: product.uploadDocs.v1, pathParams, query, body })
    .then((res) => res)
    .catch(() => {});

export const addComments = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.addComments.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});

// API Services for PMS Attachment STARTs here
// ********************************************

export const addPmsAttachment = ({ body }) =>
  callApi({ uriEndPoint: product.addPmsAttachment.v1, body })
    .then((res) => res)
    .catch(() => {});

export const getPmsAttachment = ({ query }) =>
  callApi({ uriEndPoint: product.getPmsAttachment.v1, query })
    .then((res) => res)
    .catch(() => {});

export const deletePmsAttachments = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.deletePmsAttachments.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});

// API Services for PMS Attachment ENDs here
// *****************************************

// API Services for Complaint Attachment STARTs here
// ********************************************

export const addComplaintAttachment = ({ body }) =>
  callApi({ uriEndPoint: product.addComplaintAttachment.v1, body })
    .then((res) => res)
    .catch(() => {});
export const getComplaintAttachments = ({ query }) =>
  callApi({ uriEndPoint: product.getComplaintAttachments.v1, query })
    .then((res) => res)
    .catch(() => {});

export const deleteComplaintAttachment = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.deleteComplaintAttachment.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});

// API Services for Complaint Attachment ENDs here
// ********************************************

export const uploadContent = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.uploadContent.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});
export const updateDraft = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.updateDraft.v1, pathParams, body })
    .then((res) => res)
    .catch(() => {});

export const deleteProduct = ({ pathParams }) =>
  callApi({ uriEndPoint: product.deleteProduct.v1, pathParams })
    .then((res) => res)
    .catch(() => {});

export const deleteMerchandise = ({ pathParams }) =>
  callApi({ uriEndPoint: product.deleteMerchandise.v1, pathParams })
    .then((res) => res)
    .catch(() => {});
export const getDocuments = ({ pathParams, query }) =>
  callApi({ uriEndPoint: product.getDocuments.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});

export const fetchComments = ({ pathParams, query }) =>
  callApi({ uriEndPoint: product.fetchComments.v1, pathParams, query })
    .then((res) => res)
    .catch(() => {});
export const getProductDetails = ({ pathParams }) => {
  return callApi({ uriEndPoint: product.getProductDetails.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);
};

export const checkExistingProduct = (query) =>
  callApi({ uriEndPoint: product.checkExistingProduct.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const isProductAttributeExists = (query) =>
  callApi({ uriEndPoint: product.isProductAttributeExists.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getProductList = ({ query }) =>
  callApi({ uriEndPoint: product.productTypes.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const uploadGlobalDocuments = ({ pathParams, body, query }) =>
  callApi({
    uriEndPoint: product.uploadGlobalDocuments.v1,
    pathParams,
    body,
    query,
  })
    .then((res) => res)
    .catch((err) => err);
export const createProductComplaintsService = (body) =>
  callApi({ uriEndPoint: product.createProductComplaintsService.v1, body })
    .then((res) => res)
    .catch((err) => err);

export const getProductComplaints = ({ query }) =>
  callApi({ uriEndPoint: product.getProductComplaints.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getComplaintPreview = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getComplaintPreview.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);
export const getProductResultList = ({ query }) => {
  return callApi({ uriEndPoint: product.productList.v1, query })
    .then((res) => res)
    .catch((err) => err);
};

export const getProductResultDetail = ({ pathParams }) => {
  return callApi({ uriEndPoint: product.productResultDetail.v1, pathParams })
    .then((res) => res)
    .catch((err) => err);
};

export const recallProduct = ({ pathParams, query }) =>
  callApi({ uriEndPoint: product.recallProduct.v1, pathParams, query })
    .then((res) => res)
    .catch((err) => err);

export const getAllPMS = ({ query }) => callApi({ uriEndPoint: product.getAllPMS.v1, query });

export const getProductPMS = ({ query }) =>
  callApi({ uriEndPoint: product.getProductPMS.v1, query });

export const getTotalCountPMS = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getTotalCountPMS.v1, pathParams });

export const getTotalCountComplaints = ({ query }) =>
  callApi({ uriEndPoint: product.getTotalCountComplaints.v1, query });

export const getTotalBranchStats = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getTotalBranchStats.v1, pathParams });

export const getPmsHistory = ({ query }) =>
  callApi({ uriEndPoint: product.getPmsHistory.v1, query });

export const getParticularPMS = ({ pathParams }) =>
  callApi({ uriEndPoint: product.getParticularPMS.v1, pathParams });

export const addRatingFeedback = ({ pathParams, body }) =>
  callApi({ uriEndPoint: product.addRatingFeedback.v1, pathParams, body });

export const getFeedback = ({ query }) => callApi({ uriEndPoint: product.getFeedback.v1, query });

export const getGlobalSearchAllProducts = (query) =>
  callApi({ uriEndPoint: product.allProduct.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const getGlobalSearchPMS = ({ query }) =>
  callApi({ uriEndPoint: product.getProductPMS.v1, query });

export const getGlobalSearchComplaints = ({ query }) =>
  callApi({ uriEndPoint: product.getProductComplaints.v1, query })
    .then((res) => res)
    .catch((err) => err);

export const sendReminders = ({ body }) => callApi({ uriEndPoint: product.sendReminders.v1, body });
