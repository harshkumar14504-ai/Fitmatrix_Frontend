import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allExcercise } from "../../services/excerciseService";
import { allBatchRequestsCustomer } from "../../services/batchRegistrationService";
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
        height: "90vh",
        overflowY: "auto",
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

export default function MyExercise() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [myBatches, setMyBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(null);

    useEffect(() => {
        loadMyBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            loadExercisesForBatch(selectedBatch);
        } else {
            setExercises([]);
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

    const loadExercisesForBatch = (batchRegId) => {
        const customerId = localStorage.getItem("_id");
        if (!customerId) return;
        setLoading(true);
        allExcercise({ memberId: customerId })
            .then((res) => {
                if (res.data.success) {
                    const filtered = res.data.data.filter(ex => {
                        const exBatchId = String(ex.batchRegistrationId?._id || ex.batchRegistrationId);
                        return exBatchId === batchRegId;
                    });
                    setExercises(filtered);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Unable to load exercises");
            })
            .finally(() => setLoading(false));
    };

    const handleView = (exercise) => {
        setCurrentExercise(exercise);
        setViewModalOpen(true);
    };

    return (
        <>
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h4 className="text-white display-4 mb-4">My Exercises</h4>
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
                        <p className="fs-5 text-muted">Please select a batch to view exercises.</p>
                    </div>
                ) : loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={100} />
                    </div>
                ) : (
                    <div className="row g-4">
                        {exercises.map((exercise) => (
                            <div className="col-md-6 col-lg-4" key={exercise._id}>
                                <div className="feature-item h-100">
                                    <div className="feature-content p-4">
                                        <h4 className="mb-3">{exercise.excerciseName}</h4>
                                        <p className="mb-2"><strong>Sets:</strong> {exercise.sets}</p>
                                        <p className="mb-2"><strong>Repetitions:</strong> {exercise.repetitions}</p>
                                        <p className="mb-2"><strong>Duration:</strong> {exercise.duration}</p>
                                        <p className="mb-3"><strong>Weekly Plan:</strong> {exercise.weeklyExerciseChart?.length > 0 ? "Available" : "No"}</p>
                                        {exercise.weeklyExerciseChart?.length > 0 && (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleView(exercise)}>
                                                View Weekly Plan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!exercises.length && (
                            <div className="col-12 text-center">
                                <p className="fs-5 mb-0">No exercises assigned for this batch yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ReactModal isOpen={viewModalOpen} onRequestClose={() => setViewModalOpen(false)} style={modalStyles} ariaHideApp={false}>
                {currentExercise && (
                    <div>
                        <h2 className="mb-4">{currentExercise.excerciseName} - Weekly Exercise Plan</h2>
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <strong>Sets:</strong> {currentExercise.sets}
                            </div>
                            <div className="col-md-3">
                                <strong>Reps:</strong> {currentExercise.repetitions}
                            </div>
                            <div className="col-md-3">
                                <strong>Duration:</strong> {currentExercise.duration}
                            </div>
                            <div className="col-md-3">
                                <strong>Status:</strong> {currentExercise.status ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                        {currentExercise.weeklyExerciseChart?.map((day, di) => (
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
                                            {day.exercises?.map((ex, mi) => (
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
                        <button className="btn btn-secondary mt-3" onClick={() => setViewModalOpen(false)}>Close</button>
                    </div>
                )}
            </ReactModal>
        </>
    );
}
