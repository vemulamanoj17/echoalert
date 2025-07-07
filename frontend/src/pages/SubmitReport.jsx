import React, { useState } from 'react';
import axios from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading, faFileAlt, faMapMarkerAlt, faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from '../styling/submitreport.module.css';

const SubmitReport = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('/reports', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Report submitted successfully');
      navigate('/CitizenDashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Submission failed';
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map((e) => e.msg).join('\n');
        alert(errorMessages);
      } else {
        alert(message);
      }
    }
  };

  return (
    <div className={styles.submitContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.formTitle}>
          <FontAwesomeIcon icon={faPaperPlane} /> Submit a Report
        </h2>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faHeading} className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faFileAlt} className={styles.inputIcon} />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faImage} className={styles.inputIcon} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.input}
          />
        </div>

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
        )}

        <button type="submit" className={styles.submitButton}>
          <FontAwesomeIcon icon={faPaperPlane} /> Submit Report
        </button>
      </form>
    </div>
  );
};

export default SubmitReport;