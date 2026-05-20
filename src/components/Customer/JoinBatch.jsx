import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ALL_BATCH, BASE_URL, ADD_BATCH_REGISTRATION } from '../../endPoints';
import { toast } from 'react-toastify';
import './JoinBatch.css';

const JoinBatch = () => {
  const [batches, setBatches] = useState([]);
  const [myBatches, setMyBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const customerId = localStorage.getItem('_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [batchRes, myBatchRes] = await Promise.all([
        axios.get(BASE_URL + ALL_BATCH, { headers: { Authorization: token } }),
        customerId ? axios.post(BASE_URL + 'customer/customer/batchRegistration/all', { customerId }, { headers: { Authorization: token } }) : Promise.resolve({ data: { data: [] } })
      ]);
      setBatches(batchRes.data?.data || []);
      setMyBatches(myBatchRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to load batches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getBatchStatus = (batchId) => {
    const myBatch = myBatches.find(b => {
      const bId = b.batchId?._id || b.batchId;
      return bId === batchId;
    });
    if (!myBatch) return { status: 'available', label: 'Join Now', disabled: false };
    if (myBatch.approvalStatus === 'Approved') return { status: 'booked', label: 'Booked', disabled: true };
    if (myBatch.approvalStatus === 'Pending') return { status: 'pending', label: 'Pending Approval', disabled: true };
    if (myBatch.approvalStatus === 'Rejected') return { status: 'rejected', label: 'Rejected', disabled: true };
    return { status: 'available', label: 'Join Now', disabled: false };
  };

  const handleRazorpayPayment = (batch) => {
    if (!customerId) {
      toast.error('Please login first');
      return;
    }

    const options = {
      key: 'rzp_test_1DPRImmuB75JtG',
      amount: Number(batch.fees) * 100,
      currency: 'INR',
      name: 'FITLAB Gym',
      description: `Batch Registration - ${batch.batchName}`,
      handler: function (response) {
        toast.success('Payment successful! Registering for batch...');
        registerForBatch(batch._id, response.razorpay_payment_id);
      },
      prefill: {
        name: localStorage.getItem('name') || '',
        email: localStorage.getItem('email') || '',
        contact: ''
      },
      theme: {
        color: '#eb0c1b'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const registerForBatch = async (batchId, paymentId) => {
    try {
      setRegistering(true);
      const response = await axios.post(
        BASE_URL + ADD_BATCH_REGISTRATION,
        { customerId, batchId, paymentId, paymentStatus: 'Completed' },
        { headers: { Authorization: token } }
      );

      if (response.data?.success) {
        toast.success('Successfully registered for the batch!');
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to register');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to register for batch');
      }
      console.error(error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="join-batch-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="join-batch-container">
      <div className="join-batch-header">
        <h1>Join a Batch</h1>
        <p>Select a batch and register to start your fitness journey</p>
      </div>

      {batches.length === 0 ? (
        <div className="no-batches">
          <p>No batches available at the moment</p>
        </div>
      ) : (
        <div className="batches-grid">
          {batches.map((batch) => {
            const { status, label, disabled } = getBatchStatus(batch._id);
            return (
              <div key={batch._id} className={`batch-card ${status}`}>
                <div className="batch-header">
                  <h3>{batch.batchName}</h3>
                  <span className={`batch-status ${status}`}>{status === 'booked' ? '✓ Booked' : status === 'pending' ? '⏳ Pending' : status === 'rejected' ? '✕ Rejected' : 'Active'}</span>
                </div>

                <div className="batch-details">
                  {batch.trainerAllot?.name && (
                    <div className="detail-item">
                      <span className="label">Trainer:</span>
                      <span className="value">{batch.trainerAllot.name}</span>
                    </div>
                  )}
                  {batch.startDate && (
                    <div className="detail-item">
                      <span className="label">Start Date:</span>
                      <span className="value">{new Date(batch.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {batch.endDate && (
                    <div className="detail-item">
                      <span className="label">End Date:</span>
                      <span className="value">{new Date(batch.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {batch.time && (
                    <div className="detail-item">
                      <span className="label">Time:</span>
                      <span className="value">{batch.time}</span>
                    </div>
                  )}
                  {batch.totalSlots && (
                    <div className="detail-item">
                      <span className="label">Slots:</span>
                      <span className="value">{batch.totalSlots}</span>
                    </div>
                  )}
                  {batch.sessionType && (
                    <div className="detail-item">
                      <span className="label">Session:</span>
                      <span className="value">{batch.sessionType}</span>
                    </div>
                  )}
                  {batch.fees && (
                    <div className="detail-item">
                      <span className="label">Fees:</span>
                      <span className="price">₹{batch.fees}</span>
                    </div>
                  )}
                </div>

                {disabled ? (
                  <button className={`join-btn ${status}`} disabled>
                    {label}
                  </button>
                ) : (
                  <button
                    className="join-btn"
                    onClick={() => handleRazorpayPayment(batch)}
                    disabled={registering || paymentLoading}
                  >
                    {registering ? 'Registering...' : `Pay ₹${batch.fees} & Join`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JoinBatch;
