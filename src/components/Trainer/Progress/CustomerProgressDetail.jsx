import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { allProgress } from "../../../services/progressService";
import { allBatchRequestsTrainer } from "../../../services/batchRegistrationService";
import "./CustomerProgressDetail.css";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function CustomerProgressDetail() {
    const { customerId, batchRegId } = useParams();
    const navigate = useNavigate();
    const trainerId = localStorage.getItem("trainerId");

    const [loading, setLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [batchInfo, setBatchInfo] = useState(null);
    const [progressHistory, setProgressHistory] = useState([]);

    useEffect(() => {
        if (trainerId && customerId) {
            fetchData();
        }
    }, [trainerId, customerId, batchRegId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [batchRes, progressRes] = await Promise.all([
                allBatchRequestsTrainer({ trainerId }),
                allProgress({ customerId })
            ]);


            if (batchRes.data.success) {
                const customerBatch = batchRes.data.data.find(b => b.memberId?._id === customerId);
                if (customerBatch) {
                    // console.log(customerBatch);
                    
                    setCustomerInfo(customerBatch.memberId);
                    setBatchInfo(customerBatch.batchId);
                }
            }

            console.log(progressRes);
            
            if (progressRes.data.success) {
                let filtered = progressRes.data.data.filter(p => {
                    const pCustId = String(p.customerId?._id || p.customerId);
                    return pCustId === customerId;
                });
                if (batchRegId) {
                    filtered = filtered.filter(p => {
                        const pBatchId = String(p.batchRegistrationId?._id || p.batchRegistrationId);
                        return pBatchId === batchRegId;
                    });
                }
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProgressHistory(filtered);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load progress data");
        } finally {
            setLoading(false);
        }
    };

    const getBmiCategory = (bmiValue) => {
        const bmi = parseFloat(bmiValue);
        if (bmi < 18.5) return { label: "Underweight", color: "#ffc107", bg: "rgba(255, 193, 7, 0.15)" };
        if (bmi < 25) return { label: "Normal", color: "#28a745", bg: "rgba(40, 167, 69, 0.15)" };
        if (bmi < 30) return { label: "Overweight", color: "#fd7e14", bg: "rgba(253, 126, 20, 0.15)" };
        return { label: "Obese", color: "#dc3545", bg: "rgba(220, 53, 69, 0.15)" };
    };

    const latestProgress = progressHistory.length > 0 ? progressHistory[0] : null;
    const previousProgress = progressHistory.length > 1 ? progressHistory[1] : null;

    const getChange = (current, previous) => {
        if (!previous || current === undefined) return null;
        const diff = current - previous;
        return diff === 0 ? { value: "0", icon: "→" } : { value: diff > 0 ? `+${diff}` : `${diff}`, icon: diff > 0 ? "↑" : "↓" };
    };

    const weightChange = latestProgress ? getChange(latestProgress.weight, previousProgress?.weight) : null;
    const bodyFatChange = latestProgress ? getChange(latestProgress.bodyFat, previousProgress?.bodyFat) : null;
    const bmiChange = latestProgress ? getChange(latestProgress.bmi, previousProgress?.bmi) : null;

    return (
        <div className="customer-progress-detail">
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5">
                    <h4 className="text-white display-4">Progress Details</h4>
                </div>
            </div>

            <div className="container py-5">
                <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
                    ← Back to Members
                </button>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={80} />
                    </div>
                ) : customerInfo ? (
                    <>
                        {/* Customer Info Card */}
                        <div className="card shadow mb-4">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-md-3 text-center">
                                        <div className="avatar-circle mx-auto mb-3">
                                            {customerInfo?.profileImage ? (
                                                <img src={customerInfo.profileImage} alt={customerInfo.name} className="rounded-circle" />
                                            ) : (
                                                <span>{customerInfo?.name?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <h3 className="mb-1">{customerInfo.name}</h3>
                                        <p className="text-muted mb-2">{customerInfo.email}</p>
                                        <div className="row g-2">
                                            {customerInfo.phone && (
                                                <div className="col-sm-4">
                                                    <small className="text-muted">Phone</small>
                                                    <p className="mb-0 fw-bold">{customerInfo.phone}</p>
                                                </div>
                                            )}
                                            {customerInfo.gender && (
                                                <div className="col-sm-4">
                                                    <small className="text-muted">Gender</small>
                                                    <p className="mb-0 fw-bold">{customerInfo.gender}</p>
                                                </div>
                                            )}
                                            {customerInfo.goal && (
                                                <div className="col-sm-4">
                                                    <small className="text-muted">Goal</small>
                                                    <p className="mb-0 fw-bold">{customerInfo.goal}</p>
                                                </div>
                                            )}
                                            {batchInfo && (
                                                <div className="col-sm-4">
                                                    <small className="text-muted">Batch</small>
                                                    <p className="mb-0 fw-bold">{batchInfo.batchName}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        {latestProgress && (
                            <div className="row g-4 mb-4">
                                <div className="col-md-3">
                                    <div className="card shadow h-100">
                                        <div className="card-body text-center">
                                            <p className="text-muted mb-1">Current Weight</p>
                                            <h2 className="mb-1">{latestProgress.weight}<small className="fs-6"> kg</small></h2>
                                            {weightChange && (
                                                <span className={`badge ${weightChange.value === "0" ? "bg-secondary" : weightChange.value.startsWith("-") ? "bg-success" : "bg-warning"}`}>
                                                    {weightChange.icon} {weightChange.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card shadow h-100">
                                        <div className="card-body text-center">
                                            <p className="text-muted mb-1">BMI</p>
                                            <h2 className="mb-1">{latestProgress.bmi}</h2>
                                            <span className="badge" style={{ backgroundColor: getBmiCategory(latestProgress.bmi).bg, color: getBmiCategory(latestProgress.bmi).color }}>
                                                {getBmiCategory(latestProgress.bmi).label}
                                            </span>
                                            {bmiChange && (
                                                <span className={`badge ms-2 ${bmiChange.value === "0" ? "bg-secondary" : bmiChange.value.startsWith("-") ? "bg-success" : "bg-warning"}`}>
                                                    {bmiChange.icon} {bmiChange.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card shadow h-100">
                                        <div className="card-body text-center">
                                            <p className="text-muted mb-1">Body Fat</p>
                                            <h2 className="mb-1">{latestProgress.bodyFat}<small className="fs-6">%</small></h2>
                                            {bodyFatChange && (
                                                <span className={`badge ${bodyFatChange.value === "0" ? "bg-secondary" : bodyFatChange.value.startsWith("-") ? "bg-success" : "bg-warning"}`}>
                                                    {bodyFatChange.icon} {bodyFatChange.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card shadow h-100">
                                        <div className="card-body text-center">
                                            <p className="text-muted mb-1">Height</p>
                                            <h2 className="mb-1">{latestProgress.height}<small className="fs-6"> cm</small></h2>
                                            <span className="text-muted small">Last updated</span>
                                            <p className="mb-0 fw-bold">{new Date(latestProgress.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Progress History Table */}
                        <div className="card shadow">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Progress History</h5>
                            </div>
                            <div className="card-body p-0">
                                {!latestProgress ? (
                                    <div className="text-center py-5">
                                        <p className="fs-5 text-muted mb-0">No progress records found.</p>
                                        <p className="text-muted">Start by adding a progress entry.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Date</th>
                                                    <th>Weight (kg)</th>
                                                    <th>Height (cm)</th>
                                                    <th>Body Fat (%)</th>
                                                    <th>BMI</th>
                                                    <th>Category</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {progressHistory.map((item, index) => {
                                                    const category = getBmiCategory(item.bmi);
                                                    return (
                                                        <tr key={item._id} className={index === 0 ? "table-active" : ""}>
                                                            <td>{index + 1}</td>
                                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                            <td className="fw-bold">{item.weight}</td>
                                                            <td>{item.height}</td>
                                                            <td>{item.bodyFat}</td>
                                                            <td className="fw-bold">{item.bmi}</td>
                                                            <td>
                                                                <span className="badge" style={{ backgroundColor: category.color }}>
                                                                    {category.label}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-5">
                        <p className="fs-5 text-muted">Customer not found.</p>
                        <button className="btn btn-primary" onClick={() => navigate("/trainer/customer/progress")}>
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
