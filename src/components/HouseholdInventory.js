import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HouseholdInventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ id: '', name: '', price: 0, quantity: 0, brand: '', origin: '', material: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  // Lấy danh sách sản phẩm gia dụng khi component được tải
  useEffect(() => {
    axios.get('http://localhost:8080/api/households')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const addItem = () => {
    setNewItem({ id: '', name: '', price: 0, quantity: 0, brand: '', origin: '', material: '' });
    setShowModal(true);
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:8080/api/households/${id}`)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the item!', error);
      });
  };

  const editItem = (item) => {
    setNewItem({ ...item });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = () => {
    if (newItem.id) {
      // Cập nhật sản phẩm gia dụng
      axios.put(`http://localhost:8080/api/households/${newItem.id}`, newItem)
        .then(response => {
          setItems(items.map(item => item.id === newItem.id ? response.data : item));
          setShowModal(false);
          setNewItem({ id: '', name: '', price: 0, quantity: 0, brand: '', origin: '', material: '' });
        })
        .catch(error => {
          console.error('There was an error updating the item!', error);
        });
    } else {
      // Thêm mới sản phẩm gia dụng
      axios.post('http://localhost:8080/api/households', newItem)
        .then(response => {
          setItems([...items, response.data]);
          setShowModal(false);
          setNewItem({ id: '', name: '', price: 0, quantity: 0, brand: '', origin: '', material: '' });
        })
        .catch(error => {
          console.error('There was an error adding the item!', error);
        });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  // Lọc các sản phẩm gia dụng dựa trên từ khóa tìm kiếm
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    
  );
  
  
  return (
    <div>
      <h2>Gia dụng</h2>

      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Ngày Nhập</th>
            <th>Nhãn hàng</th>
            <th>Xuất xứ</th>
            <th>Chất liệu</th>
            <th>Sửa/Xóa</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.importDate.slice(0, 10)}</td>
              <td>{item.brand}</td>
              <td>{item.origin}</td>
              <td>{item.material}</td>
              <td>
                <button className="action-button edit" onClick={() => editItem(item)}>Sửa</button>
                <button className="action-button delete" onClick={() => deleteItem(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addItem}>Thêm sản phẩm</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thêm hoặc Sửa sản phẩm</h2>
            <label>
              Tên:
              <input type="text" name="name" value={newItem.name} onChange={handleChange} />
            </label>
            <label>
            
            </label>
            <label>
              Giá:
              <input type="number" name="price" value={newItem.price} onChange={handleChange} />
            </label>
            <label>
              Số lượng:
              <input type="number" name="quantity" value={newItem.quantity} onChange={handleChange} />
            </label>
            <label>
              Ngày Nhập
              <input type="date" name="importDate" value={newItem.importDate} onChange={handleChange} />
            </label>
            
            <label>
              Nhãn hàng:
              <input type="text" name="brand" value={newItem.brand} onChange={handleChange} />
            </label>
            <label>
              Xuất xứ:
              <input type="text" name="origin" value={newItem.origin} onChange={handleChange} />
            </label>
            <label>
              Chất liệu:
              <input type="text" name="material" value={newItem.material} onChange={handleChange} />
            </label>
            <button onClick={() => setShowModal(false)}>Hủy</button>
            <button onClick={handleSave}>Lưu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdInventory;
