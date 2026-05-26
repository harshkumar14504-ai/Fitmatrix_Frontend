import { useEffect, useState } from "react"
import { BASE_URL } from "../../../endPoints"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { allTrainers, deleteTrainer } from "../../../services/trainerService"
import { RingLoader } from "react-spinners"
import Swal from 'sweetalert2'

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function ManageTrainer() {
    const imageStyle = {
        height: "100px",
        width: "100px",
        borderRadius: "999px"
    }
    let baseUrl = BASE_URL
    let [color, setColor] = useState("#eb0c1b");
    let [loading, setLoading] = useState(false);
    const [Trainers, setTrainers] = useState([])
    useEffect(() => {
        getAllTrainers()
    }, [])

    const getAllTrainers = () => {
        setLoading(true)
        allTrainers({}).then((res) => {
            if (res.data.success) {
                setLoading(false)
                setTrainers(res.data.data)
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

    const deleteTrainerFun = (_id) => {
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
                deleteTrainer({ _id: _id }).then((res) => {
                    if (res.data.success) {
                        setLoading(false)
                        toast.success(res.data.message)
                        getAllTrainers()
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
            {/* Header Start */}
           
            {/* Header End */}
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
            Manage Trainers
        </div>

        <div className="col-md text-end">
            <Link to="/admin/trainer/add">
                <button
                    className="btn btn-sm rounded-pill px-4 py-2"
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        fontWeight: "600"
                    }}
                >
                    + Add New Trainer
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
                    <th style={{ padding: "14px 16px" }}>#</th>
                    <th style={{ padding: "14px 16px" }}>Name</th>
                    <th style={{ padding: "14px 16px" }}>Email</th>
                    <th style={{ padding: "14px 16px" }}>Experience</th>
                    <th style={{ padding: "14px 16px" }}>Contact</th>
                    <th style={{ padding: "14px 16px" }}>Image</th>
                    <th style={{ padding: "14px 16px" }}>Specialization</th>
                    <th style={{ padding: "14px 16px" }}>Status</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody>
                {
                    Trainers.map((Trainer, index) => (
                        <tr
                            key={Trainer._id}
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

                            {/* Name */}
                            <td
                                style={{
                                    padding: "14px 16px",
                                    fontWeight: "600"
                                }}
                            >
                                {Trainer.name}
                            </td>

                            {/* Email */}
                            <td
                                style={{
                                    padding: "14px 16px",
                                    maxWidth: "180px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {Trainer.email}
                            </td>

                            {/* Experience */}
                            <td style={{ padding: "14px 16px" }}>
                                {Trainer.experience}
                            </td>

                            {/* Contact */}
                            <td style={{ padding: "14px 16px" }}>
                                {Trainer.phone}
                            </td>

                            {/* Image */}
                            <td style={{ padding: "14px 16px" }}>
                                <a
                                    href={Trainer.image}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={Trainer.image}
                                        alt="unable to load"
                                        style={{
                                            width: "55px",
                                            height: "55px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #e2e8f0"
                                        }}
                                    />
                                </a>
                            </td>

                            {/* Specialization */}
                            <td style={{ padding: "14px 16px" }}>
                                {Trainer.speacilization}
                            </td>

                           {/* Status + Actions */}
              <td style={{ padding: "16px 18px" }} >

                <Link
                    to={`/admin/trainer/update/${Trainer._id}`}
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
                  onClick={() => {
                    deleteTrainerFun(Trainer._id)
                }}
                  style={{
                    color: "#ef4444",
                    border: "none",
                    background: "transparent",
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