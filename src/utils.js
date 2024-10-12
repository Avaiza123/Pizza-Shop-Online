import { doc, getDoc } from 'firebase/firestore';
import { db } from '/src/firebaseConfig.js';

export const checkUserRole = async (user) => {
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role || 'user'; 
    }
    return 'user'; 
  } catch (error) {
    console.error('Error fetching user role from Firestore:', error);
    return 'user'; 
  }
};

export const isAdmin = async (user) => {
  const role = await checkUserRole(user);
  return role === 'admin';
};

export const isUser = async (user) => {
  const role = await checkUserRole(user);
  return role === 'user';
};
