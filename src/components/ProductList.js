import React from 'react';
import { FaPlus } from 'react-icons/fa'; 

const ProductList = ({ items, onAddProduct, onConfirmPurchase }) => {
  if (!items) {
    items = [];
  }

  return (
    
    <div>
      <h3>Sản phẩm đã mua:</h3>
      <table>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price} VND</td>
                <td>{item.quantity}</td>
                <td>{item.price * item.quantity} VND</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Không có sản phẩm nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Text Link with Icon */}
      <span className="add-product-link" onClick={onAddProduct}>
        <FaPlus style={{ marginRight: '8px' }} /> Thêm sản phẩm
      </span>
      <button className="modal-actions button" onClick={onConfirmPurchase}>
        Xác nhận mua hàng
      </button>
    </div>
  );
};

export default ProductList;
