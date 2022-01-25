/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import DisplayHistory from '../AddProduct/AddProductForm/DisplayHistory';
import DocumentsDraftTable from './DocumentsDraftTable';
import MerchandiseDraftTable from './MerchandiseDraftTable';

const AllProducts = ({ productDetail, match }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [viewSize, setViewSize] = useState(10);
  const [draftDetails, showDraftDetails] = useState(true);

  useEffect(() => {
    if (match.path.includes('draft')) showDraftDetails(true);
    else {
      showDraftDetails(false);
    }
  }, [match.path]);

  useEffect(() => {
    if (productDetail) {
      delete productDetail.after_warranty;
      delete productDetail.has_warranty;
    }
  }, [productDetail]);

  return (
    <div className="">
      <div className="mx-12">
        {draftDetails && (
          <>
            <div
              className="w-full text-gray-900 text-md font-semibold p-2 mb-4 rounded-lg bg-gray-200"
              style={{ color: '#111642' }}
            >
              <span className="mx-2">Accessory Drafts</span>
            </div>
            <MerchandiseDraftTable
              startIndex={startIndex}
              viewSize={viewSize}
              currentPage={currentPage}
              setViewSize={setViewSize}
              setCurrentPage={setCurrentPage}
              setStartIndex={setStartIndex}
              storageKey="PRODUCT_ACCESSORY"
            />
            <div
              className="w-full text-gray-900 text-md font-semibold p-2 my-4 rounded-lg bg-gray-200"
              style={{ color: '#111642' }}
            >
              <span className="mx-2">Item Drafts</span>
            </div>
            <MerchandiseDraftTable
              startIndex={startIndex}
              viewSize={viewSize}
              currentPage={currentPage}
              setViewSize={setViewSize}
              setCurrentPage={setCurrentPage}
              setStartIndex={setStartIndex}
              storageKey="PRODUCT_ITEM"
            />
            <div
              className="w-full text-gray-900 text-md font-semibold p-2 my-4 rounded-lg bg-gray-200"
              style={{ color: '#111642' }}
            >
              <span className="mx-2">Internal Documents</span>
            </div>
            <DocumentsDraftTable
              startIndex={startIndex}
              viewSize={viewSize}
              currentPage={currentPage}
              setViewSize={setViewSize}
              setCurrentPage={setCurrentPage}
              setStartIndex={setStartIndex}
              storageKey="INTERNAL_DOC"
            />
            <div
              className="w-full text-gray-900 text-md font-semibold p-2 my-4 rounded-lg bg-gray-200"
              style={{ color: '#111642' }}
            >
              <span className="mx-2">Shared Documents</span>
            </div>
            <DocumentsDraftTable
              startIndex={startIndex}
              viewSize={viewSize}
              currentPage={currentPage}
              setViewSize={setViewSize}
              setCurrentPage={setCurrentPage}
              setStartIndex={setStartIndex}
              storageKey="SHARED_DOC"
            />
            <div
              className="w-full text-gray-900 text-md font-semibold p-2 my-4 rounded-lg bg-gray-200"
              style={{ color: '#111642' }}
            >
              <span className="mx-2">Browsing History</span>
            </div>
            <DisplayHistory />
          </>
        )}
      </div>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AllProducts);
