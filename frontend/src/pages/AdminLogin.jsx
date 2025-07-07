import React, { useState } from 'react';
import axios from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../styling/admin.module.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data.user.role !== 'admin') {
        alert('Access denied: Not an admin');
        setIsLoading(false);
        return;
      }
      login(res.data.token, res.data.user);
      alert('Admin login successful');
      navigate('/AdminDashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.formTitle}>
          <FontAwesomeIcon icon={faSignInAlt} /> Admin Login
        </h2>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          <FontAwesomeIcon icon={faSignInAlt} /> {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className={styles.citizenLink}>
          Not an admin?{' '}
          <Link to="/" className={styles.link}>
            Citizen Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;