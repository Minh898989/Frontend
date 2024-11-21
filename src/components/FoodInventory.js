import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Hàm định dạng ngày
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const FoodInventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ id: '', name: '', price: 0, quantity: 0, expirationDate: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch items from the API when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8080/api/foods')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the food items!', error);
      });
  }, []);

  const addItem = () => {
    setNewItem({ id: '', name: '', price: 0, quantity: 0, expirationDate: '' });
    setShowModal(true);
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:8080/api/foods/${id}`)
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
      axios.put(`http://localhost:8080/api/foods/${newItem.id}`, newItem)
        .then(response => {
          setItems(items.map(item => item.id === newItem.id ? newItem : item));
          setShowModal(false);
          setNewItem({ id: '', name: '', price: 0, quantity: 0, expirationDate: '' });
        })
        .catch(error => {
          console.error('There was an error updating the item!', error);
        });
    } else {
      axios.post('http://localhost:8080/api/foods', newItem)
        .then(response => {
          setItems([...items, response.data]);
          setShowModal(false);
          setNewItem({ id: '', name: '', price: 0, quantity: 0, expirationDate: '' });
        })
        .catch(error => {
          console.error('There was an error adding the new item!', error);
        });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter items based on the search term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to check if the expiration date has passed
  const isExpired = (expirationDate) => {
    const currentDate = new Date();
    const expDate = new Date(expirationDate);
    return expDate < currentDate; // Return true if expired
  };

  return (
    <div>
      <h2>Thực phẩm</h2>

      {/* Search bar */}
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
            <th>HSD</th>
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
              <td style={{ color: isExpired(item.expiryDate) ? 'red' : 'black' }}>
                {formatDate(item.expiryDate)} 
              </td>
              <td>
                <button className="action-button edit" onClick={() => editItem(item)}>Sửa</button>
                <button className="action-button delete" onClick={() => deleteItem(item.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="action-button add" onClick={addItem}>Thêm sản phẩm</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thêm hoặc Sửa sản phẩm</h2>
            <label>
              Tên:
              <input type="text" name="name" value={newItem.name} onChange={handleChange} />
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
              HSD:
              <input type="date" name="expiryDate" value={newItem.expiryDate} onChange={handleChange} />
            </label>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodInventory;