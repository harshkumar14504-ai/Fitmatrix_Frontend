import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { allProgress, customerAddProgress } from "../../services/progressService";
import { allBatchRequestsCustomer } from "../../services/batchRegistrationService";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function AddMyProgress() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [progressList, setProgressList] = useState([]);
    const [myBatches, setMyBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [bmi, setBmi] = useState("");

    useEffect(() => {
        loadMyBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            loadProgressForBatch(selectedBatch);
        } else {
            setProgressList([]);
        }
    }, [selectedBatch]);

    useEffect(() => {
        if (weight && height) {
            const heightInMeters = parseFloat(height) / 100;
            const calculatedBmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
            setBmi(calculatedBmi);
        } else {
            setBmi("");
        }
    }, [weight, height]);

    const loadMyBatches = () => {
        const customerId = localStorage.getItem("_id");
        if (!customerId) {
            toast.error("Please login first");
            return;
        }
        setLoading(true);
        allBatchRequestsCustomer({ memberId:customerId })
            .then((res) => {
                console.log(res);
                
                if (res.data.success) {
                    const approved = res.data.data.filter(b => b.approvalStatus === "Approved");
                    setMyBatches(approved);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    };

    const loadProgressForBatch = (batchRegId) => {
        const customerId = localStorage.getItem("_id");
        if (!customerId) return;
        setLoading(true);
        allProgress({ memberId:customerId })
            .then((res) => {
                // console.log(res);
                
                if (res.data.success) {
                    const filtered = res.data.data.filter(p => {
                        const pBatchId = String(p.batchRegistrationId?._id || p.batchRegistrationId);
                        return pBatchId === batchRegId;
                    });
                    setProgressList(filtered);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    };

    const submitProgress = (e) => {
        e.preventDefault();
        const customerId = localStorage.getItem("_id");
        if (!customerId) {
            toast.error("Please login first");
            return;
        }
        if (!selectedBatch) {
            toast.error("Please select a batch");
            return;
        }
        if (!weight || !height || !bodyFat) {
            toast.error("Please fill in all fields");
            return;
        }

        const selectedBatchData = myBatches.find(b => b._id === selectedBatch);
        console.log(selectedBatchData);
        
        const trainerId = selectedBatchData?.trainerId?._id || selectedBatchData?.trainerId;
        if (!trainerId) {
            toast.error("Trainer not found for this batch");
            return;
        }
        setLoading(true);
        customerAddProgress({
            customerId,
            trainerId,
            batchRegistrationId: selectedBatch,
            weight,
            height,
            bodyFat,
            bmi
        }).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setWeight("");
                setHeight("");
                setBodyFat("");
                loadProgressForBatch(selectedBatch);
            } else {
                toast.error(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
        }).finally(() => setLoading(false));
    };

    const getBmiCategory = (bmiValue) => {
        const bmi = parseFloat(bmiValue);
        if (bmi < 18.5) return { label: "Underweight", color: "#ffc107" };
        if (bmi < 25) return { label: "Normal", color: "#28a745" };
        if (bmi < 30) return { label: "Overweight", color: "#fd7e14" };
        return { label: "Obese", color: "#dc3545" };
    };

    const getSelectedBatchName = () => {
        const batch = myBatches.find(b => b._id === selectedBatch);
        return batch?.batchId?.batchName || "";
    };

    return (
        <div className="my-progress-container">
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h1 className="text-white display-4 mb-4">My Progress</h1>
                    <p className="text-white">Track your fitness journey by logging your measurements.</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Add New Progress</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Select Batch</label>
                                    <select
                                        className="form-select"
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                    >
                                        <option value="">-- Choose Batch --</option>
                                        {myBatches.map(batch => (
                                            <option key={batch._id} value={batch._id}>
                                                {batch.batchId?.batchName} - {batch.trainerId?.name || "Trainer"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g., 70"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Height (cm)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="e.g., 175"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Body Fat (%)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={bodyFat}
                                        onChange={(e) => setBodyFat(e.target.value)}
                                        placeholder="e.g., 15"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">BMI (Auto-calculated)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={bmi}
                                        readOnly
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    />
                                    {bmi && (
                                        <small className="mt-1 d-block" style={{ color: getBmiCategory(bmi).color, fontWeight: "bold" }}>
                                            Category: {getBmiCategory(bmi).label}
                                        </small>
                                    )}
                                </div>
                                <button className="btn btn-primary w-100" onClick={submitProgress} disabled={loading || !selectedBatch}>
                                    {loading ? "Adding..." : "Add Progress"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <h4 className="mb-4">
                            Progress History
                            {getSelectedBatchName() && <span className="text-muted fs-6"> - {getSelectedBatchName()}</span>}
                        </h4>
                        {!selectedBatch ? (
                            <div className="text-center py-5">
                                <p className="fs-5 text-muted">Please select a batch to view progress history.</p>
                            </div>
                        ) : loading ? (
                            <div className="d-flex justify-content-center py-5">
                                <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={60} />
                            </div>
                        ) : progressList.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="fs-5 text-muted">No progress logged for this batch. Start tracking!</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
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
                                        {progressList.map((item, index) => {
                                            const category = getBmiCategory(item.bmi);
                                            return (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    <td>{item.weight}</td>
                                                    <td>{item.height}</td>
                                                    <td>{item.bodyFat}</td>
                                                    <td>{item.bmi}</td>
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
            </div>
        </div>
    );
}
