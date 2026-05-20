import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allDiet } from "../../services/dietService";
import { allBatchRequestsCustomer } from "../../services/batchRegistrationService";
import './MyDiet.css';
import { RingLoader } from "react-spinners";
import ReactModal from "react-modal";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: "80%",
        maxHeight: "90vh",
        overflowY: "auto",
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

export default function MyDiet() {
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [myBatches, setMyBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [currentDiet, setCurrentDiet] = useState(null);

    useEffect(() => {
        loadMyBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            loadDietForBatch(selectedBatch);
        } else {
            setDiets([]);
        }
    }, [selectedBatch]);

    const loadMyBatches = () => {
        const customerId = localStorage.getItem("_id");
        if (!customerId) {
            toast.error("Please login first");
            return;
        }
        setLoading(true);
        allBatchRequestsCustomer({ memberId: customerId })
            .then((res) => {
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

    const loadDietForBatch = (batchRegId) => {
        const customerId = localStorage.getItem("_id");
        if (!customerId) return;
        setLoading(true);
        allDiet({ customerId })
            .then((res) => {
                if (res.data.success) {
                    const filtered = res.data.data.filter(d => {
                        const dBatchId = String(d.batchRegistrationId?._id || d.batchRegistrationId);
                        return dBatchId === batchRegId;
                    });
                    setDiets(filtered);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Unable to load diet plans");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleView = (diet) => {
        setCurrentDiet(diet);
        setViewModalOpen(true);
    };

    return (
        <>
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h1 className="text-white display-4 mb-4">My Diet Plans</h1>
                    <p className="text-white">Here are the diet plans assigned to you by your trainers.</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="mb-4">
                    <label className="form-label fw-bold">Select Batch</label>
                    <select
                        className="form-select"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="">-- Choose Batch --</option>
                        {myBatches.map(batch => (
                            <option key={batch._id} value={batch._id}>
                                {batch.batchId?.batchName}
                            </option>
                        ))}
                    </select>
                </div>

                {!selectedBatch ? (
                    <div className="text-center py-5">
                        <p className="fs-5 text-muted">Please select a batch to view diet plans.</p>
                    </div>
                ) : loading ? (
                    <div className="d-flex justify-content-center">
                        <RingLoader color={"#eb0c1b"} loading={loading} cssOverride={override} size={100} />
                    </div>
                ) : diets.length > 0 ? (
                    <div className="row g-4 justify-content-center">
                        {diets.map((diet) => (
                            <div className="col-md-6 col-lg-4" key={diet._id}>
                                <div className="diet-card-customer h-100">
                                    <div className="diet-card-header">
                                        <h3>{diet.dietType}</h3>
                                        <span className={`status-badge ${diet.status ? 'active' : 'inactive'}`}>
                                            {diet.status ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="diet-card-body">
                                        <div className="diet-detail">
                                            <span className="label">Calories</span>
                                            <span className="value">{diet.caloriesIntake} kcal/day</span>
                                        </div>
                                        <div className="diet-detail">
                                            <span className="label">Restrictions</span>
                                            <span className="value">{diet.restrictions || 'None'}</span>
                                        </div>
                                        <div className="diet-detail">
                                            <span className="label">Weekly Chart</span>
                                            <span className="value">{diet.weeklyDietChart?.length > 0 ? "Available" : "No"}</span>
                                        </div>
                                        {diet.trainerId?.name && (
                                            <div className="diet-detail">
                                                <span className="label">Assigned by</span>
                                                <span className="value">{diet.trainerId.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    {diet.weeklyDietChart?.length > 0 && (
                                        <div className="diet-card-actions text-center pb-3">
                                            <button className="btn btn-primary btn-sm" onClick={() => handleView(diet)}>
                                                View Weekly Chart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="fs-4 text-muted">You don't have any diet plans assigned for this batch.</p>
                        <p>Contact your trainer to get a personalized diet plan.</p>
                    </div>
                )}
            </div>

            <ReactModal isOpen={viewModalOpen} onRequestClose={() => setViewModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                {currentDiet && (
                    <div>
                        <h2 className="mb-4">{currentDiet.dietType} - Weekly Diet Chart</h2>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <strong>Calories:</strong> {currentDiet.caloriesIntake} kcal/day
                            </div>
                            <div className="col-md-4">
                                <strong>Restrictions:</strong> {currentDiet.restrictions || 'None'}
                            </div>
                            {currentDiet.trainerId?.name && (
                                <div className="col-md-4">
                                    <strong>Trainer:</strong> {currentDiet.trainerId.name}
                                </div>
                            )}
                        </div>
                        {currentDiet.weeklyDietChart?.map((day, di) => (
                            <div key={di} className="card mb-3 bg-light">
                                <div className="card-header fw-bold">{day.day}</div>
                                <div className="card-body p-0">
                                    <table className="table table-sm mb-0">
                                        <thead>
                                            <tr>
                                                <th>Meal</th>
                                                <th>What to Eat</th>
                                                <th>Time</th>
                                                <th>Calories</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {day.meals?.map((meal, mi) => (
                                                <tr key={mi}>
                                                    <td>{meal.mealName || "-"}</td>
                                                    <td>{meal.items || "-"}</td>
                                                    <td>{meal.time || "-"}</td>
                                                    <td>{meal.calories || "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-secondary mt-3" onClick={() => setViewModalOpen(false)}>Close</button>
                    </div>
                )}
            </ReactModal>
        </>
    );
}
