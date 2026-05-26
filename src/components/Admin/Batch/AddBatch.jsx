import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { addBatch } from "../../../services/batchService"
import { allTrainers } from "../../../services/trainerService"

export default function AddBatch() {

    const [batchName, setBatchName] = useState('')
    const [time, setTime] = useState('')
    const [trainerAllot, setTrainerAllot] = useState('')
    const [fees, setFees] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalSlot, setTotalSlot] = useState('')
    const [sessionType, setSessionType] = useState('')
    const [trainers, setTrainers] = useState([])

    const nav = useNavigate()

    useEffect(() => {
        getAllTrainers()
    }, [])

    const getAllTrainers = () => {
        allTrainers({})
            .then((res) => {
                if (res.data.success) {
                    setTrainers(res.data.data)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error("Unable to load trainers")
            })
    }

    const submit = (e) => {
        e.preventDefault()

        let formData = {
            batchName: batchName,
            startDate: startDate,
            endDate: endDate,
            time: time,
            totalSlot: totalSlot,
            fees: fees,
            trainerAllot: trainerAllot,
            sessionType: sessionType
        }

        addBatch(formData)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message)
                    nav("/admin/batch/manage")
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
            {/* Header */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5 text-center">
                    <h1 className="display-3 text-white fw-bold">Add Batch</h1>
                </div>
            </div>

            <div
                className="offset-lg-2 col-lg-8 offset-lg-2 wow fadeInRight my-4"
                data-wow-delay="0.4s"
            >
                <div
                    className="form-section p-4 position-relative h-100"
                    style={{
                        background: "#07154A",
                        borderRadius: "22px",
                        boxShadow: "0 10px 38px rgba(0,0,0,0.5)",
                        overflow: "hidden",
                    }}
                >
                    <h1
                        className="text-white text-center mb-4"
                        style={{
                            fontWeight: "700",
                            fontSize: "40px",
                            letterSpacing: "1px",
                        }}
                    >
                        Add Batch
                    </h1>

                    <form onSubmit={submit}>
                        <div className="row g-3">

                            {/* Batch Name */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control border-0 px-3"
                                        id="batchName"
                                        placeholder="Batch Name"
                                        value={batchName}
                                        onChange={(e) => setBatchName(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <label htmlFor="batchName">Batch Name</label>
                                </div>
                            </div>

                            {/* Trainer */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select
                                        className="form-control border-0 px-3"
                                        id="trainer"
                                        value={trainerAllot}
                                        onChange={(e) => setTrainerAllot(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    >
                                        <option value="">Select Trainer</option>
                                        {trainers.map((trainer) => (
                                            <option value={trainer._id} key={trainer._id}>
                                                {trainer.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="trainer">Trainer Name</label>
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control border-0 px-3"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <label htmlFor="startDate">Start Date</label>
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control border-0 px-3"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <label htmlFor="endDate">End Date</label>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control border-0 px-3"
                                        id="time"
                                        placeholder="Time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <label htmlFor="time">Timings</label>
                                </div>
                            </div>

                            {/* Total Slots */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control border-0 px-3"
                                        id="slots"
                                        placeholder="Total Slots"
                                        value={totalSlot}
                                        onChange={(e) => setTotalSlot(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <label htmlFor="slots">Total Slots</label>
                                </div>
                            </div>

                            {/* Session Type */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <select
                                        className="form-control border-0 px-3"
                                        id="session"
                                        value={sessionType}
                                        onChange={(e) => setSessionType(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    >
                                        <option value="">Select Session</option>
                                        <option value="Morning">Morning</option>
                                        <option value="Evening">Evening</option>
                                    </select>
                                    <label htmlFor="session">Select Session</label>
                                </div>
                            </div>

                            {/* Fees */}
                            <div className="col-lg-6">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control border-0 px-3"
                                        id="fees"
                                        placeholder="Fees"
                                        value={fees}
                                        onChange={(e) => setFees(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "12px",
                                            background: "#f4f4f4",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <label htmlFor="fees">Fees</label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="col-12 mt-3">
                                <button
                                    className="w-100 border-0"
                                    type="submit"
                                    style={{
                                        background: "#e6004c",
                                        color: "#fff",
                                        height: "54px",
                                        borderRadius: "12px",
                                        fontSize: "17px",
                                        fontWeight: "600",
                                        letterSpacing: "1px",
                                        transition: "0.3s",
                                        boxShadow: "0 5px 18px rgba(230,0,76,0.4)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.background = "#ff0055";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "translateY(0px)";
                                        e.target.style.background = "#e6004c";
                                    }}
                                >
                                    ADD BATCH
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
