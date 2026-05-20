import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { trainerDashboard } from "../../services/userService";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function TrainerDashboard() {
    const [loading, setLoading] = useState(false);
    const [customerCount, setCustomerCount] = useState(0);
    const [dietCount, setDietCount] = useState(0);
    const [workoutCount, setWorkoutCount] = useState(0);

    useEffect(() => {
        getDashboard();
    }, []);

    const data = {
        labels: ['Clients', 'Diet Plans', 'Workout Plans'],
        datasets: [
            {
                label: 'Count',
                data: [customerCount, dietCount, workoutCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Trainer Statistics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    const getDashboard = () => {
        setLoading(true);
        trainerDashboard({}).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setCustomerCount(res.data.totalCustomers);
                setDietCount(res.data.totalDiet);
                setWorkoutCount(res.data.totalWorkout);
            } else {
                setLoading(false);
                toast.error("Something went wrong");
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error("Something went wrong");
        });
    };

    return (
        <>
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h4 className="text-white display-4 mb-4">Trainer Dashboard</h4>
                    <ol className="breadcrumb d-flex justify-content-center mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active text-primary">Dashboard</li>
                    </ol>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={80} />
                </div>
            ) : (
                <div className="container-fluid py-4">
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-primary bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-users fa-2x text-primary"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-users me-2"></i>My Clients</p>
                                        <h3 className="mb-0 fw-bold">{customerCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-success bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-utensils fa-2x text-success"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-utensils me-2"></i>Diet Plans</p>
                                        <h3 className="mb-0 fw-bold">{dietCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-warning bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-dumbbell fa-2x text-warning"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-dumbbell me-2"></i>Workout Plans</p>
                                        <h3 className="mb-0 fw-bold">{workoutCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                            <div className="card shadow border-0 h-100">
                                <div className="card-header bg-white border-0">
                                    <h5 className="mb-0">Client Management</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <Link to="/trainer/customer/progress" className="btn btn-outline-primary w-100 py-3">
                                                <i className="fas fa-chart-line mb-2 d-block fs-4"></i>
                                                Track Progress
                                            </Link>
                                        </div>
                                        {/* <div className="col-6">
                                            <Link to="/trainer/diet/manage" className="btn btn-outline-success w-100 py-3">
                                                <i className="fas fa-utensils mb-2 d-block fs-4"></i>
                                                Manage Diets
                                            </Link>
                                        </div> */}
                                        {/* <div className="col-6">
                                            <Link to="/trainer/excercise/manage" className="btn btn-outline-warning w-100 py-3">
                                                <i className="fas fa-dumbbell mb-2 d-block fs-4"></i>
                                                Manage Exercises
                                            </Link>
                                        </div> */}
                                        <div className="col-6">
                                            <Link to="/trainer/batches" className="btn btn-outline-info w-100 py-3">
                                                <i className="fas fa-layer-group mb-2 d-block fs-4"></i>
                                                View Batches
                                            </Link>
                                        </div>
                                        {/* <div className="col-6">
                                            <Link to="/ai-coach" className="btn btn-outline-success w-100 py-3">
                                                <i className="fas fa-robot mb-2 d-block fs-4"></i>
                                                AI Coach
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card shadow border-0 h-100">
                                <div className="card-header bg-white border-0">
                                    <h5 className="mb-0">Account</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <Link to="/trainer/update/profile" className="btn btn-outline-secondary w-100 py-3">
                                                <i className="fas fa-user-edit mb-2 d-block fs-4"></i>
                                                Update Profile
                                            </Link>
                                        </div>
                                        {/* <div className="col-6">
                                            <Link to="/trainer/reports" className="btn btn-outline-dark w-100 py-3">
                                                <i className="fas fa-file-alt mb-2 d-block fs-4"></i>
                                                View Reports
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-12">
                            <div className="card shadow border-0 h-100">
                                <div className="card-header bg-white border-0">
                                    <h5 className="mb-0">Statistics Overview</h5>
                                </div>
                                <div className="card-body" style={{ minHeight: 250, maxHeight: 300 }}>
                                    <Bar data={data} options={options} height={220} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
