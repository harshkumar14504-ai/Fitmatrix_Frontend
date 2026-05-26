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
        {/* TOP STATS */}
        <div className="row g-4 mb-4">
            {/* Clients */}
            <div className="col-md-4">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "22px",
                        overflow: "hidden",
                        transition: "0.4s",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#2979ff,#00c6ff)",
                                color: "white",
                                boxShadow:
                                    "0 12px 30px rgba(41,121,255,0.4)",
                            }}
                        >
                            <i className="fas fa-users fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                My Clients
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {customerCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diet */}
            <div className="col-md-4">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "22px",
                        overflow: "hidden",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#00c853,#69f0ae)",
                                color: "white",
                                boxShadow:
                                    "0 12px 30px rgba(0,200,83,0.4)",
                            }}
                        >
                            <i className="fas fa-utensils fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                Diet Plans
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {dietCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workout */}
            <div className="col-md-4">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                        borderRadius: "22px",
                        overflow: "hidden",
                    }}
                >
                    <div className="card-body d-flex align-items-center p-4">
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg,#ff9100,#ffca28)",
                                color: "white",
                                boxShadow:
                                    "0 12px 30px rgba(255,145,0,0.4)",
                            }}
                        >
                            <i className="fas fa-dumbbell fa-2x"></i>
                        </div>

                        <div className="ms-4">
                            <p
                                className="mb-1 text-secondary"
                                style={{ fontSize: "15px" }}
                            >
                                Workout Plans
                            </p>

                            <h2
                                className="fw-bold mb-0"
                                style={{ color: "#0b1c49" }}
                            >
                                {workoutCount}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ACTION SECTIONS */}
        <div className="row g-4 mb-4">
            {/* CLIENT MANAGEMENT */}
            <div className="col-lg-6">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{ borderRadius: "24px" }}
                >
                    <div
                        className="card-header border-0 text-white p-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#1a237e,#3949ab)",
                            borderTopLeftRadius: "24px",
                            borderTopRightRadius: "24px",
                        }}
                    >
                        <h4 className="mb-0 fw-bold">
                            Client Management
                        </h4>
                    </div>

                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-6">
                                <Link
                                    to="/trainer/customer/progress"
                                    className="btn border-0 w-100 py-4"
                                    style={{
                                        borderRadius: "20px",
                                        background: "#eef4ff",
                                        transition: "0.3s",
                                    }}
                                >
                                    <i className="fas fa-chart-line d-block fs-1 mb-3 text-primary"></i>

                                    <span className="fw-semibold text-dark">
                                        Track Progress
                                    </span>
                                </Link>
                            </div>

                            <div className="col-6">
                                <Link
                                    to="/trainer/batches"
                                    className="btn border-0 w-100 py-4"
                                    style={{
                                        borderRadius: "20px",
                                        background: "#eefcff",
                                    }}
                                >
                                    <i className="fas fa-layer-group d-block fs-1 mb-3 text-info"></i>

                                    <span className="fw-semibold text-dark">
                                        View Batches
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ACCOUNT */}
            <div className="col-lg-6">
                <div
                    className="card border-0 shadow-lg h-100"
                    style={{ borderRadius: "24px" }}
                >
                    <div
                        className="card-header border-0 text-white p-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#6a11cb,#2575fc)",
                            borderTopLeftRadius: "24px",
                            borderTopRightRadius: "24px",
                        }}
                    >
                        <h4 className="mb-0 fw-bold">Account</h4>
                    </div>

                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-12">
                                <Link
                                    to="/trainer/update/profile"
                                    className="btn border-0 w-100 py-5"
                                    style={{
                                        borderRadius: "20px",
                                        background:
                                            "linear-gradient(135deg,#f5f7fa,#e4ecff)",
                                        transition: "0.3s",
                                    }}
                                >
                                    <i className="fas fa-user-edit d-block fs-1 mb-3 text-secondary"></i>

                                    <span
                                        className="fw-bold text-dark"
                                        style={{ fontSize: "18px" }}
                                    >
                                        Update Profile
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* CHART SECTION */}
        <div className="row">
            <div className="col-12">
                <div
                    className="card border-0 shadow-lg"
                    style={{ borderRadius: "24px" }}
                >
                    <div
                        className="card-header border-0 text-white p-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#141e30,#243b55)",
                            borderTopLeftRadius: "24px",
                            borderTopRightRadius: "24px",
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
                                height={240}
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
