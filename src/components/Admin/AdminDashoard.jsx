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
          

            {loading ? (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <RingLoader
            color="#ff1744"
            loading={loading}
            cssOverride={override}
            size={90}
        />
    </div>
) : (
    <div
        className="container-fluid py-4"
        style={{
            background: "#f4f7fc",
            minHeight: "100vh",
        }}
    >
        {/* TOP CARDS */}
        <div className="row g-4 mb-4">
            {/* Customers */}
            <div className="col-md-6 col-xl-3">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "20px",
                        transition: "0.4s",
                        overflow: "hidden",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "75px",
                                height: "75px",
                                borderRadius: "18px",
                                background:
                                    "linear-gradient(135deg,#ff1744,#ff5252)",
                                color: "white",
                                boxShadow: "0 10px 25px rgba(255,23,68,0.4)",
                            }}
                        >
                            <i className="fas fa-users fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                Total Customers
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {customersCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Membership */}
            <div className="col-md-6 col-xl-3">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "20px",
                        transition: "0.4s",
                        overflow: "hidden",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "75px",
                                height: "75px",
                                borderRadius: "18px",
                                background:
                                    "linear-gradient(135deg,#00c853,#69f0ae)",
                                color: "white",
                                boxShadow: "0 10px 25px rgba(0,200,83,0.4)",
                            }}
                        >
                            <i className="fas fa-id-card fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                Active Memberships
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {membershipsCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trainers */}
            <div className="col-md-6 col-xl-3">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "20px",
                        transition: "0.4s",
                        overflow: "hidden",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "75px",
                                height: "75px",
                                borderRadius: "18px",
                                background:
                                    "linear-gradient(135deg,#ff9100,#ffd54f)",
                                color: "white",
                                boxShadow: "0 10px 25px rgba(255,145,0,0.4)",
                            }}
                        >
                            <i className="fas fa-chalkboard-teacher fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                Total Trainers
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {trainersCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Batches */}
            <div className="col-md-6 col-xl-3">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "20px",
                        transition: "0.4s",
                        overflow: "hidden",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "75px",
                                height: "75px",
                                borderRadius: "18px",
                                background:
                                    "linear-gradient(135deg,#00b0ff,#40c4ff)",
                                color: "white",
                                boxShadow: "0 10px 25px rgba(0,176,255,0.4)",
                            }}
                        >
                            <i className="fas fa-layer-group fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                Total Batches
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {batchesCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ACTIONS */}
        <div className="row g-4 mb-4">
            {/* QUICK ACTIONS */}
            <div className="col-lg-6">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{ borderRadius: "22px" }}
                >
                    <div
                        className="card-header border-0 text-white p-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#1a237e,#3949ab)",
                            borderTopLeftRadius: "22px",
                            borderTopRightRadius: "22px",
                        }}
                    >
                        <h4 className="mb-0 fw-bold">Quick Actions</h4>
                    </div>

                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-6">
                                <Link
                                    to="/admin/customers"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#fff5f6",
                                        transition: "0.3s",
                                    }}
                                >
                                    <i className="fas fa-users d-block fs-2 mb-3 text-danger"></i>
                                    <span className="fw-semibold text-dark">
                                        Manage Customers
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/admin/trainer/manage"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#fff9e8",
                                    }}
                                >
                                    <i className="fas fa-chalkboard-teacher d-block fs-2 mb-3 text-warning"></i>
                                    <span className="fw-semibold text-dark">
                                        Manage Trainers
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/admin/batch/manage"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#eefcff",
                                    }}
                                >
                                    <i className="fas fa-layer-group d-block fs-2 mb-3 text-info"></i>
                                    <span className="fw-semibold text-dark">
                                        Manage Batches
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/admin/requests/manage"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#f1fff6",
                                    }}
                                >
                                    <i className="fas fa-clipboard-list d-block fs-2 mb-3 text-success"></i>
                                    <span className="fw-semibold text-dark">
                                        View Requests
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/admin/diets"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#fff1f1",
                                    }}
                                >
                                    <i className="fas fa-utensils d-block fs-2 mb-3 text-danger"></i>
                                    <span className="fw-semibold text-dark">
                                        View Diets
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/admin/exercises"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#f4f5ff",
                                    }}
                                >
                                    <i className="fas fa-dumbbell d-block fs-2 mb-3 text-dark"></i>
                                    <span className="fw-semibold text-dark">
                                        View Exercises
                                    </span>
                                </Link>
                            </div>

                            <div className="col-12">
                                <Link
                                    to="/admin/ai-coach"
                                    className="btn w-100 py-4 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background:
                                            "linear-gradient(135deg,#00c6ff,#0072ff)",
                                        color: "white",
                                        boxShadow:
                                            "0 10px 30px rgba(0,114,255,0.3)",
                                    }}
                                >
                                    <i className="fas fa-robot d-block fs-1 mb-3"></i>

                                    <span
                                        className="fw-bold"
                                        style={{ fontSize: "18px" }}
                                    >
                                        AI Coach
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REPORTS */}
            <div className="col-lg-6">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{ borderRadius: "22px" }}
                >
                    <div
                        className="card-header border-0 text-white p-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#6a11cb,#2575fc)",
                            borderTopLeftRadius: "22px",
                            borderTopRightRadius: "22px",
                        }}
                    >
                        <h4 className="mb-0 fw-bold">View & Reports</h4>
                    </div>

                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-6">
                                <Link
                                    to="/admin/progress"
                                    className="btn w-100 py-5 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#f5f7ff",
                                    }}
                                >
                                    <i className="fas fa-chart-line d-block fs-1 mb-3 text-secondary"></i>

                                    <span className="fw-semibold text-dark">
                                        View Progress
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/admin/contact/manage"
                                    className="btn w-100 py-5 border-0"
                                    style={{
                                        borderRadius: "18px",
                                        background: "#fff9e8",
                                    }}
                                >
                                    <i className="fas fa-envelope d-block fs-1 mb-3 text-warning"></i>

                                    <span className="fw-semibold text-dark">
                                        Contact Messages
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* CHART */}
        <div className="row">
            <div className="col-12">
                <div
                    className="card border-0 shadow-lg"
                    style={{ borderRadius: "22px" }}
                >
                    <div
                        className="card-header border-0 text-white p-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#141e30,#243b55)",
                            borderTopLeftRadius: "22px",
                            borderTopRightRadius: "22px",
                        }}
                    >
                        <h4 className="mb-0 fw-bold">
                            Statistics Overview
                        </h4>
                    </div>

                    <div className="card-body p-4">
                        <div style={{ minHeight: 300 }}>
                            <Bar
                                data={data}
                                options={options}
                                height={250}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}
        </>
    );
}
