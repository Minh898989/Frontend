import React, { useState } from 'react';
import FoodInventory from './FoodInventory';
import HouseholdInventory from './HouseholdInventory';

const InventoryTable = () => {
  const [activeTab, setActiveTab] = useState('food');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h1>Kho hàng</h1>

      {/* Tab menu as navigation bar */}
      <div className="tab-menu">
        <div
          className={`tab-item ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => handleTabChange('food')}
        >
          Thực phẩm
        </div>
        <div
          className={`tab-item ${activeTab === 'household' ? 'active' : ''}`}
          onClick={() => handleTabChange('household')}
        >
          Gia dụng
        </div>
      </div>

      {/* Display the selected inventory component */}
      <div className="inventory-content">
        {activeTab === 'food' ? <FoodInventory /> : <HouseholdInventory />}
      </div>
    </div>
  );
};

export default InventoryTable;
