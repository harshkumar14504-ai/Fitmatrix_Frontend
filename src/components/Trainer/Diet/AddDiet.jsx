import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { addDiet } from "../../../services/dietService"
import { allBatchRequestsTrainer } from "../../../services/batchRegistrationService"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const defaultMeals = ["Breakfast", "Mid-Morning", "Lunch", "Evening Snack", "Dinner"]

export default function AddDiet() {
    const [dietType, setDietType] = useState('')
    const [restrictions, setRestrictions] = useState('')
    const [caloriesIntake, setCaloriesIntake] = useState('')
    const [batchRegistrationId, setBatchRegistrationId] = useState('')
    const [myCustomers, setMyCustomers] = useState([])
    const [weeklyDietChart, setWeeklyDietChart] = useState(
        days.map(day => ({
            day,
            meals: defaultMeals.map(meal => ({
                mealName: meal,
                items: "",
                time: "",
                calories: ""
            }))
        }))
    )
    const nav = useNavigate()
    const { batchRegId, customerId } = useParams()
    const trainerId = localStorage.getItem("trainerId")

    useEffect(() => {
        if (trainerId) {
            allBatchRequestsTrainer({ trainerId })
                .then(res => {
                    if (res.data.success) {
                        setMyCustomers(res.data.data)
                        if (batchRegId) setBatchRegistrationId(batchRegId)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [trainerId, batchRegId])

    const handleMealChange = (dayIndex, mealIndex, field, value) => {
        const updated = [...weeklyDietChart]
        updated[dayIndex].meals[mealIndex][field] = value
        setWeeklyDietChart(updated)
    }

    const addMeal = (dayIndex) => {
        const updated = [...weeklyDietChart]
        updated[dayIndex].meals.push({ mealName: "", items: "", time: "", calories: "" })
        setWeeklyDietChart(updated)
    }

    const removeMeal = (dayIndex, mealIndex) => {
        const updated = [...weeklyDietChart]
        updated[dayIndex].meals.splice(mealIndex, 1)
        setWeeklyDietChart(updated)
    }

    const submit = (e) => {
        e.preventDefault()

        if (!batchRegistrationId) {
            toast.error("Please select a customer batch.")
            return
        }

        const formData = {
            dietType,
            restrictions,
            caloriesIntake,
            trainerId,
            batchRegistrationId,
            customerId: customerId || myCustomers.find(r => r._id === batchRegistrationId)?.memberId?._id,
            weeklyDietChart
        }

        addDiet(formData)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message)
                    nav("/trainer/diet/manage")
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
            <div className="container-fluid bg-primary py-5 mb-5 page-header">
                <div className="container py-5 text-center">
                    <h1 className="display-3 text-white">Add Weekly Diet Chart</h1>
                </div>
            </div>

            <div className="container">
                <div className="col-lg-8 offset-lg-2">
                    <div className="form-section bg-dark p-5">
                        <h2 className="text-white text-center mb-4">Create Diet Chart</h2>

                        <form onSubmit={submit}>
                            <div className="row g-4 mb-4">
                                <div className="col-12">
                                    <div className="form-floating form-section-col">
                                        <select
                                            className="form-select"
                                            value={batchRegistrationId}
                                            onChange={(e) => setBatchRegistrationId(e.target.value)}
                                        >
                                            <option value="">Select Customer</option>
                                            {myCustomers.map((req) => (
                                                <option key={req._id} value={req._id}>
                                                    {req.memberId?.name} (Batch: {req.batchId?.batchName})
                                                </option>
                                            ))}
                                        </select>
                                        <label>Customer / Batch</label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating form-section-col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Diet Type"
                                            value={dietType}
                                            onChange={(e) => setDietType(e.target.value)}
                                        />
                                        <label>Diet Type (e.g. Weight Gain)</label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating form-section-col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Restrictions"
                                            value={restrictions}
                                            onChange={(e) => setRestrictions(e.target.value)}
                                        />
                                        <label>Restrictions</label>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="form-floating form-section-col">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Calories Intake"
                                            value={caloriesIntake}
                                            onChange={(e) => setCaloriesIntake(e.target.value)}
                                        />
                                        <label>Daily Calories Target</label>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-white mb-3">Weekly Meal Plan</h4>

                            {weeklyDietChart.map((day, dayIndex) => (
                                <div key={day.day} className="card mb-4 bg-secondary text-white border-0">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">{day.day}</h5>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-light"
                                            onClick={() => addMeal(dayIndex)}
                                        >
                                            + Add Meal
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        {day.meals.map((meal, mealIndex) => (
                                            <div key={mealIndex} className="row g-3 mb-3 p-3 bg-dark rounded">
                                                <div className="col-md-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Meal Name"
                                                        value={meal.mealName}
                                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "mealName", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="What to eat (e.g. Oats, Eggs)"
                                                        value={meal.items}
                                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "items", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Time (e.g. 8:00 AM)"
                                                        value={meal.time}
                                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "time", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Calories"
                                                        value={meal.calories}
                                                        onChange={(e) => handleMealChange(dayIndex, mealIndex, "calories", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger w-100"
                                                        onClick={() => removeMeal(dayIndex, mealIndex)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="col-12 mt-4">
                                <button className="btn btn-primary w-100 py-3">
                                    Save Weekly Diet Chart
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
