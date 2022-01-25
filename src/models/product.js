/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import moment from 'moment';
import {
  createProduct,
  addComments,
  fetchComments,
  allproducts,
  getProductBrands,
  getContractTypeList,
  getProductfamilyList,
  getDepartmentList,
  getProductTypesList,
  getProductDetails,
  addProductItems,
  getDocType,
  uploadDocuments,
  getProductItem,
  getProductList,
  getDocuments,
  getMerchandiseBrands,
  createDraft,
  updateDraft,
  alldrafts,
  submitProduct,
  getActivities,
  deleteProduct,
  deleteMerchandise,
  uploadDocs,
  uploadContent,
  getProductDocuments,
  updateContent,
  deleteUploadedDocuments,
  getApprovalHistory,
  editUploadSharedDocuments,
  deleteProductDocument,
  uploadGlobalDocuments,
  createPendingEquipment,
  recallProduct,
  createProductComplaintsService,
  getProductComplaints,
  getComplaintPreview,
  getProductResultList,
  getProductPMS,
  getTotalCountPMS,
  getTotalCountComplaints,
  getPmsHistory,
  getParticularPMS,
  addRatingFeedback,
  getFeedback,
  getGlobalSearchAllProducts,
  getGlobalSearchPMS,
  getGlobalSearchComplaints,
  sendReminders,
  getProductResultDetail,
  getAllPMS,
  addPmsAttachment,
  getPmsAttachment,
  deletePmsAttachments,
  getComplaintAttachments,
  addComplaintAttachment,
  deleteComplaintAttachment,
  getTotalBranchStats,
} from '@/services/product';

const Model = {
  namespace: 'product',
  state: {
    pending: null,
    verified: null,
    productList: null,
    brandsList: null,
    ProductTypesList: null,
    ProductSubType: null,
    ProductSubTypesList: null,
    departmentList: null,
    productFamilyList: null,
    contractTypeList: null,
    docType: null,
    sharedDoc: null,
    internalDoc: null,
    docSubType: null,
    ProductItem: null,
    ProductAccessory: null,
    ProductType: null,
    ProductModel: null,
    contractSubType: null,
    contractSubList: null,
    itemProductType: null,
    itemProductSubType: null,
    accessoryProductType: null,
    ProductComplaint: null,
    closedComplaints: null,
    productResultDetail: null,
  },
  effects: {
    *createProduct({ payload }, { call }) {
      let res;
      let err;
      try {
        res = yield call(createProduct, payload);
      } catch (error) {
        err = error;
      }
      return { res, err };
    },
    *createDraft({ payload }, { call }) {
      let res;
      let err;
      try {
        res = yield call(createDraft, payload);
      } catch (error) {
        err = error;
      }
      return { res, err };
    },
    *allproducts({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(allproducts, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: payload.status_id === 'PENDING' ? 'pending' : 'verified',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *allMerchandiseDrafts({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(alldrafts, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: payload.assoc_type_id === 'PRODUCT_ITEM' ? 'itemDrafts' : 'accessoryDrafts',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *getDocuments({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(getDocuments, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: payload.query.document_type === 'SHARED_DOC' ? 'sharedDoc' : 'internalDoc',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },
    *getProductTypesList({ payload }, { call, put }) {
      const res = yield call(getProductTypesList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductTypesList',
      });
      return res;
    },
    *alldrafts({ payload }, { call, put }) {
      const res = yield call(alldrafts, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'drafts',
      });
      return res;
    },
    *addProductItems({ payload }, { call }) {
      const res = yield call(addProductItems, payload);
      return res;
    },
    *submitProduct({ payload }, { call }) {
      const res = yield call(submitProduct, payload);
      return res;
    },
    *updateDraft({ payload }, { call, put, select }) {
      const res = yield call(updateDraft, payload);

      if (res?.responseMessage === 'success') {
        let copyOfProductDetail = yield select((state) => state?.product?.productDetail);

        const updatedDetails = {
          has_warranty: payload?.body?.has_warranty,
          warranty: payload?.body?.warranty_details?.warranty,
          pms: payload?.body?.pms_details?.pms,
          warranty_start_date: payload?.body?.warranty_start_date,
          warranty_end_date: payload?.body?.warranty_end_date
        }

        copyOfProductDetail = { ...copyOfProductDetail, ...updatedDetails }

        yield put({
          type: 'setStates',
          payload: copyOfProductDetail,
          key: 'productDetail',
        });
      }
      return res;
    },
    *updateAfterWarrantyDraft({ payload }, { call, put, select }) {
      const res = yield call(updateDraft, payload);

      return res;
    },
    *createPendingEquipment({ payload }, { call }) {
      const res = yield call(createPendingEquipment, payload);
      return res;
    },
    *uploadGlobalDocuments({ payload }, { call }) {
      const res = yield call(uploadGlobalDocuments, payload);
      return res;
    },
    *recallProduct({ payload }, { call }) {
      const res = yield call(recallProduct, payload);
      return res;
    },
    *deleteMerchandise({ payload }, { call }) {
      const res = yield call(deleteMerchandise, payload);
      return res;
    },
    *deleteProduct({ payload }, { call }) {
      const res = yield call(deleteProduct, payload);
      return res;
    },
    *addProductDraftItems({ payload }, { call }) {
      const res = yield call(createDraft, payload);
      return res;
    },
    *getDocType({ payload }, { call, put }) {
      const res = yield call(getDocType, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'docType',
      });
      return res;
    },
    *getApprovalHistory({ payload }, { call, put }) {
      const res = yield call(getApprovalHistory, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'approvalHistory',
      });
      return res;
    },
    *getDocSubTypesList({ payload }, { call, put }) {
      const res = yield call(getDocType, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'docSubType',
      });
      return res;
    },
    *getProductDocuments({ payload }, { call, put }) {
      const res = yield call(getProductDocuments, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'productDocuments',
      });
      return res;
    },
    *getMerchandiseDocuments({ payload }, { call, put }) {
      const res = yield call(getProductDocuments, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'merchandiseDocuments',
      });
      return res;
    },
    *getUploadTypeList({ payload }, { call, put }) {
      const res = yield call(getDocType, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'docUploadType',
      });
      return res;
    },
    *uploadSharedDocuments({ payload }, { call }) {
      const res = yield call(uploadDocuments, payload);
      return res;
    },
    *editUploadSharedDocuments({ payload }, { call }) {
      const res = yield call(editUploadSharedDocuments, payload);
      return res;
    },
    *updateContent({ payload }, { call }) {
      const res = yield call(updateContent, payload);
      return res;
    },
    *deleteUploadedDocuments({ payload }, { call }) {
      const res = yield call(deleteUploadedDocuments, payload);
      return res;
    },
    *deleteProductDocument({ payload }, { call }) {
      const res = yield call(deleteProductDocument, payload);
      return res;
    },
    *uploadDocs({ payload }, { call }) {
      const res = yield call(uploadDocs, payload);
      return res;
    },
    *addComments({ payload }, { call }) {
      const res = yield call(addComments, payload);
      return res;
    },
    *addComplaintAttachment({ payload }, { call }) {
      try {
        const res = yield call(addComments, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // API Methods for PMS attachment STARTs here
    // ******************************************

    *addPmsAttachment({ payload }, { call }) {
      try {
        const res = yield call(addPmsAttachment, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getPmsAttachments({ payload }, { call }) {
      try {
        const res = yield call(getPmsAttachment, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *deletePmsAttachments({ payload }, { call, select, put }) {
      try {
        const res = yield call(deletePmsAttachments, payload);
        if (res?.responseMessage === 'success') {
          let pmsCommentsRecord = yield select((state) => state?.product?.allComments);
          pmsCommentsRecord = {
            ...pmsCommentsRecord,
            communications: [
              ...pmsCommentsRecord?.communications?.filter(
                (item) => item?.id !== payload?.body?.communicationEventId,
              ),
            ],
          };

          yield put({
            type: 'setStates',
            payload: pmsCommentsRecord,
            key: 'allComments',
          });
        }
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // API Methods for PMS attachment ENDs here
    // ***************************************

    // API Methods for Complaint attachment STARTs here
    // ************************************************

    *addComplaintAttachment({ payload }, { call }) {
      try {
        const res = yield call(addComplaintAttachment, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getComplaintAttachments({ payload }, { call }) {
      try {
        const res = yield call(getComplaintAttachments, payload);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *deleteComplaintAttachment({ payload }, { call, select, put }) {
      try {
        const res = yield call(deleteComplaintAttachment, payload);
        if (res?.responseMessage === 'success') {
          let complaintCommentsRecord = yield select((state) => state?.product?.allComments);
          complaintCommentsRecord = {
            ...complaintCommentsRecord,
            communications: [
              ...complaintCommentsRecord?.communications?.filter(
                (item) => item?.id !== payload?.body?.communicationEventId,
              ),
            ],
          };

          yield put({
            type: 'setStates',
            payload: complaintCommentsRecord,
            key: 'allComments',
          });
        }
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // API Methods for Complaint attachment ENDs here
    // ***************************************

    *uploadContent({ payload }, { call }) {
      const res = yield call(uploadContent, payload);
      return res;
    },
    *getSharedDocuments({ payload }, { call, put }) {
      try {
        const res = yield call(getDocuments, payload);
        if (Object.keys(res)?.length) {
          Object.keys(res)?.map((item) => {
            res[item]?.map((list) => {
              list.uniqueKeyFactor = item;
            });
          });
          yield put({
            type: 'setStates',
            payload: res,
            key: 'sharedDoc',
          });
        } else
          yield put({
            type: 'setStates',
            payload: payload.query.subTypeId ? { [payload.query.subTypeId]: [] } : [],
            key: 'sharedDoc',
          });
        return res;
      } catch (error) {
        console.log(`error`, error);
      }
    },
    *getPreviewDocs({ payload }, { call, put }) {
      const res = yield call(getDocuments, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'treeHierarchy',
      });
      return res;
    },
    *fetchComments({ payload }, { call, put }) {
      const res = yield call(fetchComments, payload);

      yield put({
        type: 'setStates',
        payload: res,
        key: 'allComments',
      });
      return res;
    },
    *getInternalDocuments({ payload }, { call, put }) {
      const res = yield call(getDocuments, payload);
      if (Object.keys(res)?.length) {
        Object.keys(res)?.map((item) => {
          res[item]?.map((list) => {
            list.uniqueKeyFactor = item;
          });
        });
        yield put({
          type: 'setStates',
          payload: res,
          key: 'internalDoc',
        });
      } else
        yield put({
          type: 'setStates',
          payload: payload.query.subTypeId ? { [payload.query.subTypeId]: [] } : [],
          key: 'internalDoc',
        });

      return res;
    },
    *uploadInternalDocuments({ payload }, { call }) {
      const res = yield call(uploadDocuments, payload);
      return res;
    },
    *getProductSubTypesList({ payload }, { call, put }) {
      const res = yield call(getProductTypesList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductSubTypesList',
      });
    },
    *getProductItem({ payload }, { call, put }) {
      const res = yield call(getProductItem, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductItem',
      });
    },
    *sendReminders({ payload }, { call }) {
      try {
        const res = yield call(sendReminders, payload);
        return res;
      } catch (error) {
        return Promise.error;
      }
    },
    *getProductAccessory({ payload }, { call, put }) {
      const res = yield call(getProductItem, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductAccessory',
      });
    },
    *getContractTypeList({ payload }, { call, put }) {
      const res = yield call(getContractTypeList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'contractTypeList',
      });
    },
    *getContractSubList({ payload }, { call, put }) {
      const res = yield call(getContractTypeList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'contractSubList',
      });
    },
    *getProductBrands({ payload }, { call, put }) {
      const res = yield call(getProductBrands, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'brandsList',
      });
      return res.searchResults;
    },
    *getMerchandiseBrands({ payload }, { call, put }) {
      const res = yield call(getMerchandiseBrands, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'merchandiseBrandsList',
      });
      return res.searchResults;
    },
    *getProductItemDrafts({ payload }, { call, put }) {
      const res = yield call(alldrafts, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'itemDrafts',
      });
    },
    *getProductAccessoryDrafts({ payload }, { call, put }) {
      const res = yield call(alldrafts, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'accessoryDrafts',
      });
    },
    *getActivities({ payload }, { call, put }) {
      try {
        const res = yield call(getActivities, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'activities',
        });
      } catch (error) {
        console.log(`error`, error);
      }
    },
    *getDepartmentList({ payload }, { call, put }) {
      const res = yield call(getDepartmentList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'departmentList',
      });
    },
    *getProductfamilyList({ payload }, { call, put }) {
      const res = yield call(getProductfamilyList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'productFamilyList',
      });
    },

    *getProductData({ payload }, { call, put }) {
      try {
        const res = yield call(getProductDetails, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'productDetail',
        });
        return res;
      } catch (error) {
        console.log({ error });
      }
    },
    *getProductList({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductList',
      });
    },
    *getItemType({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'itemProductType',
      });
    },
    *getItemSubType({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'itemProductSubType',
      });
    },
    *getAccessoryType({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'accessoryProductType',
      });
    },
    *getAccessoryProduct({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'accessoryProducts',
      });
    },
    *getProductTypes({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductType',
      });
    },
    *getProductModel({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductModel',
      });
    },
    *getProductSubTypes({ payload }, { call, put }) {
      const res = yield call(getProductList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductSubType',
      });
    },

    *getProductComplaints({ payload }, { call, put }) {
      const res = yield call(getProductComplaints, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ProductComplaint',
      });
      return res;
    },
    *getFinishedComplaints({ payload }, { call, put }) {
      const res = yield call(getProductComplaints, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'completedComplaint',
      });
      return res;
    },
    // *getClosedComplaints({ payload }, { call, put }) {
    //   const res = yield call(getProductComplaints, payload);
    //   yield put({
    //     type: "setStates",
    //     payload: res,
    //     key: "closedComplaints",
    //   });
    //   return res;
    // },
    // *getClosedComplaints({ payload }, { call, put }) {
    //   const res = yield call(getProductComplaints, payload);
    //   yield put({
    //     type: "setStates",
    //     payload: res,
    //     key: "complaintData",
    //   });
    //   return res;
    // },
    *getAllPMS({ payload }, { put, call }) {
      try {
        const res = yield call(getAllPMS, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'allPMS',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getCompletedPMS({ payload }, { call, put }) {
      try {
        const res = yield call(getProductPMS, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'completedPMS',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getTotalCountComplaints({ payload }, { put, call }) {
      try {
        const res = yield call(getTotalCountComplaints, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'totalCount',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getTotalBranchStats({ payload }, { put, call }) {
      try {
        const res = yield call(getTotalBranchStats, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'totalCountBranches',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getTotalCountPMS({ payload }, { put, call }) {
      try {
        const res = yield call(getTotalCountPMS, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'totalCountPMS',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getProductPMS({ payload }, { call, put }) {
      try {
        const res = yield call(getProductPMS, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'productPMS',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getGlobalSearchPMS({ payload }, { call, put }) {
      try {
        const res = yield call(getGlobalSearchPMS, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'globalSearchPMS',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getGlobalSearchComplaints({ payload }, { call, put }) {
      try {
        const res = yield call(getGlobalSearchComplaints, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'globalSearchComplaints',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getGlobalSearchAllProducts({ payload }, { call, put }) {
      try {
        const res = yield call(getGlobalSearchAllProducts, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'globalSearchAllProducts',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *getAccessoryTypesLists({ payload }, { call, put }) {
      let res;
      let err;

      try {
        res = yield call(allproducts, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'verifiedAccessory',
        });
      } catch (error) {
        err = error;
      }
      return { err, res };
    },

    *createProductComplaintsRegistration({ payload }, { call }) {
      const res = yield call(createProductComplaintsService, payload);
      return res;
    },
    *getComplaintPreview({ payload }, { call, put }) {
      const res = yield call(getComplaintPreview, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'ComplaintPreview',
      });
      return res;
    },
    *getProductResultList({ payload }, { call, put }) {
      const res = yield call(getProductResultList, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'productResultList',
      });

      return res;
    },
    *getProductResultDetail({ payload }, { call, put }) {
      const res = yield call(getProductResultDetail, payload);
      yield put({
        type: 'setStates',
        payload: res,
        key: 'productResultDetail',
      });

      return res;
    },

    *getParticularPMS({ payload }, { call, put }) {
      try {
        const res = yield call(getParticularPMS, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'particularPMS',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    *getPmsHistory({ payload }, { call, put }) {
      try {
        const res = yield call(getPmsHistory, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'pmsHistory',
        });
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    *addRatingFeedback({ payload }, { call, put, select }) {
      try {
        const res = yield call(addRatingFeedback, payload);

        // if (res?.experienceRating) {
        //   const completedRecords = yield select((state) => state?.product?.completedPMS?.records)
        //   let updateRecord = completedRecords?.map((r) => {
        //     if (r?.workEffortId === res?.feedbackId) {
        //       return { ...r, experienceRating: res?.experienceRating }
        //     }
        //     return r
        //   })

        //   yield put({
        //     type: 'setStates',
        //     payload: updateRecord,
        //     key: 'completedPMS',
        //   });
        // }

        return res;
      } catch (error) {
        return Promise.error;
      }
    },
    *getFeedbackPMS({ payload }, { call, put }) {
      try {
        const res = yield call(getFeedback, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'showFeedbackPMS',
        });
        return res;
      } catch (error) {
        return Promise.error;
      }
    },
    *getFeedbackComplaints({ payload }, { call, put }) {
      try {
        const res = yield call(getFeedback, payload);
        yield put({
          type: 'setStates',
          payload: res,
          key: 'showFeedbackComplaints',
        });
        return res;
      } catch (error) {
        return Promise.error;
      }
    },
  },
  reducers: {
    setStates(state, { payload, key }) {
      return {
        ...state,
        [key]: payload,
      };
    },
  },
};
export default Model;
