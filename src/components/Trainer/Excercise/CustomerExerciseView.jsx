import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import ReactModal from "react-modal";
import { allExcercise, addExcercise, updateExcercise, singleExcercise, deleteExcercise, generateExerciseAI } from "../../../services/excerciseService";
import { allCustomer, getCustomerById } from "../../../services/customerService";
import { allProgress } from "../../../services/progressService";
import "./CustomerExerciseView.css";

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

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const emptyWeeklyChart = () => days.map(day => ({
    day,
    exercises: [{ exerciseName: "", sets: "", repetitions: "", duration: "" }]
}));

export default function CustomerExerciseView() {
    const { batchRegId, customerId } = useParams();
    const navigate = useNavigate();
    const trainerId = localStorage.getItem("trainerId") || localStorage.getItem("_id");

    const [loading, setLoading] = useState(false);
    const [customerExercises, setCustomerExercises] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerProfile, setCustomerProfile] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [excerciseName, setExcerciseName] = useState("");
    const [sets, setSets] = useState("");
    const [repetitions, setRepetitions] = useState("");
    const [duration, setDuration] = useState("");
    const [weeklyExerciseChart, setWeeklyExerciseChart] = useState(emptyWeeklyChart);
    const [editExerciseId, setEditExerciseId] = useState("");
    const [currentExercise, setCurrentExercise] = useState(null);

    useEffect(() => {
        if (trainerId && customerId) {
            fetchCustomerExercises();
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

    const fetchCustomerExercises = () => {
        setLoading(true);
        allExcercise({ memberId: customerId, trainerId })
            .then((res) => {
                if (res.data.success) {
                    const filtered = res.data.data.filter(d => {
                        const dCustId = String(d.memberId?._id || d.memberId);
                        return dCustId === customerId;
                    });
                    setCustomerExercises(filtered);
                    if (filtered.length > 0) {
                        setCustomerName(filtered[0].memberId?.name || "Customer");
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to load exercises");
            })
            .finally(() => setLoading(false));
    };

    const openAddModal = () => {
        setExcerciseName("");
        setSets("");
        setRepetitions("");
        setDuration("");
        setWeeklyExerciseChart(emptyWeeklyChart());
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

            const aiRes = await generateExerciseAI({
                age: customerProfile.age,
                gender: customerProfile.gender,
                goal: customerProfile.goal,
                weight: latestProgress.weight,
                height: latestProgress.height,
                bodyFat: latestProgress.bodyFat,
                bmi: latestProgress.bmi
            });

            if (aiRes.data.success) {
                setExcerciseName(aiRes.data.data.excerciseName);
                setSets(aiRes.data.data.sets);
                setRepetitions(aiRes.data.data.repetitions);
                setDuration(aiRes.data.data.duration);
                if (aiRes.data.data.weeklyExerciseChart && aiRes.data.data.weeklyExerciseChart.length > 0) {
                    setWeeklyExerciseChart(aiRes.data.data.weeklyExerciseChart);
                }
                toast.success("AI exercise suggestion loaded!");
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

    const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
        const updated = [...weeklyExerciseChart];
        updated[dayIndex].exercises[exerciseIndex][field] = value;
        setWeeklyExerciseChart(updated);
    };

    const addExercise = (dayIndex) => {
        const updated = [...weeklyExerciseChart];
        updated[dayIndex].exercises.push({ exerciseName: "", sets: "", repetitions: "", duration: "" });
        setWeeklyExerciseChart(updated);
    };

    const removeExercise = (dayIndex, exerciseIndex) => {
        const updated = [...weeklyExerciseChart];
        updated[dayIndex].exercises.splice(exerciseIndex, 1);
        setWeeklyExerciseChart(updated);
    };

    const submitAdd = (e) => {
        e.preventDefault();
        addExcercise({
            trainerId,
            memberId: customerId,
            batchRegistrationId: batchRegId,
            excerciseName:excerciseName,
            sets:sets,
            repetitions:repetitions,
            duration:duration,
            weeklyExerciseChart
        }).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setAddModalOpen(false);
                fetchCustomerExercises();
            } else {
                toast.error(res.data.message || "Failed to add exercise");
            }
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
        });
    };

    const handleView = (exerciseId) => {
        setLoading(true);
        singleExcercise({ _id: exerciseId })
            .then(res => {
                if (res.data.success) {
                    setCurrentExercise(res.data.data);
                    setViewModalOpen(true);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleEdit = (exerciseId) => {
        setLoading(true);
        singleExcercise({ _id: exerciseId })
            .then(res => {
                if (res.data.success) {
                    const d = res.data.data;
                    setEditExerciseId(d._id);
                    setExcerciseName(d.excerciseName);
                    setSets(d.sets);
                    setRepetitions(d.repetitions);
                    setDuration(d.duration);
                    setWeeklyExerciseChart(d.weeklyExerciseChart && d.weeklyExerciseChart.length > 0
                        ? d.weeklyExerciseChart
                        : emptyWeeklyChart()
                    );
                    setEditModalOpen(true);
                }
            })
            .finally(() => setLoading(false));
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        updateExcercise({
            _id: editExerciseId,
            excerciseName,
            sets,
            repetitions,
            duration,
            weeklyExerciseChart
        }).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setEditModalOpen(false);
                fetchCustomerExercises();
            } else {
                toast.error(res.data.message);
            }
        });
    };

    const handleDelete = (exerciseId) => {
        if (window.confirm("Are you sure you want to delete this exercise?")) {
            deleteExcercise({ _id: exerciseId }).then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchCustomerExercises();
                }
            });
        }
    };

    const renderWeeklyChart = (chart) => {
        if (!chart || chart.length === 0) return null;
        return (
            <div className="weekly-chart-display mt-3">
                <h5 className="mb-3">Weekly Exercise Plan</h5>
                {chart.map((day, di) => (
                    <div key={di} className="card mb-3 bg-light">
                        <div className="card-header fw-bold">{day.day}</div>
                        <div className="card-body p-0">
                            <table className="table table-sm mb-0">
                                <thead>
                                    <tr>
                                        <th>Exercise</th>
                                        <th>Sets</th>
                                        <th>Reps</th>
                                        <th>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.exercises.map((ex, mi) => (
                                        <tr key={mi}>
                                            <td>{ex.exerciseName || "-"}</td>
                                            <td>{ex.sets || "-"}</td>
                                            <td>{ex.repetitions || "-"}</td>
                                            <td>{ex.duration || "-"}</td>
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
            <h5 className="text-white mb-3">Weekly Exercise Plan</h5>
            {weeklyExerciseChart.map((day, dayIndex) => (
                <div key={day.day} className="card mb-3 bg-dark text-white border-secondary">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{day.day}</h6>
                        <button type="button" className="btn btn-sm btn-outline-light" onClick={() => addExercise(dayIndex)}>
                            + Add Exercise
                        </button>
                    </div>
                    <div className="card-body">
                        {day.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="row g-2 mb-2 p-2 bg-secondary rounded">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Exercise Name"
                                        value={exercise.exerciseName}
                                        onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "exerciseName", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Sets"
                                        value={exercise.sets}
                                        onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "sets", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        placeholder="Reps"
                                        value={exercise.repetitions}
                                        onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "repetitions", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Duration"
                                        value={exercise.duration}
                                        onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, "duration", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger w-100"
                                        onClick={() => removeExercise(dayIndex, exerciseIndex)}
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
        <div className="customer-exercise-view">
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5">
                    <h4 className="text-white display-4">
                        {customerName ? `${customerName}'s Exercises` : "Customer Exercises"}
                    </h4>
                </div>
            </div>

            <div className="container mt-4">
                <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                {customerExercises.length === 0 && !loading && (
                    <div className="text-center py-5">
                        <p className="fs-4 text-muted">No exercises assigned yet.</p>
                        <button className="btn btn-success mt-2" onClick={openAddModal}>
                            Add Weekly Exercise Plan
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={80} />
                    </div>
                ) : (
                    <div className="row g-4">
                        {customerExercises.map((exercise) => (
                            <div className="col-md-6 col-lg-4" key={exercise._id}>
                                <div className="exercise-card-trainer h-100">
                                    <div className="exercise-card-header">
                                        <h3>{exercise.excerciseName}</h3>
                                        <span className={`status-badge ${exercise.status ? 'active' : 'inactive'}`}>
                                            {exercise.status ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="exercise-card-body">
                                        <div className="exercise-detail">
                                            <span className="label">Sets</span>
                                            <span className="value">{exercise.sets}</span>
                                        </div>
                                        <div className="exercise-detail">
                                            <span className="label">Repetitions</span>
                                            <span className="value">{exercise.repetitions}</span>
                                        </div>
                                        <div className="exercise-detail">
                                            <span className="label">Duration</span>
                                            <span className="value">{exercise.duration}</span>
                                        </div>
                                        <div className="exercise-detail">
                                            <span className="label">Weekly Plan</span>
                                            <span className="value">{exercise.weeklyExerciseChart?.length > 0 ? "Yes" : "No"}</span>
                                        </div>
                                    </div>
                                    <div className="exercise-card-actions">
                                        <button className="btn btn-info btn-sm text-white" onClick={() => handleView(exercise._id)}>
                                            View
                                        </button>
                                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(exercise._id)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(exercise._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="col-md-6 col-lg-4">
                            <div className="exercise-card-trainer add-exercise-card h-100" onClick={openAddModal}>
                                <div className="add-exercise-content">
                                    <span className="add-icon">+</span>
                                    <p>Add Weekly Exercise Plan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ReactModal isOpen={addModalOpen} onRequestClose={() => setAddModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Add Weekly Exercise Plan</h2>
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={autoFillWithAI} disabled={aiLoading}>
                        {aiLoading ? <span className="spinner-border spinner-border-sm me-1" /> : "✨ "}
                        {aiLoading ? "Generating..." : "Auto-fill with AI"}
                    </button>
                </div>
                <form onSubmit={submitAdd}>
                    {customerProfile && (
                        <div className="alert alert-info mb-3">
                            <strong>Client Profile:</strong><br />
                            Name: {customerProfile.name || "N/A"} | Age: {customerProfile.age || "N/A"} | Goal: {customerProfile.goal || "N/A"} | Gender: {customerProfile.gender || "N/A"}
                        </div>
                    )}
                    <div className="row g-3 mb-3">
                        <div className="col-md-3">
                            <label className="form-label">Exercise Name</label>
                            <input type="text" className="form-control" value={excerciseName} onChange={(e) => setExcerciseName(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Sets</label>
                            <input type="number" className="form-control" value={sets} onChange={(e) => setSets(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Repetitions</label>
                            <input type="number" className="form-control" value={repetitions} onChange={(e) => setRepetitions(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Duration</label>
                            <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </div>
                    </div>

                    {renderWeeklyChartForm()}

                    <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-success">Save Exercise Plan</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>Cancel</button>
                    </div>
                </form>
            </ReactModal>

            <ReactModal isOpen={editModalOpen} onRequestClose={() => setEditModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                <h2 className="mb-4">Edit Weekly Exercise Plan</h2>
                <form onSubmit={submitUpdate}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-3">
                            <label className="form-label">Exercise Name</label>
                            <input type="text" className="form-control" value={excerciseName} onChange={(e) => setExcerciseName(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Sets</label>
                            <input type="number" className="form-control" value={sets} onChange={(e) => setSets(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Repetitions</label>
                            <input type="number" className="form-control" value={repetitions} onChange={(e) => setRepetitions(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Duration</label>
                            <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </div>
                    </div>

                    {renderWeeklyChartForm()}

                    <div className="d-flex gap-2 mt-4">
                        <button type="submit" className="btn btn-warning">Update Exercise Plan</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                    </div>
                </form>
            </ReactModal>

            <ReactModal isOpen={viewModalOpen} onRequestClose={() => setViewModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                <h2 className="mb-4">Exercise Details</h2>
                {currentExercise && (
                    <div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-3">
                                <strong>Exercise:</strong> {currentExercise.excerciseName}
                            </div>
                            <div className="col-md-2">
                                <strong>Sets:</strong> {currentExercise.sets}
                            </div>
                            <div className="col-md-2">
                                <strong>Reps:</strong> {currentExercise.repetitions}
                            </div>
                            <div className="col-md-2">
                                <strong>Duration:</strong> {currentExercise.duration}
                            </div>
                            <div className="col-md-3">
                                <strong>Status:</strong> {currentExercise.status ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                        {renderWeeklyChart(currentExercise.weeklyExerciseChart)}
                        <button className="btn btn-secondary mt-3" onClick={() => setViewModalOpen(false)}>Close</button>
                    </div>
                )}
            </ReactModal>
        </div>
    );
}
