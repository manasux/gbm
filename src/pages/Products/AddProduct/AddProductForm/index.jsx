import React from 'react';
import ProductDetailsForm from './ProductDetailsForm';

/**
 *
 * @AddProductForm - This component is used in add product for showing the form only
 */

const AddProductForm = ({
  form,
  hasWarranty,
  setHasWarranty,
  hasContract,
  setHasContract,
  setOtherOptions,
  otherOptions,
  othervalue,
  setothervalue,
  otherUploads,
  setOtherUploads,
}) => {
  return (
    <div className="">
      <ProductDetailsForm
        {...{
          form,
          hasWarranty,
          setHasWarranty,
          hasContract,
          setHasContract,
          setOtherOptions,
          otherOptions,
          othervalue,
          setothervalue,
          otherUploads,
          setOtherUploads,
        }}
      />
    </div>
  );
};

export default AddProductForm;
