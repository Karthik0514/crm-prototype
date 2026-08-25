import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {

    const navigate = useNavigate();

    const storedUser =
        JSON.parse(localStorage.getItem("user")) || {};

    const [name, setName] =
        useState(storedUser.name || "");

    const [email] =
        useState(storedUser.email || "");

    const [phone, setPhone] =
        useState(storedUser.phone || "");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const handleProfileUpdate = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await api.put(
                "/auth/profile",
                {
                    name,
                    phone
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage(
                "Profile updated successfully!"
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setLoading(false);

        }

    };


    const handlePasswordChange = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");


        if (newPassword !== confirmPassword) {

            setError(
                "New passwords do not match"
            );

            return;

        }


        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");


            await api.put(
                "/auth/change-password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setMessage(
                "Password changed successfully!"
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setLoading(false);

        }

    };


    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };


    return (

        <div className="max-w-5xl mx-auto space-y-6">

            {/* HEADER */}

            <div>

                <h1 className="text-3xl font-bold">

                    Profile Settings

                </h1>

                <p className="text-gray-500 mt-1">

                    Manage your account and security settings

                </p>

            </div>


            {/* MESSAGE */}

            {message && (

                <div className="
                    bg-green-50
                    border
                    border-green-200
                    text-green-700
                    rounded-xl
                    p-4
                ">

                    {message}

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="
                    bg-red-50
                    border
                    border-red-200
                    text-red-700
                    rounded-xl
                    p-4
                ">

                    {error}

                </div>

            )}


            {/* ACCOUNT DETAILS */}

            <div className="
                bg-white
                border
                rounded-2xl
                p-6
                shadow-sm
            ">

                <h2 className="text-xl font-bold mb-6">

                    Account Information

                </h2>


                <form
                    onSubmit={handleProfileUpdate}
                    className="space-y-5"
                >

                    <div>

                        <label className="
                            block
                            mb-2
                            font-medium
                        ">

                            Name

                        </label>

                        <input

                            type="text"

                            value={name}

                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-medium
                        ">

                            Email

                        </label>

                        <input

                            type="email"

                            value={email}

                            disabled

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                bg-gray-100
                                text-gray-500
                                cursor-not-allowed
                            "

                        />

                        <p className="
                            text-sm
                            text-gray-500
                            mt-2
                        ">

                            Email cannot currently be changed.

                        </p>

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-medium
                        ">

                            Phone Number

                        </label>

                        <input

                            type="tel"

                            value={phone}

                            onChange={(event) =>
                                setPhone(
                                    event.target.value
                                )
                            }

                            placeholder="
                                Enter phone number
                            "

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    <button

                        type="submit"

                        disabled={loading}

                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "

                    >

                        {loading

                            ? "Saving..."

                            : "Save Changes"

                        }

                    </button>

                </form>

            </div>


            {/* SECURITY */}

            <div className="
                bg-white
                border
                rounded-2xl
                p-6
                shadow-sm
            ">

                <h2 className="text-xl font-bold mb-2">

                    Security

                </h2>

                <p className="
                    text-gray-500
                    mb-6
                ">

                    Change your account password

                </p>


                <form
                    onSubmit={handlePasswordChange}
                    className="space-y-5"
                >

                    <div>

                        <label className="
                            block
                            mb-2
                            font-medium
                        ">

                            Current Password

                        </label>

                        <input

                            type="password"

                            value={currentPassword}

                            onChange={(event) =>
                                setCurrentPassword(
                                    event.target.value
                                )
                            }

                            required

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-medium
                        ">

                            New Password

                        </label>

                        <input

                            type="password"

                            value={newPassword}

                            onChange={(event) =>
                                setNewPassword(
                                    event.target.value
                                )
                            }

                            required

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    <div>

                        <label className="
                            block
                            mb-2
                            font-medium
                        ">

                            Confirm New Password

                        </label>

                        <input

                            type="password"

                            value={confirmPassword}

                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }

                            required

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:border-blue-500
                            "

                        />

                    </div>


                    <button

                        type="submit"

                        disabled={loading}

                        className="
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "

                    >

                        {loading

                            ? "Updating..."

                            : "Change Password"

                        }

                    </button>

                </form>

            </div>


            {/* LOGOUT */}

            <div className="
                bg-white
                border
                rounded-2xl
                p-6
                shadow-sm
                flex
                justify-between
                items-center
            ">

                <div>

                    <h2 className="text-xl font-bold">

                        Logout

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Sign out from this CRM account.

                    </p>

                </div>


                <button

                    onClick={handleLogout}

                    className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-6
                        py-3
                        rounded-xl
                    "

                >

                    Logout

                </button>

            </div>

        </div>

    );

}