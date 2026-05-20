import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { allBatchRequestsTrainer } from '../../services/batchRegistrationService';
import './TrainerCustomerProgress.css';
import { allBatchRequestsTrainer } from '../../../services/batchRegistrationService';

const TrainerCustomerProgress = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();
  const trainerId = localStorage.getItem('trainerId');
  const [searchParams] = useSearchParams();
  const batchIdParam = searchParams.get('batchId');

  useEffect(() => {
    if (trainerId) {
    
      fetchAssignedCustomers();
    }
  }, [trainerId, batchIdParam]);

  const fetchAssignedCustomers = () => {
    setLoading(true);
    allBatchRequestsTrainer({ trainerId })
      .then(res => {
        if (res.data.success) {
          let filteredCustomers = res.data.data;
          if (batchIdParam) {
            filteredCustomers = res.data.data.filter(req => req.batchId?._id === batchIdParam);
          }
          setCustomers(filteredCustomers);
        } else {
          toast.error(res.data.message || 'Failed to load customers');
        }
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to load customers');
      })
      .finally(() => setLoading(false));
  };

  const handleViewDiet = (batchRegistrationId, customerId) => {
    navigate(`/trainer/diet/customer/${batchRegistrationId}/${customerId}`);
  };

  const handleViewExercise = (batchRegistrationId, customerId) => {
    navigate(`/trainer/excercise/customer/${batchRegistrationId}/${customerId}`);
  };

  const handleViewProgress = (customerId,bId) => {
    navigate(`/trainer/customer/progress/${customerId}/${bId}`);
  };

  if (loading) {
    return (
      <div className="trainer-progress-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading assigned customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-progress-container">
      <div className="progress-header">
        <h1>My Assigned Members</h1>
        <p>Manage diet, exercises, and track progress for your members</p>
      </div>

      {customers.length === 0 ? (
        <div className="no-customers">
          <p>No members assigned yet</p>
        </div>
      ) : (
        <div className="customers-grid">
          {customers.map((batchReq) => {
            const customer = batchReq.memberId;
            return (
              <div key={batchReq._id} className="customer-card">
                <div className="card-header">
                  <div className="customer-avatar">
                    {customer?.profileImage ? (
                      <img src={customer.profileImage} alt={customer.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {customer?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="customer-info">
                    <h3>{customer?.name}</h3>
                    <p className="email">{customer?.email}</p>
                  </div>
                </div>

                <div className="customer-details">
                  {customer?.phone && (
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{customer.phone}</span>
                    </div>
                  )}
                  {customer?.age && (
                    <div className="detail-row">
                      <span className="label">Age:</span>
                      <span className="value">{customer.age}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    
                    <span className={`status`}>
                      
                      {batchReq.status==true? 'Active' : "InActive"}
                    </span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewDiet(batchReq._id, customer._id)}
                    title="Add Diet Plan"
                  >
                    🥗 Add Diet
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleViewExercise(batchReq._id, customer._id)}
                    title="Add Exercise"
                  >
                    💪 Add Exercise
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => handleViewProgress(customer._id,batchReq._id)}
                    title="View Progress"
                  >
                    📈 Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainerCustomerProgress;
