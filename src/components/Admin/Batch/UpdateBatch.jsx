import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { singleBatch, updateBatch } from "../../../services/batchService"
import { allTrainers } from "../../../services/trainerService"

export default function UpdateBatch() {

    const params = useParams()
    const _id = params._id
    const [batchName, setBatchName] = useState('')
    const [time, setTime] = useState('')
    const [trainerAllot, setTrainerAllot] = useState('')
    const [fees, setFees] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [totalSlot, setTotalSlot] = useState('')
    const [availableSlot, setAvailableSlot] = useState('')
    const [sessionType, setSessionType] = useState('')
    const [trainers, setTrainers] = useState([])
    const nav = useNavigate()


    useEffect(() => {
        getSingleBatch()
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


    const getSingleBatch = () => {
        singleBatch({ _id: _id }).then((res) => {
            if (res.data.success) {
                console.log(res.data);
                setBatchName(res.data.data.batchName)
                setTime(res.data.data.time)
                setTrainerAllot(res.data.data.trainerAllot?._id)
                setFees(res.data.data.fees)
                setStartDate(res.data.data.startDate.slice(0, 10))
                setEndDate(res.data.data.endDate.slice(0, 10))

                setTotalSlot(res.data.data.totalSlots)
                setSessionType(res.data.data.sessionType)
            }
            else {
                toast.error(res.data.message)
            }

        }).catch((err) => {
            console.log(err);
            toast.error(err)
        })

    }
    const submit = (e) => {
        e.preventDefault()
        console.log("form submitted");
        let formData = {
            _id: _id,
            batchName: batchName,
            startDate: startDate,
            endDate: endDate,
            time: time,
            totalSlot: totalSlot,
            fees: fees,
            trainerAllot: trainerAllot,
            sessionType: sessionType
        }
        console.log(_id)

        updateBatch(formData).then((res) => {
            if (res.data.success) {

                toast.success(res.data.message)
                nav("/admin/batch/manage")

            }
            else {
                toast.error(res.data.message)
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err)
        })

    }
    return (
        <>
            {/* Header */}
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5 text-center">
                    <h1 className="display-3 text-white fw-bold">Update Batch</h1>
                </div>
            </div>

            <div
                className="col-lg-8 offset-lg-2 wow fadeInRight my-4"
                data-wow-delay="0.4s"
            >
                <div
                    className="form-section p-5 h-100"
                    style={{
                        background: "#07154A",
                        borderRadius: "24px",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                    }}
                >
                    <h2 className="display-6 text-white mb-5 text-center fw-bold">
                        Update Batch
                    </h2>

                    <form onSubmit={submit}>
                        <div className="row g-4">

                            {/* Batch Name */}
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <input
                                        type="text"
                                        className="form-control border-0"
                                        placeholder="Batch Name"
                                        value={batchName}
                                        onChange={(e) => setBatchName(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">Batch Name</label>
                                </div>
                            </div>

                            {/* Trainer Name */}
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <input
                                        type="date"
                                        className="form-control border-0"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">Start Date</label>
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <input
                                        type="date"
                                        className="form-control border-0"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">End Date</label>
                                </div>
                            </div>

                            {/* Timings */}
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <input
                                        type="text"
                                        className="form-control border-0"
                                        placeholder="Time (e.g. 7AM-8AM)"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">Timings</label>
                                </div>
                            </div>

                            {/* Total Slots */}
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <input
                                        readOnly
                                        type="text"
                                        className="form-control border-0"
                                        placeholder="Total Slots"
                                        value={totalSlot}
                                        onChange={(e) => setTotalSlot(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">Total Slots</label>
                                </div>
                            </div>

                            {/* Session Type */}
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <select
                                        className="form-control border-0"
                                        value={sessionType}
                                        onChange={(e) => setSessionType(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    >
                                        <option value="">Select Session</option>
                                        <option value="Morning">Morning</option>
                                        <option value="Evening">Evening</option>
                                    </select>
                                    <label htmlFor="name">Select Session</label>
                                </div>
                            </div>

                            {/* Fees */}
                            <div className="col-md-6">
                                <div className="form-floating form-section-col">
                                    <input
                                        type="number"
                                        className="form-control border-0"
                                        placeholder="Fees"
                                        value={fees}
                                        onChange={(e) => setFees(e.target.value)}
                                        style={{
                                            height: "58px",
                                            borderRadius: "10px",
                                            background: "#f4f4f4",
                                            fontSize: "16px",
                                        }}
                                    />
                                    <label htmlFor="name">Fees</label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="col-12 mt-3">
                                <div className="form-section-col">
                                    <button
                                        className="btn btn-primary w-100 py-3 fw-semibold"
                                        type="submit"
                                        style={{
                                            borderRadius: "12px",
                                            fontSize: "17px",
                                        }}
                                    >
                                        Update Batch
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
