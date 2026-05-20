import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { allCustomer } from "../../services/customerService";
import { allExcercise } from "../../services/excerciseService";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function AdminViewExercise() {
    const [loading, setLoading] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [customersRes, exercisesRes] = await Promise.all([
                allCustomer({}),
                allExcercise({})
            ]);
            if (customersRes.data.success) {
                setCustomers(customersRes.data.data);
            }
            if (exercisesRes.data.success) {
                setExercises(exercisesRes.data.data);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const filteredExercises = selectedCustomer
        ? exercises.filter(e => {
            console.log(selectedCustomer);
            console.log(exercises);
            
            const eCustId = String(e.memberId?._id || e.customerId);
            return eCustId === selectedCustomer;
        })
        : exercises;

    return (
        <>
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h4 className="text-white display-4 mb-4">View Exercise Plans</h4>
                    <ol className="breadcrumb d-flex justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="/admin/dashboard">Home</a></li>
                        <li className="breadcrumb-item active text-primary">Exercise Plans</li>
                    </ol>
                </div>
            </div>

            <div className="container-fluid py-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">All Customers</option>
                            {customers.map(c => (
                                
                                <option key={c._id} value={c.userId}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={80} />
                    </div>
                ) : filteredExercises.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered text-dark">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Exercise Set</th>
                                    <th>Duration</th>
                                    <th>Repetitions</th>
                                    <th>Trainer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExercises.map((exercise, index) => (
                                    <tr key={exercise._id}>
                                        <td>{index + 1}</td>
                                        <td>{exercise.memberId?.name || "N/A"}</td>
                                        <td>{exercise.memberId?.email || "N/A"}</td>
                                        <td><span className="badge bg-primary">{exercise.sets}</span></td>
                                        <td>{exercise.duration} min</td>
                                        <td>{exercise.repetitions}</td>
                                        <td>{exercise.trainerId?.name || "N/A"}</td>
                                        <td>
                                            <span className={`badge ${exercise.status ? "bg-success" : "bg-secondary"}`}>
                                                {exercise.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="fs-5 text-muted">No exercise plans found.</p>
                    </div>
                )}
            </div>
        </>
    );
}
