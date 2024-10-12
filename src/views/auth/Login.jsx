// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '/src/firebaseConfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { isAdmin } from '/src/utils.js';
import '/src/assets/styles/Auth.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("login");
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
       if (userData.role === 'admin') {
        console.log("User is admin");
        navigate("/admin/dashboard");
      } 
      else {
        console.log("User is not admin");
        navigate("/user/home");
      } }
      else {
        await setDoc(doc(db, "users", user.uid), { email: user.email, role: 'user' });
        navigate("/user/home");
      }

      message.success("Login successful!");
    } catch (error) {
      message.error("Error logging in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const users = userDoc.data();
        if (isAdmin(users)) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/home");
        }
      } else {
        await setDoc(doc(db, "users", user.uid), { email: user.email, role: 'user' });
        navigate("/user/home");
      }

      message.success("Google sign-in successful!");
    } catch (error) {
      message.error("Error with Google sign-in: " + error.message);
    }
  };

  return (
    <div className="kka">
      <div className="auth-container">
        <Form name="login" onFinish={onFinish} className="auth-form">
          <h1 className="heading">LOGIN</h1>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Log In
            </Button>
          </Form.Item>
          <Form.Item>
             {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have an account? <span onClick={() => navigate("/auth/signup")}>Sign Up</span>
          </Form.Item>
          <Form.Item className="spp2">
            <div className="google-sign-in-btn" onClick={handleGoogleSignIn}>
              <i className="fab fa-google"></i> Sign In with Google
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;