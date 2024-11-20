import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', phone: '', birthDate: '', address: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch employees from backend
    axios.get('http://localhost:8080/api/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the employees:", error);
      });
  }, []);

  const addEmployee = () => {
    setNewEmployee({ id: '', name: '', phone: '', birthDate: '', address: '' });
    setEditingEmployee(null);
    setShowModal(true);
  };

  const editEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({ ...employee });
    setShowModal(true);
  };

  const saveEmployee = () => {
    if (editingEmployee) {
      // Update employee
      axios.put(`http://localhost:8080/api/employees/${editingEmployee.id}`, newEmployee)
        .then(response => {
          setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
              employee.id === editingEmployee.id ? { ...newEmployee } : employee
            )
          );
          closeModal();
        })
        .catch(error => {
          console.error("There was an error updating the employee:", error);
        });
    } else {
      // Add new employee
      axios.post('http://localhost:8080/api/employees', newEmployee)
        .then(response => {
          setEmployees([...employees, response.data]);
          closeModal();
        })
        .catch(error => {
          console.error("There was an error adding the employee:", error);
        });
    }
  };

  const deleteEmployee = (id) => {
    axios.delete(`http://localhost:8080/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(employee => employee.id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the employee:", error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setNewEmployee({ id: '', name: '', phone: '', birthDate: '', address: '' });
    setEditingEmployee(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      String(employee.id).toLowerCase().includes(lowercasedQuery) ||
      employee.name.toLowerCase().includes(lowercasedQuery)
    );
  });

  return (
    <div>
      <h1>Nhân viên</h1>
      <input
        type="text"
        placeholder="Tìm kiếm theo ID hoặc tên"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>SDT</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Sửa/xóa</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.birthDate.slice(0, 10)}</td>
              <td>{employee.address}</td>
              <td>
                <button onClick={() => editEmployee(employee)} className="action-button edit">Sửa</button>
                <button onClick={() => deleteEmployee(employee.id)} className="action-button delete">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addEmployee}>Thêm nhân viên</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingEmployee ? 'Sửa Nhân viên' : 'Thêm Nhân viên Mới'}</h2>
            <label>
              Tên:
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleChange}
                placeholder="Tên"
              />
            </label>
            <label>
              SDT:
              <input
                type="text"
                name="phone"
                value={newEmployee.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
              />
            </label>
            <label>
              Ngày sinh:
              <input
                type="date"
                name="birthDate"
                value={newEmployee.birthDate}
                onChange={handleChange}
              />
            </label>
            <label>
              Địa chỉ:
              <input
                type="text"
                name="address"
                value={newEmployee.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
              />
            </label>
            <div className="modal-actions">
              <button onClick={closeModal} className="action-button cancel">Hủy</button>
              <button onClick={saveEmployee} className="action-button save">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;