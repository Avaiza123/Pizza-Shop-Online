import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import Dashboard from "../views/Dashboard/Dashboard";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkAdminRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists() && userSnapshot.data().role === "admin") {
            await fetchOrders();
          } else {
            navigate("/auth/login");
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          navigate("/auth/login");
        }
      } else {
        navigate("/auth/login");
      }
    };

    checkAdminRole();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, db, navigate]);

  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const validatedOrders = ordersList.map(order => ({
        id: order.id || 'N/A',
        customerName: order.customerName || 'N/A',
        product: order.product || 'N/A',
        quantity: order.quantity || 0,
        totalPrice: order.totalPrice || 0,
        orderDate: order.orderDate || { seconds: 0 },
      }));

      console.log("Fetched Orders:", validatedOrders);
      setOrders(validatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Dashboard orders={orders} />
    </div>
  );
};

export default Admin;
