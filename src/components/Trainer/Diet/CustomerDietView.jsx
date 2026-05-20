import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import ReactModal from "react-modal";
import { allDiet, addDiet, updateDiet, singleDiet, deleteDiet, generateDietAI } from "../../../services/dietService";
import { allBatchRequestsTrainer } from "../../../services/batchRegistrationService";
import { allProgress } from "../../../services/progressService";
import { allCustomer, getCustomerById } from "../../../services/customerService";
import "./CustomerDietView.css";

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: "80%",
        maxHeight: "90vh",
        height: "90vh",
        overflowY: "auto",
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const defaultMeals = ["Breakfast", "Mid-Morning", "Lunch", "Evening Snack", "Dinner"];

const emptyWeeklyChart = () => days.map(day => ({
    day,
    meals: defaultMeals.map(meal => ({
        mealName: meal,
        items: "",
        time: "",
        calories: ""
    }))
}));

export default function CustomerDietView() {
    const { batchRegId, customerId } = useParams();
    const navigate = useNavigate();
    const trainerId = localStorage.getItem("trainerId");

    const [loading, setLoading] = useState(false);
    const [customerDiets, setCustomerDiets] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerProfile, setCustomerProfile] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [dietType, setDietType] = useState("");
    const [restrictions, setRestrictions] = useState("");
    const [caloriesIntake, setCaloriesIntake] = useState("");
    const [weeklyDietChart, setWeeklyDietChart] = useState(emptyWeeklyChart);
    const [editDietId, setEditDietId] = useState("");
    const [currentDiet, setCurrentDiet] = useState(null);

    useEffect(() => {
        if (trainerId && customerId) {
            fetchCustomerDiets();
            fetchCustomerProfile();
        }
    }, [trainerId, customerId]);

    const fetchCustomerProfile = () => {
        allCustomer({ userId: customerId })
            .then((res) => {
                if (res.data.success) {
                    setCustomerProfile(res.data.data[0]);
                    setCustomerName(res.data.data[0].name || "Customer");
                }
            })
            .catch((err) => console.log(err));
    };

    const fetchCustomerDiets = () => {
        setLoading(true);
        allDiet({ customerId, trainerId })
            .then((res) => {
                if (res.data.success) {
                    const filtered = res.data.data.filter(d => {
                        const dCustId = String(d.customerId?._id || d.customerId);
                        return dCustId === customerId;
                    });
                    setCustomerDiets(filtered);
                    if (filtered.length > 0) {
                        const diet = filtered[0];
                        setCustomerName(diet.customerId?.name || "Customer");
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to load diet plans");
            })
            .finally(() => setLoading(false));
    };

    const openAddModal = () => {
        setDietType("");
        setRestrictions("");
        setCaloriesIntake("");
        setWeeklyDietChart(emptyWeeklyChart());
        setAddModalOpen(true);
    };

    const autoFillWithAI = async () => {
        if (!customerProfile) {
            toast.error("Customer profile not loaded yet");
            return;
        }
        setAiLoading(true);
        try {
            const progressRes = await allProgress({ customerId });
            let latestProgress = {};
            if (progressRes.data.success && progressRes.data.data.length > 0) {
                const filtered = progressRes.data.data.filter(p => {
                    const pCustId = String(p.customerId?._id || p.customerId);
                    return pCustId === customerId;
                }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                latestProgress = filtered[0] || {};
            }

            const aiRes = await generateDietAI({
                age: customerProfile.age,
                gender: customerProfile.gender,
                goal: customerProfile.goal,
                weight: latestProgress.weight,
                height: latestProgress.height,
                bodyFat: latestProgress.bodyFat,
                bmi: latestProgress.bmi,
                address: customerProfile.address,
                phone: customerProfile.phone,
                email: customerProfile.email
            });

            if (aiRes.data.success) {
                setDietType(aiRes.data.data.dietType);
                setCaloriesIntake(aiRes.data.data.caloriesIntake);
                setRestrictions(aiRes.data.data.restrictions);
                if (aiRes.data.data.weeklyDietChart && aiRes.data.data.weeklyDietChart.length > 0) {
                    setWeeklyDietChart(aiRes.data.data.weeklyDietChart);
                }
                toast.success("AI diet suggestion loaded!");
            } else {
                toast.error(aiRes.data.message || "Failed to get AI suggestion");
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 503) {
                toast.error("AI service is busy. Please try again in a moment.");
            } else {
                toast.error("Something went wrong with AI");
            }
        } finally {
            setAiLoading(false);
        }
    };

    const handleMealChange = (dayIndex, mealIndex, field, value) => {
        const updated = [...weeklyDietChart];
        updated[dayIndex].meals[mealIndex][field] = value;
        setWeeklyDietChart(updated);
    };

    const addMeal = (dayIndex) => {
        const updated = [...weeklyDietChart];
        updated[dayIndex].meals.push({ mealName: "", items: "", time: "", calories: "" });
        setWeeklyDietChart(updated);
    };

    const removeMeal = (dayIndex, mealIndex) => {
        const updated = [...weeklyDietChart];
        updated[dayIndex].meals.splice(mealIndex, 1);
        setWeeklyDietChart(updated);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addDiet({
            dietType,
            restrictions,
            caloriesIntake,
            trainerId,
            customerId,
            batchRegistrationId: batchRegId,
            weeklyDietChart
        }).then((res) => {
            if (res.data.success) {
                toast.success("Diet added successfully");
                setAddModalOpen(false);
                fetchCustomerDiets();
            } else {
                toast.error(res.data.message || "Failed to add diet");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
        });
    };

    const handleView = (dietId) => {
        setLoading(true);
        singleDiet({ _id: dietId })
            .then(res => {
                if (res.data.success) {
                    setCurrentDiet(res.data.data);
                    setViewModalOpen(true);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleEdit = (dietId) => {
        setLoading(true);
        singleDiet({ _id: dietId })
            .then(res => {
                if (res.data.success) {
                    const d = res.data.data;
                    setEditDietId(d._id);
                    setDietType(d.dietType);
                    setRestrictions(d.restrictions);
                    setCaloriesIntake(d.caloriesIntake);
                    setWeeklyDietChart(d.weeklyDietChart && d.weeklyDietChart.length > 0
                        ? d.weeklyDietChart
                        : emptyWeeklyChart()
                    );
                    setEditModalOpen(true);
                }
            })
            .finally(() => setLoading(false));
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        updateDiet({
            _id: editDietId,
            dietType,
            restrictions,
            caloriesIntake,
            weeklyDietChart
        }).then((res) => {
            if (res.data.success) {
                toast.success("Diet updated");
                setEditModalOpen(false);
                fetchCustomerDiets();
            }
        });
    };

    const handleDelete = (dietId) => {
        if (window.confirm("Are you sure you want to delete this diet plan?")) {
            deleteDiet({ _id: dietId }).then((res) => {
                if (res.data.success) {
                    toast.success("Diet deleted");
                    fetchCustomerDiets();
                }
            });
        }
    };

    const renderWeeklyChart = (chart) => {
        if (!chart || chart.length === 0) return null;
        return (
            <div className="weekly-chart-display mt-3">
                <h5 className="mb-3">Weekly Meal Plan</h5>
                {chart.map((day, di) => (
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
                                    {day.meals.map((meal, mi) => (
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
            </div>
        );
    };

    const renderWeeklyChartForm = () => (
        <div className="weekly-chart-form mt-4">
            <h5 className="text-white mb-3">Weekly Meal Plan</h5>
            {weeklyDietChart.map((day, dayIndex) => (
                <div key={day.day} className="card mb-3 bg-dark text-white border-secondary">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{day.day}</h6>
                        <button type="button" className="btn btn-sm btn-outline-light" onClick={() => addMeal(dayIndex)}>
                            + Add Meal
                        </button>
                    </div>
                    <div className="card-body">
                        {day.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="row g-2 mb-2 p-2 bg-secondary rounded">
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Meal Name"
                                        value={meal.mealName}
                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "mealName", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="What to eat"
                                        value={meal.items}
                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "items", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Time"
                                        value={meal.time}
                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "time", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Calories"
                                        value={meal.calories}
                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "calories", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger w-100"
                                        onClick={() => removeMeal(dayIndex, mealIndex)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="customer-diet-view">
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5">
                    <h4 className="text-white display-4">
                        {customerName ? `${customerName}'s Diet Plans` : "Customer Diet Plans"}
                    </h4>
                </div>
            </div>

            <div className="container mt-4">
                <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {customerDiets.length === 0 && !loading && (
                    <div className="text-center py-5">
                        <p className="fs-4 text-muted">No diet plans assigned yet.</p>
                        <button className="btn btn-success mt-2" onClick={openAddModal}>
                            Add Weekly Diet Chart
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={80} />
                    </div>
                ) : (
                    <div className="row g-4">
                        {customerDiets.map((diet) => (
                            <div className="col-md-6 col-lg-4" key={diet._id}>
                                <div className="diet-card-trainer h-100">
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
                                            <span className="value">{diet.weeklyDietChart?.length > 0 ? "Yes" : "No"}</span>
                                        </div>
                                    </div>
                                    <div className="diet-card-actions">
                                        <button className="btn btn-info btn-sm text-white" onClick={() => handleView(diet._id)}>
                                            View
                                        </button>
                                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(diet._id)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(diet._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="col-md-6 col-lg-4">
                            <div className="diet-card-trainer add-diet-card h-100" onClick={openAddModal}>
                                <div className="add-diet-content">
                                    <span className="add-icon">+</span>
                                    <p>Add Weekly Diet Chart</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ReactModal isOpen={addModalOpen} onRequestClose={() => setAddModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Add Weekly Diet Chart</h2>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={autoFillWithAI} disabled={aiLoading}>
                        {aiLoading ? <span className="spinner-border spinner-border-sm me-1" /> : "✨ "}
                        {aiLoading ? "Generating..." : "Auto-fill with AI"}
                    </button>
                </div>
                <form onSubmit={submitAdd}>
                    {customerProfile && (
                        <div className="alert alert-info mb-3">
                            <strong>Client Profile:</strong><br />
                            Name: {customerProfile.name || "N/A"} | Age: {customerProfile.age || "N/A"} | Gender: {customerProfile.gender || "N/A"}<br />
                            Goal: {customerProfile.goal || "N/A"} | Phone: {customerProfile.phone || "N/A"}<br />
                            Email: {customerProfile.email || "N/A"} | Location: {customerProfile.address || "N/A"}
                        </div>
                    )}
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Diet Type</label>
                            <input type="text" className="form-control" value={dietType} onChange={(e) => setDietType(e.target.value)} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Restrictions</label>
                            <input type="text" className="form-control" value={restrictions} onChange={(e) => setRestrictions(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Daily Calories Target</label>
                            <input type="number" className="form-control" value={caloriesIntake} onChange={(e) => setCaloriesIntake(e.target.value)} required />
                        </div>
                    </div>

                    {renderWeeklyChartForm()}

                    <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-success">Save Weekly Diet Chart</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancel</button>
                    </div>
                </form>
            </ReactModal>

            <ReactModal isOpen={editModalOpen} onRequestClose={() => setEditModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                <h2 className="mb-4">Edit Weekly Diet Chart</h2>
                <form onSubmit={submitUpdate}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Diet Type</label>
                            <input type="text" className="form-control" value={dietType} onChange={(e) => setDietType(e.target.value)} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Restrictions</label>
                            <input type="text" className="form-control" value={restrictions} onChange={(e) => setRestrictions(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Daily Calories Target</label>
                            <input type="number" className="form-control" value={caloriesIntake} onChange={(e) => setCaloriesIntake(e.target.value)} required />
                        </div>
                    </div>

                    {renderWeeklyChartForm()}

                    <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-warning">Update Diet Chart</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                    </div>
                </form>
            </ReactModal>

            <ReactModal isOpen={viewModalOpen} onRequestClose={() => setViewModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                <h2 className="mb-4">Diet Details</h2>
                {currentDiet && (
                    <div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <strong>Diet Type:</strong> {currentDiet.dietType}
                            </div>
                            <div className="col-md-4">
                                <strong>Restrictions:</strong> {currentDiet.restrictions || 'None'}
                            </div>
                            <div className="col-md-4">
                                <strong>Calories:</strong> {currentDiet.caloriesIntake} kcal/day
                            </div>
                        </div>
                        <div className="mb-3">
                            <strong>Status:</strong> {currentDiet.status ? 'Active' : 'Inactive'}
                        </div>
                        {renderWeeklyChart(currentDiet.weeklyDietChart)}
                        <button className="btn btn-secondary mt-3" onClick={() => setViewModalOpen(false)}>Close</button>
                    </div>
                )}
            </ReactModal>
        </div>
    );
}
