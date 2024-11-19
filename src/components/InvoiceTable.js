import React, { useEffect, useState } from 'react';
import './Invoitable.css';

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    employeeId: '',
    purchaseDate: '',
    products: [{ name: '', quantity: '' }],
  });
  const [errorMessage, setErrorMessage] = useState(''); 

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
  const validateInvoice = () => {
    // Kiểm tra thông tin hóa đơn (như số lượng sản phẩm)
    if (!newInvoice.employeeId || !newInvoice.purchaseDate) {
      return 'Vui lòng nhập đầy đủ thông tin hóa đơn.';
    }

    for (const product of newInvoice.products) {
      if (!product.name || !product.quantity || product.quantity <= 0) {
        return 'Vui lòng nhập đầy đủ thông tin sản phẩm và số lượng hợp lệ.';
      }
    }

    // Kiểm tra số lượng sản phẩm trong kho (giả sử có API kiểm tra kho)
    // Ví dụ: Kiểm tra nếu số lượng vượt quá tồn kho (giả lập dữ liệu tồn kho)
    for (const product of newInvoice.products) {
      const stock = 10; // Giả sử sản phẩm có tồn kho là 10
      if (parseInt(product.quantity) > stock) {
        return `Sản phẩm ${product.name} không đủ số lượng trong kho.`;
      }
    }

    return ''; // Nếu không có lỗi, trả về chuỗi rỗng
  };

  const handleSubmit = () => {
    const error = validateInvoice();  // Kiểm tra lỗi
    if (error) {
      setErrorMessage(error);  // Lưu thông báo lỗi
      return;  // Dừng không gửi dữ liệu nếu có lỗi
    }

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
          products: [{ name: '', quantity: '' }],
        });
        setErrorMessage(''); 
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
            <th>Tổng tiền</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td>{invoice.invoiceId}</td>
              <td>{invoice.employeeName}</td>
              <td>{invoice.purchaseDate.slice(0, 10)}</td> {/* Cập nhật đây */}
              <td>{invoice.totalAmount}</td>
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={handleSubmit}>Lưu</button>
            <button onClick={() => setShowModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
