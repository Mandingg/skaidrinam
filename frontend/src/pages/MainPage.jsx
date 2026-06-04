import { useEffect, useState } from "react";

function MainPage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Pradžia";

        async function fetchUser() {
            try {
                // Token ištraukimas is localStorage
                const token = localStorage.getItem("token"); 

                // Kreipiamės į veikiantį adresą /me
                const response = await fetch("http://127.0.0.1:8000/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Nepavyko gauti vartotojo");
                }

                setUser(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchUser();
    }, []); 

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!user) {
        return <p className="text-gray-500">Kraunama...</p>;
    }

    return (
        <div className="text-center text-xl">
            <p className="text-3xl font-bold mb-4">MainPage</p>

            <p><b>ID:</b> {user.id}</p>
            <p><b>Vardas:</b> {user.name}</p>
            <p><b>Pavardė:</b> {user.surname}</p>
            <p><b>Email:</b> {user.email}</p>
        </div>
    );
}

export default MainPage;