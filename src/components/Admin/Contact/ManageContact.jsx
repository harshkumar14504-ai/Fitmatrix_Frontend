import { useEffect, useState } from "react"
import { BASE_URL } from "../../../endPoints"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { RingLoader } from "react-spinners"
import Swal from 'sweetalert2'
import Modal from 'react-modal';
import { allContacts, updateContact } from "../../../services/contactService";


export default function ManageContact() {
    const [reply, setReply] = useState('')
    const [id, setId] = useState('')

    const nav = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        console.log("Hit");
        let formData = {
            reply: reply,
            _id: id
        }
        updateContact(formData).then((res) => {
            if (res.data.success) {
                toast.success(res.data.message)
                closeModal()
                getAllContacts()

            }
            else {
                toast.error(res.data.message)
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err)
        })
    }

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const [modalIsOpen, setIsOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([])
    useEffect(() => {
        getAllContacts()
    }, [])

    function openModal(_id) {
        setId(_id)
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
          getAllContacts()
    }

    const getAllContacts = () => {
        setLoading(true)
        allContacts({}).then((res) => {
            if (res.data.success) {
                setLoading(false)
                setContacts(res.data.data)
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

    return (
        <>

            {/* Reply Modal */}
           <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={{
        overlay: {
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
        },
        content: {
            maxWidth: "700px",
            width: "90%",
            margin: "auto",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            border: "none",
            borderRadius: "24px",
            padding: "0",
            overflow: "hidden",
            background: "transparent",
        },
    }}
    contentLabel="Reply Modal"
>
    <div
        className="position-relative"
        style={{
            background: "#07154A", // same old dark blue
            borderRadius: "24px",
            padding: "50px 45px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.08)",
        }}
    >

        {/* Close Button */}
        <button
            onClick={closeModal}
            type="button"
            style={{
                position: "absolute",
                top: "18px",
                right: "20px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
                transition: "0.3s",
            }}
        >
            ✕
        </button>

        {/* Heading */}
        <div className="text-center mb-5">
            <h1
                style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: "48px",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                }}
            >
                Reply Customer Query
            </h1>

            <p
                style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "16px",
                    margin: 0,
                }}
            >
                Send response to customer professionally
            </p>
        </div>

        <form onSubmit={submit}>
            <div className="mb-4">

                <label
                    className="mb-2"
                    style={{
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "15px",
                    }}
                >
                    Enter Reply
                </label>

                <textarea
                    className="form-control"
                    rows="5"
                    value={reply}
                    placeholder="Type your reply here..."
                    onChange={(e) => setReply(e.target.value)}
                    style={{
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "#ffffff",
                        color: "#000",
                        padding: "18px",
                        fontSize: "16px",
                        resize: "none",
                        boxShadow: "none",
                    }}
                />
            </div>

            {/* Buttons */}
           <div className="d-grid mt-4">
    <button
        type="submit"
        style={{
            width: "100%",
            padding: "14px 30px",
            borderRadius: "12px",
            border: "none",
            background: "#ff0055",
            color: "#fff",
            fontWeight: "700",
            boxShadow: "0 8px 25px rgba(255,0,85,0.35)",
            transition: "0.3s",
            fontSize: "16px",
        }}
    >
        Submit Reply
    </button>
</div>
        </form>
    </div>
</Modal>
            {/* End Reply Modal */}


            {/* Header Start */}
           
            {/* Team start */}
            {/* <RingLoader
                color="#eb0c1b"
                loading={loading}
                cssOverride={override}
                size={100}
            /> */}

           <div className="container-fluid py-3">

    {/* Heading */}
    <div className="row my-2 align-items-center">
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
                    <th style={{ padding: "14px 16px" }}>Sr.no</th>
                    <th style={{ padding: "14px 16px" }}>Name</th>
                    <th style={{ padding: "14px 16px" }}>Contact</th>

                    <th
                        className="d-none d-md-table-cell"
                        style={{ padding: "14px 16px" }}
                    >
                        Email
                    </th>

                    <th
                        className="d-none d-lg-table-cell"
                        style={{ padding: "14px 16px" }}
                    >
                        Subject
                    </th>

                    <th
                        className="d-none d-lg-table-cell"
                        style={{ padding: "14px 16px" }}
                    >
                        Message
                    </th>

                    <th
                        className="d-none d-xl-table-cell"
                        style={{ padding: "14px 16px" }}
                    >
                        Reply
                    </th>

                    <th style={{ padding: "14px 16px" }}>Status</th>
                    <th style={{ padding: "14px 16px" }}>Action</th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody>
                {
                    contacts.map((c, index) => (
                        <tr
                            key={c._id || index}
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
                                {c.name}
                            </td>

                            {/* Contact */}
                            <td style={{ padding: "14px 16px" }}>
                                {c.phone}
                            </td>

                            {/* Email */}
                            <td
                                className="d-none d-md-table-cell"
                                style={{
                                    padding: "14px 16px",
                                    maxWidth: "180px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {c.email}
                            </td>

                            {/* Subject */}
                            <td
                                className="d-none d-lg-table-cell"
                                style={{
                                    padding: "14px 16px",
                                    fontWeight: "500"
                                }}
                            >
                                {c.subject}
                            </td>

                            {/* Message */}
                            <td
                                className="d-none d-lg-table-cell text-wrap"
                                style={{
                                    padding: "14px 16px",
                                    maxWidth: "220px",
                                    lineHeight: "1.5"
                                }}
                            >
                                {c.message}
                            </td>

                            {/* Reply */}
                            <td
                                className="d-none d-xl-table-cell text-wrap"
                                style={{
                                    padding: "14px 16px",
                                    maxWidth: "220px",
                                    lineHeight: "1.5"
                                }}
                            >
                                {c.reply || "-"}
                            </td>

                            {/* Status */}
                            <td style={{ padding: "14px 16px" }}>
                                <span
                                    style={{
                                        background:
                                            c.status === "Replied"
                                                ? "#dcfce7"
                                                : "#fef3c7",
                                        color:
                                            c.status === "Replied"
                                                ? "#166534"
                                                : "#92400e",
                                        padding: "6px 12px",
                                        borderRadius: "999px",
                                        fontSize: "12px",
                                        fontWeight: "600"
                                    }}
                                >
                                    {c.status}
                                </span>
                            </td>

                            {/* Action */}
                            <td style={{ padding: "14px 16px" }}>
                                <button
                                    className="btn btn-sm rounded-pill px-3 py-2"
                                    onClick={() => {
                                        openModal(c._id)
                                    }}
                                    style={{
                                        background: "#2563eb",
                                        color: "#fff",
                                        border: "none",
                                        fontWeight: "600"
                                    }}
                                >
                                    Reply
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