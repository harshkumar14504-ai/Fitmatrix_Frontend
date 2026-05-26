import { useEffect, useState } from "react"
import { BASE_URL } from "../../../endPoints"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { RingLoader } from "react-spinners"
import Swal from 'sweetalert2'
import { allBatch, deleteBatch } from "../../../services/batchService"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function ManageBatches() {
    const imageStyle = {
        height: "100px",
        width: "100px",
        borderRadius: "999px"
    }
    let baseUrl = BASE_URL
    let [color, setColor] = useState("#eb0c1b");
    let [loading, setLoading] = useState(false);
    const [Batch, setBatch] = useState([])
    useEffect(() => {
        getAllBatch()
    }, [])

    const getAllBatch = () => {
        setLoading(true)
        allBatch({}).then((res) => {
            if (res.data.success) {
                setLoading(false)
                setBatch(res.data.data)
            }
            else {
                setLoading(false)
                toast.error(res.data.message)
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
        })
    }

    const deleteBatchFun = (_id) => {
        setLoading(true)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBatch({ _id: _id }).then((res) => {
                    if (res.data.success) {
                        setLoading(false)
                        toast.success(res.data.message)
                        getAllBatch()
                    }
                    else {
                        setLoading(false)
                        toast.error(res.data.message)
                    }
                }).catch((err) => {
                    setLoading(false)
                    console.log(err);
                })
            }
            else {
                setLoading(false)
            }
        });
    }

    return (
        <>
           
            {/* Team start */}
            <RingLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={100}
            />

           <div className="container-fluid py-3">

    {/* Heading */}
    <div className="row my-2 align-items-center">
        <div className="col-md h4 fw-bold text-dark">
            Manage Batches
        </div>

        <div className="col-md text-end">
            <Link to="/admin/batch/add">
                <button
                    className="btn btn-sm rounded-pill px-4 py-2"
                    type="submit"
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        fontWeight: "600"
                    }}
                >
                    + Add New Batch
                </button>
            </Link>
        </div>
    </div>

    {/* Responsive Table */}
    <div
        className="table-responsive mt-4 mx-auto"
        style={{
            maxWidth: "1400px",
            padding: "0 10px"
        }}
    >

        <table
            className="table align-middle"
            style={{
                borderCollapse: "separate",
                borderSpacing: "0 12px",
                fontSize: "14.5px",
                width: "100%"
            }}
        >

            {/* Table Head */}
            <thead>
                <tr
                    style={{
                        background: "#1e293b",
                        color: "#f1f5f9",
                        fontSize: "13.5px"
                    }}
                >
                    <th style={{ padding: "14px 16px" }}>Sr.no</th>
                    <th style={{ padding: "14px 16px" }}>Batch Name</th>
                    <th style={{ padding: "14px 16px" }}>Start Date</th>
                    <th style={{ padding: "14px 16px" }}>End Date</th>
                    <th style={{ padding: "14px 16px" }}>Total Slots</th>
                    <th style={{ padding: "14px 16px" }}>Session Type</th>
                    <th style={{ padding: "14px 16px" }}>Fees</th>
                    <th style={{ padding: "14px 16px" }}>Trainer Allot</th>
                    <th style={{ padding: "14px 16px" }}>Status</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody>
                {
                    Batch.map((Batch, index) => (
                        <tr
                            key={Batch._id}
                            style={{
                                background: index % 2 === 0 ? "#ffffff" : "#f1f5f9",
                                borderRadius: "10px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                            }}
                        >

                            {/* Sr No */}
                            <td
                                style={{ padding: "14px 16px" }}
                                className="fw-semibold text-muted"
                            >
                                {index + 1}
                            </td>

                            {/* Batch Name */}
                            <td
                                style={{
                                    padding: "14px 16px",
                                    fontWeight: "600"
                                }}
                            >
                                {Batch.batchName}
                            </td>

                            {/* Start Date */}
                            <td style={{ padding: "14px 16px" }}>
                                {Batch.startDate.substr(0, 10)}
                            </td>

                            {/* End Date */}
                            <td style={{ padding: "14px 16px" }}>
                                {Batch.endDate.substr(0, 10)}
                            </td>

                            {/* Total Slots */}
                            <td style={{ padding: "14px 16px" }}>
                                {Batch.totalSlots}
                            </td>

                            {/* Session Type */}
                            <td style={{ padding: "14px 16px" }}>
                                {Batch.sessionType}
                            </td>

                            {/* Fees */}
                            <td style={{ padding: "14px 16px" }}>
                                ₹ {Batch.fees}
                            </td>

                            {/* Trainer */}
                            <td style={{ padding: "14px 16px" }}>
                                {Batch.trainerAllot.name}
                            </td>

                            {/* Status + Actions */}
                            <td style={{ padding: "16px 18px" }}>

                                <span
                                    className="badge rounded-pill me-2"
                                    style={{
                                        background:
                                            Batch.status === "Active"
                                                ? "#dcfce7"
                                                : "#fee2e2",
                                        color:
                                            Batch.status === "Active"
                                                ? "#166534"
                                                : "#991b1b",
                                        padding: "8px 12px",
                                        fontSize: "12px",
                                        fontWeight: "600"
                                    }}
                                >
                                    {Batch.status}
                                </span>

                                <Link
                                    to={`/admin/batch/update/${Batch._id}`}
                                    style={{
                                        color: "#2563eb",
                                        marginRight: "12px",
                                        fontSize: "17px",
                                        padding: "2px",
                                        borderRadius: "6px"
                                    }}
                                >
                                    <i className="bi bi-pencil"></i>
                                </Link>

                                <button
                                    className="border-0 bg-transparent"
                                    onClick={() => {
                                        deleteBatchFun(Batch._id)
                                    }}
                                    style={{
                                        color: "#ef4444",
                                        fontSize: "17px",
                                        padding: "8px",
                                        borderRadius: "6px"
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>

                            </td>

                        </tr>
                    ))
                }
            </tbody>

        </table>
    </div>
</div>

            {/* Team End */}
        </>
    )
}