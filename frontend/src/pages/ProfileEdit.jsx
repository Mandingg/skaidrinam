import { useEffect, useState } from "react";
import { updateUser } from "../services/userService";
import cekioLogo from "../assets/LogoIcon.svg";

function ProfileEdit() {
    useEffect(() => {
        document.title = "Profilio redagavimas";
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        repeatPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const userId = localStorage.getItem("userId") || 2; //Redaguoja userId 2, bet po login'o turi perimti local storage

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setIsError(false);

        if (formData.password !== formData.repeatPassword) {
            setMessage("Slaptažodžiai nesutampa");
            setIsError(true);
            return;
        }

        try {
            const data = await updateUser(userId, {
                name: formData.name || null,
                surname: formData.surname || null,
                email: formData.email || null,
                password: formData.password || null,
            });

            setMessage(data.message);
            setIsError(false);

            setFormData({
                name: "",
                surname: "",
                email: "",
                password: "",
                repeatPassword: "",
            });
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <main className="w-full max-w-[450px] bg-white rounded-lg border border-gray-100 shadow-sm p-8 md:p-12">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={cekioLogo}
                            alt="Čekiukai logo"
                            className="w-10 h-10"
                        />

                        <h1 className="text-3xl font-semibold text-gray-900">
                            Čekiukai
                        </h1>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        Redaguoti profilį
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Vardas
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Įveskite naują vardą"
                            type="text"
                            className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Pavardė
                        </label>
                        <input
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Įveskite naują pavardę"
                            type="text"
                            className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            El. paštas
                        </label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Įveskite naują el. paštą"
                            type="email"
                            className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Naujas slaptažodis
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Įveskite naują slaptažodį"
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2.5 pr-10 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                👁
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Pakartokite slaptažodį
                        </label>
                        <div className="relative">
                            <input
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                placeholder="Pakartokite naują slaptažodį"
                                type={showRepeatPassword ? "text" : "password"}
                                className="w-full px-4 py-2.5 pr-10 rounded-md border border-gray-200 focus:ring-[#437d38] focus:border-[#437d38] placeholder:text-gray-400 text-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                👁
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#437d38] text-white py-3 rounded-md font-semibold text-base hover:bg-[#386a2f] transition-colors duration-200"
                    >
                        Išsaugoti
                    </button>
                </form>

                {message && (
                    <p
                        className={`mt-4 text-center text-sm font-medium ${isError ? "text-red-600" : "text-green-700"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </main>
        </div>
    );
}

export default ProfileEdit;