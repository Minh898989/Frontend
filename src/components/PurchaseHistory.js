import React from 'react';

const PurchaseHistory = ({ purchaseHistory }) => {
  return (
    <div>
      <h1>Lịch sử mua hàng</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày thanh toán</th>
            <th>NV phụ trách</th>
            <th>Thành tiền</th>
            <th>Chi tiết đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory?.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.date}</td>
              <td>{invoice.employee}</td>
              <td>{invoice.totalAmount} VND</td>
              <td>
                <ul>
                  {invoice.orderDetails.map((item, index) => (
                    <li key={index}>
                      {item.product.name} - Số lượng: {item.quantity}, Thành tiền: {item.total} VND
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistory;
