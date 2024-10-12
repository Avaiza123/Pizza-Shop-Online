// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '/src/firebaseConfig.js';
import { doc, setDoc } from 'firebase/firestore';
import '/src/assets/styles/Auth.css';

const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User signed in with Google:', user);
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const role =  "admin" ;

      await setDoc(doc(db, "users", user.uid), { email: user.email, role });

      message.success('Sign up successful!');
      navigate('/');
    } catch (error) {
      message.error('Error signing up: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const user = await signInWithGoogle();
      navigate('/user/home');
    } catch (error) {
      message.error('Error signing in with Google: ' + error.message);
    }
  };

  return (
    <div className="kka">
      <div className="auth-container">
        <Form name="signup" onFinish={onFinish} className="auth-form">
          <h1 className="heading">SIGN UP</h1>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
          <Form.Item>
            Already have an account? <span onClick={() => navigate('/auth/login')}>Log In</span>
          </Form.Item>
          <Form.Item className="spp2">
            <div className="google-sign-in-btn" onClick={handleGoogleSignIn}>
              <i className="fab fa-google"></i> Sign Up with Google
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;