import React, { useEffect, useState } from 'react';
import './Invoitable.css';

const InvoiceTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    employeeId: '',
    purchaseDate: '',
    customerName: '',
    phone: '',
    address: '',
    products: [{ name: '', quantity: '' }],
  });

  const [employees, setEmployees] = useState([]); // List of employees for the dropdown
  const [products, setProducts] = useState([]); // List of products for the dropdown

  const [error, setError] = useState(''); // Error state for handling errors

  useEffect(() => {
    // Fetch all invoices
    fetch('http://localhost:8080/api/invoices')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        return response.json();
      })
      .then((data) => setInvoices(data))
      .catch((error) => setError(error.message)); // Handle error and set error message

    // Fetch employees for the employee dropdown
    fetch('http://localhost:8080/api/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data)) // Assuming response contains employee details
      .catch((error) => setError(error.message));

    // Fetch products for the product dropdown
    fetch('http://localhost:8080/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data)) // Assuming response contains product details
      .catch((error) => setError(error.message));
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
        if (!response.ok) {
          throw new Error('Failed to add invoice');
        }
        return response.json();
      })
      .then((data) => {setInvoices((prev) => [...prev, data]);
        setShowModal(false);
        setNewInvoice({
          employeeId: '',
          purchaseDate: '',
          customerName: '',
          phone: '',
          address: '',
          products: [{ name: '', quantity: '' }],
        });
        setError(''); // Clear error on success
      })
      .catch((error) => setError(error.message)); // Handle error and set error message
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Hóa Đơn</h1>

      {/* Error Message Display */}
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error: </strong>{error}
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="text"
            style={{ width: '300px', marginLeft: '10px' }}
            placeholder="Lọc hóa đơn theo tên KH"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

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
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.invoiceId}>
              <td>{invoice.invoiceId}</td>
              <td>{invoice.employeeName}</td>
              <td>{invoice.purchaseDate.slice(0, 10)}</td>
              <td>{invoice.customerName}</td>
              <td>{invoice.phone}</td>
              <td>{invoice.address}</td>
              <td>${invoice.totalAmount}</td>
              <td>{invoice.purchaseCount}</td>
              <td>
                <button onClick={() => handleToggleDetails(invoice.invoiceId)}>
                  {selectedInvoice === invoice.invoiceId
                    ? 'Ẩn chi tiết'
                    : 'Xem chi tiết'}
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
                      <td>{product.name}</td><td>{product.quantity}</td>
                      <td>${product.price}</td>
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
              <select
                style={{ width: '300px' }}
                value={newInvoice.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
              >
                <option value="">Chọn Nhân Viên</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ngày Mua:
              <input
                type="date"
                style={{ width: '300px' }}
                value={newInvoice.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
              />
            </label>
            <h3>Khách hàng</h3>
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
            <p></p>
            <label>
              Địa chỉ:
              <input
                type="text"
                value={newInvoice.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </label>
            <p></p>
            <h3>Sản Phẩm</h3>
            {newInvoice.products.map((product, index) => (
              <div key={index}>
                <label>
                  Tên sản phẩm:
                  <select
                    style={{ width: '300px' }}
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.name}>
                        {prod.name}
                      </option>
                    ))}</select>
                    </label>
                    <p></p>
                    <label>
                      Số Lượng:
                      <input
                        type="number"
                        style={{ width: '300px' }}
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      />
                    </label>
                    
                    <button onClick={() => removeProductField(index)}style={{ width: '300px' }}>Xóa</button>
                  </div>
                ))}
                
                <button onClick={addProductField}style={{ width: '300px' }}>Thêm Sản Phẩm</button>
                <br />
                <div className='modal-actions' style={{ width:'310px'}}>
                  <button onClick={handleSubmit} style={{ width: '145px' }} className='action-button save'>Lưu</button>
                  <button onClick={() => setShowModal(false)} style={{ width: '145px' }}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default InvoiceTable;
    