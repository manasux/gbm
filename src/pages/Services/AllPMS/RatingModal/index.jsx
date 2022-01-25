import AppModal from '@/components/AppModal';
import { Button, Input, message } from 'antd';
import { connect } from 'umi';
import React, { useState } from 'react';

const RatingModal = ({
  showRatingModal,
  setShowRatingModal,
  currentUser,
  dispatch,
  rating,
  selectedPMSRecord,
}) => {
  const [pmsFeedback, setPmsFeedback] = useState(null);
  const success = () => {
    const body = {
      experienceRating: rating,
      comments: pmsFeedback,
      workEffortId: selectedPMSRecord?.workEffortId,
    };
    dispatch({
      type: 'product/addRatingFeedback',
      payload: {
        pathParams: {
          partyId: currentUser?.personal_details?.organization_details?.org_party_id,
        },
        body,
      },
    })
      .then(() => {
        message.success('Feedback Submitted Successfully');
        setShowRatingModal(false);
      })
      .catch((err) => message.error(err?.message));
  };

  return (
    <AppModal
      showModal={showRatingModal}
      titleName="Add Rating"
      setShowModal={setShowRatingModal}
      footer={
        <div className="flex justify-end items-center">
          <div
            className="font-semibold pr-2"
            onClick={() => {
              setShowRatingModal(false);
              setPmsFeedback('');
            }}
          >
            Cancel
          </div>
          <Button disabled={!pmsFeedback} type="primary" onClick={success}>
            Save
          </Button>
        </div>
      }
    >
      <div className="my-8 mx-8">
        <div className="font-semibold text-md mb-2">Feedback</div>
        <Input.TextArea
          placeholder="Enter feedback..."
          showCount
          maxLength={100}
          onChange={(e) => setPmsFeedback(e.target.value)}
          rows={6}
          autoFocus
          value={pmsFeedback}
        />
      </div>
    </AppModal>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(RatingModal);
