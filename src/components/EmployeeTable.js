import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTable = ({ canEdit }) => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ id: '', name: '', phone: '', birthDate: '', address: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/employees')
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setErrorMessage('Error fetching employee data.');
      });
  }, []);

  const addEmployee = () => {
    if (!canEdit) return;
    setNewEmployee({ id: '', name: '', phone: '', birthDate: '', address: '' });
    setEditingEmployee(null);
    setShowModal(true);
  };

  const editEmployee = (employee) => {
    if (!canEdit) return;
    setEditingEmployee(employee);
    setNewEmployee({ ...employee });
    setShowModal(true);
  };

  const saveEmployee = () => {
    const formattedEmployee = {
      ...newEmployee,
      birthDate: newEmployee.birthDate ? new Date(newEmployee.birthDate).toISOString().split('T')[0] : ''
    };

    if (editingEmployee) {
      // Update existing employee
      axios.put(`http://localhost:8080/api/employees/${editingEmployee.id}`, formattedEmployee)
        .then(() => {
          setEmployees((prevEmployees) => 
            prevEmployees.map((employee) =>
              employee.id === editingEmployee.id ? { ...formattedEmployee } : employee
            )
          );
          closeModal();
        })
        .catch((error) => {
          console.error('Error updating employee:', error);
          setErrorMessage('Error updating employee.');
        });
    } else {
      // Add new employee
      axios.post('http://localhost:8080/api/employees', formattedEmployee)
        .then((response) => {
          setEmployees([...employees, response.data]);
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding employee:', error);
          setErrorMessage('Error adding employee.');
        });
    }
  };

  const deleteEmployee = (id) => {
    if (!canEdit) return;
    axios.delete(`http://localhost:8080/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(employee => employee.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        setErrorMessage('Error deleting employee.');
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setNewEmployee({ id: '', name: '', phone: '', birthDate: '', address: '' });
    setEditingEmployee(null);
    setErrorMessage('');  // Clear any error messages when closing modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({
      ...prevState,
      [name]: name === 'birthDate' ? value : value
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

      {/* Display error message if any */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      {/* Search Bar */}
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
            {canEdit && <th>Sửa/xóa</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.birthDate}</td>
              <td>{employee.address}</td>
              {canEdit && (
                <td>
                  <button className="action-button edit" onClick={() => editEmployee(employee)}>Sửa</button>
                  <button className="action-button delete" onClick={() => deleteEmployee(employee.id)}>Xóa</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {canEdit && <button className="action-button add" onClick={addEmployee}>Thêm nhân viên</button>}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>

            <label>
              ID:
              <input
                type="text"
                name="id"
                value={newEmployee.id || ''}
                onChange={handleChange}
                disabled={editingEmployee !== null}
              />
            </label>

            <label>
              Tên:
              <input
                type="text"
                name="name"
                value={newEmployee.name || ''}
                onChange={handleChange}
                placeholder="Name"
              />
            </label>

            <label>
              SDT:
              <input
                type="text"
                name="phone"
                value={newEmployee.phone || ''}
                onChange={handleChange}
                placeholder="Phone"
              />
            </label>

            <label>
              Ngày sinh:
              <input
                type="date"
                name="birthDate"
                value={newEmployee.birthDate || ''}
                onChange={handleChange}
                placeholder="BirthDate"
              />
            </label>

            <label>
              Địa chỉ:
              <input
                type="text"
                name="address"
                value={newEmployee.address || ''}
                onChange={handleChange}
                placeholder="Address"
              />
            </label>

            <div className="modal-actions">
              <button onClick={closeModal}>Hủy</button>
              <button onClick={saveEmployee}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
