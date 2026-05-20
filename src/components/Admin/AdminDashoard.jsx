import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminDashboard } from "../../services/userService";
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

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [trainersCount, setTrainersCount] = useState(0);
    const [batchesCount, setBatchesCount] = useState(0);
    const [customersCount, setCustomersCount] = useState(0);
    const [membershipsCount, setMembershipsCount] = useState(0);

    useEffect(() => {
        getDashboard();
    }, []);

    const data = {
        labels: ['Customers', 'Memberships', 'Trainers', 'Batches'],
        datasets: [
            {
                label: 'Count',
                data: [customersCount, membershipsCount, trainersCount, batchesCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
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
                text: 'Gym Statistics',
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
        adminDashboard({}).then((res) => {
            if (res.data.success) {
                setLoading(false);
                setTrainersCount(res.data.totalTrainers);
                setBatchesCount(res.data.totalBatches);
                setCustomersCount(res.data.totalCustomers);
                setMembershipsCount(res.data.totalMemberships);
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
                    <h4 className="text-white display-4 mb-4">Admin Dashboard</h4>
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
                        <div className="col-md-6 col-xl-3">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-primary bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-users fa-2x text-primary"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-users me-2"></i>Total Customers</p>
                                        <h3 className="mb-0 fw-bold">{customersCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-success bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-id-card fa-2x text-success"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-id-card me-2"></i>Active Memberships</p>
                                        <h3 className="mb-0 fw-bold">{membershipsCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-warning bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-chalkboard-teacher fa-2x text-warning"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-chalkboard-teacher me-2"></i>Total Trainers</p>
                                        <h3 className="mb-0 fw-bold">{trainersCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card shadow border-0 h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="flex-shrink-0 bg-info bg-opacity-10 p-3 rounded">
                                        <i className="fas fa-layer-group fa-2x text-info"></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <p className="text-muted mb-0"><i className="fas fa-layer-group me-2"></i>Total Batches</p>
                                        <h3 className="mb-0 fw-bold">{batchesCount}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                            <div className="card shadow border-0 h-100">
                                <div className="card-header bg-white border-0">
                                    <h5 className="mb-0">Quick Actions</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <Link to="/admin/customers" className="btn btn-outline-primary w-100 py-3">
                                                <i className="fas fa-users mb-2 d-block fs-4"></i>
                                                Manage Customers
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to="/admin/trainer/manage" className="btn btn-outline-warning w-100 py-3">
                                                <i className="fas fa-chalkboard-teacher mb-2 d-block fs-4"></i>
                                                Manage Trainers
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to="/admin/batch/manage" className="btn btn-outline-info w-100 py-3">
                                                <i className="fas fa-layer-group mb-2 d-block fs-4"></i>
                                                Manage Batches
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to="/admin/requests/manage" className="btn btn-outline-success w-100 py-3">
                                                <i className="fas fa-clipboard-list mb-2 d-block fs-4"></i>
                                                View Requests
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to="/admin/diets" className="btn btn-outline-danger w-100 py-3">
                                                <i className="fas fa-utensils mb-2 d-block fs-4"></i>
                                                View Diets
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to="/admin/exercises" className="btn btn-outline-dark w-100 py-3">
                                                <i className="fas fa-dumbbell mb-2 d-block fs-4"></i>
                                                View Exercises
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link to="/admin/ai-coach" className="btn btn-outline-info w-100 py-3">
                                                <i className="fas fa-robot mb-2 d-block fs-4"></i>
                                                AI Coach
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card shadow border-0 h-100">
                                <div className="card-header bg-white border-0">
                                    <h5 className="mb-0">View & Reports</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <Link to="/admin/progress" className="btn btn-outline-secondary w-100 py-3">
                                                <i className="fas fa-chart-line mb-2 d-block fs-4"></i>
                                                View Progress
                                            </Link>
                                        </div>
                                        {/* <div className="col-6">
                                            <Link to="/admin/reports" className="btn btn-outline-primary w-100 py-3">
                                                <i className="fas fa-file-alt mb-2 d-block fs-4"></i>
                                                Generate Reports
                                            </Link>
                                        </div> */}
                                        {/* <div className="col-6">
                                            <Link to="/admin/membership/manage" className="btn btn-outline-success w-100 py-3">
                                                <i className="fas fa-crown mb-2 d-block fs-4"></i>
                                                Memberships
                                            </Link>
                                        </div> */}
                                        <div className="col-6">
                                            <Link to="/admin/contact/manage" className="btn btn-outline-warning w-100 py-3">
                                                <i className="fas fa-envelope mb-2 d-block fs-4"></i>
                                                Contact Messages
                                            </Link>
                                        </div>
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
