import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RingLoader } from "react-spinners";
import { allDiet } from "../../services/dietService";
import { allCustomer } from "../../services/customerService";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function AdminViewDiet() {
    const [loading, setLoading] = useState(false);
    const [diets, setDiets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [customersRes, dietsRes] = await Promise.all([
                allCustomer({}),
                allDiet({})
            ]);
            if (customersRes.data.success) {
                setCustomers(customersRes.data.data);
            }
            if (dietsRes.data.success) {
                setDiets(dietsRes.data.data);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const filteredDiets = selectedCustomer
        ?diets.filter(d => {
            console.log(selectedCustomer);
            console.log(diets);
            
        
            const dCustId = String(d.customerId?._id || d.customerId);
            return dCustId === selectedCustomer;
        })
        : diets;

    return (
        <>
            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5" style={{ maxWidth: 900 }}>
                    <h4 className="text-white display-4 mb-4">View Diet Plans</h4>
                    <ol className="breadcrumb d-flex justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="/admin/dashboard">Home</a></li>
                        <li className="breadcrumb-item active text-primary">Diet Plans</li>
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
                ) : filteredDiets.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered text-dark">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Diet Type</th>
                                    <th>Calories</th>
                                    <th>Restrictions</th>
                                    <th>Trainer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDiets.map((diet, index) => (
                                    <tr key={diet._id}>
                                        <td>{index + 1}</td>
                                        <td>{diet.customerId?.name || "N/A"}</td>
                                        <td>{diet.customerId?.email || "N/A"}</td>
                                        <td><span className="badge bg-primary">{diet.dietType}</span></td>
                                        <td>{diet.caloriesIntake} kcal</td>
                                        <td>{diet.restrictions || "None"}</td>
                                        <td>{diet.trainerId?.name || "N/A"}</td>
                                        <td>
                                            <span className={`badge ${diet.status ? "bg-success" : "bg-secondary"}`}>
                                                {diet.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <p className="fs-5 text-muted">No diet plans found.</p>
                    </div>
                )}
            </div>
        </>
    );
}
