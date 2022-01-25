/* eslint-disable no-console */
import AppModal from '@/components/AppModal';
import { Button, Input, message } from 'antd';
import { connect } from 'umi';
import React, { useState } from 'react';

const RatingModal = ({
  showRatingModal,
  setShowRatingModal,
  rating,
  dispatch,
  currentUser,
  complaintPreview,
}) => {
  const [feedback, setFeedback] = useState();
  const success = () => {
    const body = {
      experienceRating: rating,
      comments: feedback,
      custRequestId: complaintPreview?.response?.id,
    };
    dispatch({
      type: 'product/addRatingFeedback',
      payload: {
        pathParams: {
          partyId: currentUser?.personal_details?.organization_details?.org_party_id,
        },
        body: {
          ...body,
        },
      },
    })
      .then((res) => {
        if (res) {
          dispatch({
            type: "product/getFeedbackComplaints",
            payload: {
              query: {
                partyId:
                  currentUser?.personal_details?.organization_details?.org_party_id,
                custRequestId: complaintPreview?.response?.id,
              },
            },
          });
          message.success('Feedback Submitted Successfully');
          setShowRatingModal(false);
        }
      })
      .catch((err) => message.error(err?.message));
  };

  return (
    <AppModal
      showModal={showRatingModal}
      titleName="Add Rating"
      setShowModal={setShowRatingModal}
      afterClose={() => setFeedback('')}
      footer={
        <div className="flex justify-end items-center">
          <div
            className="font-semibold pr-2"
            onClick={() => {
              setShowRatingModal(false);
              setFeedback('');
            }}
          >
            Cancel
          </div>
          <Button disabled={!feedback} type="primary" onClick={success}>
            Save
          </Button>
        </div>
      }
    >
      <div className="my-8 mx-8">
        <div className="font-semibold text-md mb-2">Feedback</div>
        <Input.TextArea
          placeholder="Enter feedback..."
          name="feedback"
          showCount
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={100}
          rows={6}
          autoFocus
          value={feedback}
        />
      </div>
    </AppModal>
  );
};

export default connect(({ user, product }) => ({
  currentUser: user.currentUser,
  ComplaintPreview: product.ComplaintPreview,
}))(RatingModal);
