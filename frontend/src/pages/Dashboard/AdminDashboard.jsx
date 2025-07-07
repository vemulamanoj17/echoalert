import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faExclamationCircle, faCheckCircle, faSpinner, faMapMarkerAlt, faImage } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styling/admindashboard.module.css';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/reports/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      alert('Failed to load reports');
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `/reports/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchReports();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Update failed');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2>All Submitted Reports</h2>
        <button onClick={logout} className={styles.logoutButton}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <p className={styles.noReports}>No reports found.</p>
      ) : (
        <div className={styles.reportsGrid}>
          {reports.map((report) => (
            <div key={report._id} className={styles.reportCard}>
              <div className={styles.cardHeader}>
                <h3>{report.title}</h3>
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
              {report.image ? (
                <img
                  src={`http://localhost:5000/uploads/${report.image}`}
                  alt={report.title}
                  className={styles.reportImage}
                />
              ) : (
                <p className={styles.noImage}>
                  <FontAwesomeIcon icon={faImage} /> No Image
                </p>
              )}
              <br/><br/>
              {report.status !== 'Resolved' && (
                <button
                  onClick={() => updateStatus(report._id, 'Resolved')}
                  className={styles.actionButton}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;