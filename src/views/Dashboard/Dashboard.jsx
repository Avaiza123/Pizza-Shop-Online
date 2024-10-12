import { useState, useEffect } from 'react';
import { Table, Button, Nav, NavItem, NavLink } from 'reactstrap';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import AdminNavbar from './AdminNavbar';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [subTab, setSubTab] = useState('current');
  const db = getFirestore();

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || 'N/A',
          address: data.address || 'N/A',
          total: data.total || 0,
          items: data.items || [],
          date: data.date || 'N/A',
          time: data.time || 'N/A',
          status: data.status || 'current',
          userId: data.userId || 'N/A',
          name: data.name || 'N/A',
        };
      });

      setOrders(ordersList);
      setCurrentOrders(ordersList.filter(order => order.status === 'current'));
      setCompletedOrders(ordersList.filter(order => order.status === 'completed'));
      setCancelledOrders(ordersList.filter(order => order.status === 'cancelled'));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { status: newStatus });

      const updatedOrder = orders.find(order => order.id === orderId);
      updatedOrder.status = newStatus;

      setOrders(orders.map(order => (order.id === orderId ? updatedOrder : order)));

      if (newStatus === 'completed') {
        setCurrentOrders(currentOrders.filter(order => order.id !== orderId));
        setCompletedOrders([...completedOrders, updatedOrder]);
      } else if (newStatus === 'cancelled') {
        setCurrentOrders(currentOrders.filter(order => order.id !== orderId));
        setCancelledOrders([...cancelledOrders, updatedOrder]);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOrderAction = (orderId, action) => {
    if (action === 'complete') {
      updateOrderStatus(orderId, 'completed');
    } else if (action === 'cancel') {
      updateOrderStatus(orderId, 'cancelled');
    }
  };

  const renderOrderItems = (items) => (
    <Table striped>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderOrdersTable = (orders) => (
    <Table striped>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Total Price</th>
          <th>Date</th>
          <th>Time</th>
          <th>Items</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.name}</td>
            <td>{order.email}</td>
            <td>{order.address}</td>
            <td>${order.total.toFixed(2)}</td>
            <td>{order.date}</td>
            <td>{order.time}</td>
            <td>{renderOrderItems(order.items)}</td>
            <td>
              {subTab === 'current' && (
                <>
                  <Button color="success" onClick={() => handleOrderAction(order.id, 'complete')}>Complete</Button>{' '}
                  <Button color="danger" onClick={() => handleOrderAction(order.id, 'cancel')}>Cancel</Button>
                </>
              )}
            </td>
          </tr>
        )) : <tr><td colSpan="9">No orders available</td></tr>}
      </tbody>
    </Table>
  );

  return (
    <div className='Admin-container'>
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'orders' && (
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink active={subTab === 'current'} onClick={() => setSubTab('current')}>Current</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={subTab === 'completed'} onClick={() => setSubTab('completed')}>Completed</NavLink>
            </NavItem>
            <NavItem>
              <NavLink active={subTab === 'cancelled'} onClick={() => setSubTab('cancelled')}>Cancelled</NavLink>
            </NavItem>
          </Nav>
          {subTab === 'current' && renderOrdersTable(currentOrders)}
          {subTab === 'completed' && renderOrdersTable(completedOrders)}
          {subTab === 'cancelled' && renderOrdersTable(cancelledOrders)}
        </div>
      )}
      {activeTab === 'users' && (
        <div>
          <h2>Users List</h2>
          <Table striped>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user, index) => (
                <tr key={index}>
                  <td>{user.id || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.role || 'N/A'}</td>
                </tr>
              )) : <tr><td colSpan="4">No users available</td></tr>}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
