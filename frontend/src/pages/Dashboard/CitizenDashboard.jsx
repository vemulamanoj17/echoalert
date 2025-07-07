import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMapMarkerAlt, faExclamationCircle, faCheckCircle, faSpinner, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styling/citizendash.module.css';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug user object
  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/reports/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2>Welcome, {user?.name || 'Citizen'}</h2>
        <button onClick={logout} className={styles.logoutButton}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>

      <h3 className={styles.sectionTitle}>Your Environmental Reports</h3>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <div className={styles.loading}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <p className={styles.noReports}>No reports found. Start by submitting a new report!</p>
      ) : (
        <div className={styles.reportsGrid}>
          {reports.map((report) => (
            <div key={report._id} className={styles.reportCard}>
              <div className={styles.cardHeader}>
                <h4>{report.title}</h4>
                <span
                  className={`${styles.status} ${
                    report.status === 'Pending' ? styles.pending : styles.resolved
                  }`}
                >
                  <FontAwesomeIcon
                    icon={report.status === 'Pending' ? faExclamationCircle : faCheckCircle}
                  />{' '}
                  {report.status}
                </span>
              </div>
              <p className={styles.description}>{report.description}</p>
              <div className={styles.location}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {report.location}
              </div>
              {report.image && (
                <img
                  src={`http://localhost:5000/uploads/${report.image}`}
                  alt={report.title}
                  className={styles.reportImage}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <Link to="/submit" className={styles.submitLink}>
        <button className={styles.submitButton}>
          <FontAwesomeIcon icon={faPlusCircle} /> Submit New Report
        </button>
      </Link>
    </div>
  );
};

export default CitizenDashboard;