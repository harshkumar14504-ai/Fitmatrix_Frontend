import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { changePassword } from "../../services/userService";


export default function ChangeCustomerPswd() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const nav = useNavigate()

    const submit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("_id")
        if (!userId) {
            return toast.error("User not logged in");
        }
        try {
            const payload = {
                _id: userId,
                currentPassword: oldPassword,
                newPassword,
                confirmPassword
            };

            const result = await changePassword(payload);
            if (result?.data?.success) {
                toast.success(result.data.message || "Password changed successfully");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(result?.data?.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.message || "Server error. Please try again"
            );
        }
    };
    return (
        <>
           
            {/* Service Start */}
          <div
    className="col-lg-6 offset-lg-3 wow fadeInRight my-4"
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
        <h1
            className="display-5 text-white mb-5 text-center"
            style={{
                fontWeight: "700",
                letterSpacing: "1px",
            }}
        >
            Change Password
        </h1>

        <form onSubmit={submit}>
            <div className="row g-4">

                {/* Old Password */}
                <div className="col-12">
                    <div className="form-floating position-relative">
                        <input
                            type={showOld ? "text" : "password"}
                            className="form-control border-0"
                            id="oldPassword"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                                paddingRight: "60px",
                            }}
                        />

                        <label htmlFor="oldPassword">
                            Old Password
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowOld(!showOld)}
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                fontSize: "20px",
                                cursor: "pointer",
                                zIndex: "10",
                            }}
                        >
                            👁
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="col-12">
                    <div className="form-floating position-relative">
                        <input
                            type={showNew ? "text" : "password"}
                            className="form-control border-0"
                            id="newPassword"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                                paddingRight: "60px",
                            }}
                        />

                        <label htmlFor="newPassword">
                            New Password
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                fontSize: "20px",
                                cursor: "pointer",
                                zIndex: "10",
                            }}
                        >
                            👁
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="col-12">
                    <div className="form-floating position-relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            className="form-control border-0"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            style={{
                                height: "65px",
                                borderRadius: "12px",
                                background: "#f4f4f4",
                                fontSize: "17px",
                                paddingRight: "60px",
                            }}
                        />

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "transparent",
                                fontSize: "20px",
                                cursor: "pointer",
                                zIndex: "10",
                            }}
                        >
                            👁
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-12 mt-4">
                    <button
                        className="w-100 border-0"
                        type="submit"
                        style={{
                            background: "#e6004c",
                            color: "#fff",
                            height: "60px",
                            borderRadius: "12px",
                            fontSize: "20px",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            transition: "0.3s",
                            boxShadow:
                                "0 5px 20px rgba(230,0,76,0.4)",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform =
                                "translateY(-3px)";
                            e.target.style.background =
                                "#ff0055";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform =
                                "translateY(0px)";
                            e.target.style.background =
                                "#e6004c";
                        }}
                    >
                        Change Password
                    </button>
                </div>

            </div>
        </form>
    </div>
</div>


        </>
    )
}
