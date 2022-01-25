import React from 'react';
import AllProductTable from './AllProductTable';
import ComplaintsTable from './ComplaintsTable';
import PMSTable from './PMSTable';
// import ComplaintsTable from "./ComplaintsTable";
// import PMSTable from "./PMSTable";

const GlobalSearchPage = () => {
  return (
    <div className="container mx-auto">
      <div style={{ margin: '5% 10% 5% 10%' }}>
        <AllProductTable />
        <ComplaintsTable />
        <PMSTable />
      </div>
    </div>
  );
};

export default GlobalSearchPage;
