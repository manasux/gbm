import React from 'react';
import { Link } from 'umi';

const Breadcrumb = ({ path, name }) => {
  return (
    <span>
      <Link className="text-base text-gray-700" to={path || ''}>
        <span className="flex items-center">
          <span className="text-lg">{/* <Icon component={ZcpIcons.ArrowLeftThick} /> */}</span>
          <span className="inline text-xs hover:font-medium">{name}</span>
        </span>
      </Link>
    </span>
  );
};
export default Breadcrumb;
