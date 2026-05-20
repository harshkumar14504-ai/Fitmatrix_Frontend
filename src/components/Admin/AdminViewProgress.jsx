import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { allProgress } from "../../services/progressService";
import { allCustomer } from "../../services/customerService";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function AdminViewProgress() {
    const [loading, setLoading] = useState(false);
    const [progressData, setProgressData] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [customersRes, progressRes] = await Promise.all([
                allCustomer({}),
                allProgress({})
            ]);
            if (customersRes.data.success) {
                setCustomers(customersRes.data.data);
            }
            if (progressRes.data.success) {
                setProgressData(progressRes.data.data);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const filteredProgress = selectedCustomer
        ? progressData.filter(p => {
            console.log(selectedCustomer);
            console.log(progressData);
            
            const pCustId = String(p.customerId?._id || p.customerId);
            return pCustId === selectedCustomer;
        })
        : progressData;

    return (
        <>
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h4 className="text-white display-4 mb-4">View Progress</h4>
                    <ol className="breadcrumb d-flex justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="/admin/dashboard">Home</a></li>
                        <li className="breadcrumb-item active text-primary">Progress</li>
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
                ) : filteredProgress.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered text-dark">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Weight (kg)</th>
                                    <th>Height (cm)</th>
                                    <th>Body Fat (%)</th>
                                    <th>BMI</th>
                                    <th>Trainer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProgress.map((progress, index) => (
                                    <tr key={progress._id}>
                                        <td>{index + 1}</td>
                                        <td>{progress.customerId?.name || "N/A"}</td>
                                        <td>{new Date(progress.createdAt).toLocaleDateString()}</td>
                                        <td>{progress.weight}</td>
                                        <td>{progress.height}</td>
                                        <td>{progress.bodyFat}</td>
                                        <td>{progress.bmi}</td>
                                        <td>{progress.trainerId?.name || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="fs-5 text-muted">No progress records found.</p>
                    </div>
                )}
            </div>
        </>
    );
}
