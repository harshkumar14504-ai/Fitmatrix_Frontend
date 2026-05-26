import { useEffect, useState } from "react"
import { BASE_URL } from "../../../endPoints"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { RingLoader } from "react-spinners"
import Swal from 'sweetalert2'
import { allCustomer, deleteCustomer } from "../../../services/customerService"
import ReactModal from "react-modal";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        width: "50%",
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        zIndex: 9999
    }
};

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function ManageCustomer() {
    const [clientName, setClientName] = useState('')
    const [email, setEmail] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [bodyFat, setBodyFat] = useState('')
    const [bmi, setBmi] = useState('')
    const [date, setDate] = useState('')

    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    const imageStyle = {
        height: "100px",
        width: "100px",
        borderRadius: "999px"
    }
    let baseUrl = BASE_URL
    let [color, setColor] = useState("#eb0c1b");
    let [loading, setLoading] = useState(false);
    const [Customers, setCustomers] = useState([])
    useEffect(() => {
        getAllCustomers()
    }, [])

    const getAllCustomers = () => {
        setLoading(true)
        allCustomer({}).then((res) => {
            if (res.data.success) {
                setLoading(false)
                setCustomers(res.data.data)
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

    const deleteCustomerFun = (_id) => {
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
                deleteCustomer({ _id: _id }).then((res) => {
                    if (res.data.success) {
                        setLoading(false)
                        toast.success(res.data.message)
                        getAllCustomers()
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
    };

    const submit = (e) => {
        e.preventDefault()

        let formData = {
            clientName,
            bodyFat,
            bmi,
            email,
            date,
            height,
            weight,

        }

        addProgress(formData)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message)
                    nav("/trainer/customer/progress")
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error("Something went wrong")
            })
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
    <div className="row my-2">
        <div className="col-md h4 fw-bold text-dark">
            Customers
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
                    <th style={{ padding: "14px 16px" }}>Contact</th>
                    <th style={{ padding: "14px 16px" }}>Gender</th>
                    <th style={{ padding: "14px 16px" }}>Address</th>
                    <th style={{ padding: "14px 16px" }}>Goal</th>
                    <th style={{ padding: "14px 16px" }}>Age</th>
                    <th style={{ padding: "14px 16px" }}>Image</th>
                    <th style={{ padding: "14px 16px" }}>Status</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody>
                {
                    Customers.map((Customer, index) => (
                        <tr
                            key={Customer._id}
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
                                {Customer.name}
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
                                {Customer.email}
                            </td>

                            {/* Phone */}
                            <td style={{ padding: "14px 16px" }}>
                                {Customer.phone}
                            </td>

                            {/* Gender */}
                            <td style={{ padding: "14px 16px" }}>
                                {Customer.gender}
                            </td>

                            {/* Address */}
                            <td
                                style={{
                                    padding: "14px 16px",
                                    maxWidth: "220px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {Customer.address}
                            </td>

                            {/* Goal */}
                            <td style={{ padding: "14px 16px" }}>
                                {Customer.goal}
                            </td>

                            {/* Age */}
                            <td style={{ padding: "14px 16px" }}>
                                {Customer.age}
                            </td>

                            {/* Image */}
                            <td style={{ padding: "14px 16px" }}>
                                <a
                                    href={Customer.image}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={Customer.image}
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

                            {/* Status + Delete */}
                            <td style={{ padding: "14px 16px" }}>

                                <div className="">

                                    {/* Delete Button */}
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => {
                                            deleteCustomerFun(Customer._id)
                                        }}
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            color: "#ef4444",
                                            fontSize: "17px"
                                        }}
                                    >
                                        <i className="bi bi-trash-fill"></i>
                                    </button>

                                </div>

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