import React, { useEffect, useState } from 'react';
import './Invoitable.css';

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    employeeId: '',
    purchaseDate: '',
    customerName:'',
    phone:'',
    address:'',
    products: [{ name: '', quantity: '' }],
   
  });
  

  useEffect(() => {
    // Gọi API để lấy tất cả hóa đơn
    fetch('http://localhost:8080/api/invoices')
      .then((response) => response.json())
      .then((data) => setInvoices(data))
      .catch((error) => console.error('Error fetching invoices:', error));
  }, []);

  const handleToggleDetails = (invoiceId) => {
    setSelectedInvoice((prev) => (prev === invoiceId ? null : invoiceId));
  };

  const handleInputChange = (field, value) => {
    setNewInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...newInvoice.products];
    updatedProducts[index][field] = value;
    setNewInvoice((prev) => ({ ...prev, products: updatedProducts }));
  };

  const addProductField = () => {
    setNewInvoice((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: '' }],
    }));
  };

  const removeProductField = (index) => {
    const updatedProducts = newInvoice.products.filter((_, i) => i !== index);
    setNewInvoice((prev) => ({ ...prev, products: updatedProducts }));
  };
 
  const handleSubmit = () => {
    

    fetch('http://localhost:8080/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to add invoice');
        return response.json();
      })
      .then((data) => {
        setInvoices((prev) => [...prev, data]);
        setShowModal(false);
        setNewInvoice({
          employeeId: '',
          purchaseDate: '',
          customerName:'',
          phone:'',
          address:'',
          products: [{ name: '', quantity: '' }],
        });
        
      })
      .catch((error) => console.error('Error adding invoice:', error));
  };

  return (
    <div>
      <h1>Hóa Đơn</h1>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nhân viên</th>
            <th>Ngày mua</th>
            <th>Tên KH</th>
            <th>Số ĐT</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Số lần mua</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td>{invoice.invoiceId}</td>
              <td>{invoice.employeeName}</td>
              <td>{invoice.purchaseDate.slice(0, 10)}</td> {/* Cập nhật đây */}
              <td>{invoice.customerName}</td>
              <td>{invoice.phone}</td>
              <td>{invoice.address}</td>
              <td>{invoice.totalAmount}</td>
              <td>{invoice.purchaseCount}</td>
              <td>
                <button onClick={() => handleToggleDetails(invoice.invoiceId)}>
                  {selectedInvoice === invoice.invoiceId ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInvoice && (
        <div>
          <h2>Chi tiết hóa đơn ID {selectedInvoice}</h2>
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter((invoice) => invoice.invoiceId === selectedInvoice)
                .flatMap((invoice) =>
                  invoice.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowModal(true)}>Thêm Hóa Đơn</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Thêm Hóa Đơn Mới</h2>
            <label>
              ID Nhân Viên:
              <input
                type="number"
                value={newInvoice.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
              />
            </label>
            <label>
              Ngày Mua:
              <input
                type="date"
                value={newInvoice.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
              />
            </label>
            <label>
              Tên Khách Hàng:
              <input
                type="text"
                value={newInvoice.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={newInvoice.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </label>
            <label>
              Địa chỉ:
              <input
                type="text"
                value={newInvoice.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </label>
            <h3>Sản Phẩm</h3>
            {newInvoice.products.map((product, index) => (
              <div key={index}>
                <label>
                  Tên:
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  />
                </label>
                <label>
                  Số Lượng:
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  />
                </label>
                <button onClick={() => removeProductField(index)}>Xóa</button>
              </div>
            ))}
            <button onClick={addProductField}>Thêm Sản Phẩm</button>
            <br />
            
            <button onClick={handleSubmit}>Lưu</button>
            <button onClick={() => setShowModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
