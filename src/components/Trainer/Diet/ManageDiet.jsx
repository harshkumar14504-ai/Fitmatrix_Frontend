import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import ReactModal from "react-modal";
import { allBatchRequestsTrainer } from "../../../services/batchRegistrationService";
import { addDiet, singleDiet, updateDiet, allDiet } from "../../../services/dietService";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: "50%",
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

export default function ManageDiet() {
    const [dietType, setDietType] = useState('');
    const [restrictions, setRestrictions] = useState('');
    const [caloriesIntake, SetCaloriesIntake] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [batchRegistrationId, setBatchRegistrationId] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState('');

    const [modalIsOpen, setIsOpen] = useState(false);
    const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    const [currentDiet, setCurrentDiet] = useState(null);
    const [editDietId, setEditDietId] = useState('');

    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [diets, setDiets] = useState([]);

    const trainerId = localStorage.getItem("trainerId") || localStorage.getItem("_id");
    const [searchParams] = useSearchParams();
    const batchIdParam = searchParams.get("batchId");

    useEffect(() => {
        if (trainerId) {
            fetchInitialData();
        } else {
            toast.error("Trainer session not found");
        }
    }, [trainerId, batchIdParam]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([getAllCustomers(), getAllDiets()]);
        } finally {
            setLoading(false);
        }
    };

    const getAllCustomers = () => {
        return allBatchRequestsTrainer({ trainerId }).then((res) => {
            if (res.data.success) {
                let filtered = res.data.data;
                if (batchIdParam) {
                    filtered = filtered.filter(req => req.batchId?._id === batchIdParam);
                }
                setCustomers(filtered);
            }
        });
    };

    const getAllDiets = () => {
        return allDiet({ trainerId }) // 🔥 send trainerId
            .then((res) => {
                if (res.data.success) {
                    const myDiets = res.data.data.filter(d => {
                        const dTrainerId = d.trainerId?._id || d.trainerId;
                        return dTrainerId === trainerId;
                    });
                    setDiets(myDiets);
                }
            });
    };

    const openModal = (batchReqId, custId) => {
        setDietType('');
        setRestrictions('');
        SetCaloriesIntake('');
        setBatchRegistrationId(batchReqId);
        setCustomerId(custId);
        setIsOpen(true);
    };

    const submitAdd = (e) => {
        e.preventDefault();

        addDiet({
            dietType,
            restrictions,
            caloriesIntake,
            trainerId,
            customerId,
            batchRegistrationId
        }).then((res) => {
            if (res.data.success) {
                toast.success("Diet assigned successfully");
                setIsOpen(false);
                getAllDiets();
            }
        });
    };

    const handleView = (batchReqId, custId) => {
        setLoading(true);
        singleDiet({ customerId: custId, batchRegistrationId: batchReqId })
            .then(res => {
                if (res.data.success) {
                    setCurrentDiet(res.data.data);
                    setViewModalIsOpen(true);
                }
            })
            .finally(() => setLoading(false));
    };

    const handleEdit = (batchReqId, custId) => {
        setLoading(true);
        singleDiet({ customerId: custId, batchRegistrationId: batchReqId })
            .then(res => {
                if (res.data.success) {
                    const d = res.data.data;
                    setEditDietId(d._id);
                    setDietType(d.dietType);
                    setRestrictions(d.restrictions);
                    SetCaloriesIntake(d.caloriesIntake);
                    setEditModalIsOpen(true);
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
            caloriesIntake
        }).then((res) => {
            if (res.data.success) {
                toast.success("Diet updated");
                setEditModalIsOpen(false);
                getAllDiets();
            }
        });
    };

    return (
        <div className="manage-diet-page">

            <div className="container-fluid bg-breadcrumb">
                <div className="container text-center py-5">
                    <h4 className="text-white display-4">Diet Management</h4>
                </div>
            </div>

            <div className="container-fluid mt-4">

                <RingLoader color="#eb0c1b" loading={loading} cssOverride={override} size={80} />

                {/* ✅ Customer Filter */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">All Customers</option>
                            {customers.map(c => (
                                <option key={c.memberId?._id} value={c.memberId?._id}>
                                    {c.memberId?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Member</th>
                                <th>Batch</th>
                                <th>Diet</th>
                                <th>Calories</th>
                                <th>Goal</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers
                                .filter(c => !selectedCustomer || c.memberId?._id === selectedCustomer)
                                .map((batchReq, index) => {

                                    const customerDiet = diets.find(d => {
                                        const dCustId = d.customerId?._id || d.customerId;
                                        const dBatchId = d.batchRegistrationId?._id || d.batchRegistrationId;

                                        return dCustId === batchReq.memberId?._id &&
                                            dBatchId === batchReq._id;
                                    });

                                    return (
                                        <tr key={batchReq._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="fw-bold">{batchReq.memberId?.name}</div>
                                                <small>{batchReq.memberId?.email}</small>
                                            </td>
                                            <td>{batchReq.batchId?.batchName}</td>

                                            <td>
                                                {customerDiet
                                                    ? <span className="badge bg-success">{customerDiet.dietType}</span>
                                                    : <span className="badge bg-light text-dark">No Diet</span>
                                                }
                                            </td>

                                            <td>{customerDiet ? `${customerDiet.caloriesIntake} kcal` : "—"}</td>
                                            <td>{batchReq.memberId?.goal}</td>

                                            <td>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    {!customerDiet ? (
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => openModal(batchReq._id, batchReq.memberId?._id)}
                                                        >
                                                            Assign Diet
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-info btn-sm text-white"
                                                                onClick={() => handleView(batchReq._id, batchReq.memberId?._id)}
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => handleEdit(batchReq._id, batchReq.memberId?._id)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}