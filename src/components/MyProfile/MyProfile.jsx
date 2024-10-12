import { useState, useEffect } from 'react';
import { useAuth } from "/src/Hook/useAuth";
import { db } from "/src/firebaseConfig.js";
import { Form, Button, Image, Col, Row, Spinner } from 'react-bootstrap';
import '/src/assets/styles/MyProfile.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    gender: '',
    city: '',
    profileImage: ''
  });
  const [originalData, setOriginalData] = useState(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      getDoc(userDocRef).then(doc => {
        if (doc.exists()) {
          const data = doc.data();
          setProfileData(data);
          setOriginalData(data);
          setPreviewImage(data.profileImage || ''); 
        } else {
          setProfileData(prevState => ({ ...prevState, email: currentUser.email }));
          setOriginalData(prevState => ({ ...prevState, email: currentUser.email }));
        }
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData({ ...profileData, profileImage: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Start saving process
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updatedData = {
        ...profileData,
        profileImage: previewImage || profileData.profileImage
      };
      await setDoc(userDocRef, updatedData);
      setProfileData(updatedData);
      setOriginalData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile data:', error);
    } finally {
      setIsSaving(false); // End saving process
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setPreviewImage(originalData.profileImage || ''); 
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="my-profile-container">
      <div className="my-profile-header">
        {previewImage ? (
          <Image src={previewImage} className="profile-image" />
        ) : (
          <div className="profile-image" style={{ backgroundColor: '#ddd' }}></div> // Default style if no image
        )}
        <h2>My Profile</h2>
      </div>
      {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <Form>
          <Form.Group as={Row} controlId="formName">
            <Form.Label column sm="3">Name</Form.Label>
            <Col sm="9">
              {!isEditing ? (
                <div className="form-control-plaintext">
                  {profileData.name || 'null'}
                </div>
              ) : (
                <Form.Control
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formAddress">
            <Form.Label column sm="3">Address</Form.Label>
            <Col sm="9">
              {!isEditing ? (
                <div className="form-control-plaintext">
                  {profileData.address || 'null'}
                </div>
              ) : (
                <Form.Control
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formEmail">
            <Form.Label column sm="3">Email</Form.Label>
            <Col sm="9">
              <div className="form-control-plaintext">
                {profileData.email || 'null'}
              </div>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formPhone">
            <Form.Label column sm="3">Phone Number</Form.Label>
            <Col sm="9">
              {!isEditing ? (
                <div className="form-control-plaintext">
                  {profileData.phone || 'null'}
                </div>
              ) : (
                <Form.Control
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formGender">
            <Form.Label column sm="3">Gender</Form.Label>
            <Col sm="9">
              {!isEditing ? (
                <div className="form-control-plaintext">
                  {profileData.gender || 'null'}
                </div>
              ) : (
                <Form.Control
                  as="select"
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formCity">
            <Form.Label column sm="3">City</Form.Label>
            <Col sm="9">
              {!isEditing ? (
                <div className="form-control-plaintext">
                  {profileData.city || 'null'}
                </div>
              ) : (
                <Form.Control
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formProfileImage">
            <Form.Label column sm="3">Profile Image</Form.Label>
            <Col sm="4">
              {!isEditing ? (
                previewImage ? (
                  <Image src={previewImage} thumbnail className="mt-2" />
                ) : (
                  <div className="form-control-plaintext">No image</div>
                )
              ) : (
                <>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                  />
                  {previewImage && <Image src={previewImage} thumbnail className="mt-2" />}
                </>
              )}
            </Col>
          </Form.Group>
          <br />
          {isEditing ? (
            <div className="my-profile-buttons">
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>Save</Button>
              <Button variant="secondary" onClick={handleCancel} className="ml-2" disabled={isSaving}>Cancel</Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleEdit} disabled={isSaving || isEditing}>Edit</Button>
          )}
        </Form>
      )}
    </div>
  );
};

export default MyProfile;
