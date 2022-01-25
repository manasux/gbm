import React from 'react';
import Breadcrumb from './BreadCrumb';

/**
 *
 * @param {object} param0
 * @param {[object]} param0.path
 */
const Breadcrumbs = ({ path }) => {
  return (
    <div className="flex items-center">
      <nav className="flex items-center" role="navigation">
        {path.map((element, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="flex items-center" key={index}>
            <Breadcrumb {...element} />
            {path[index + 1] ? <span className="px-2">/</span> : ''}
          </span>
        ))}
      </nav>
    </div>
  );
};
export default Breadcrumbs;
