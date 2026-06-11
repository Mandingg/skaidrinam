import { useEffect } from "react";
import { useNavigate } from "react-router";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Atsijungimas";

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.warn("Failed to clear storage during logout", error);
    }

    navigate("/", {
      replace: true,
      state: { logoutMessage: "Sėkmingai atsijungta" },
    });
  }, [navigate]);

  return (
    <div className="logout-page">
      <main className="logout-card">
        <p>Baigiamas atsijungimas...</p>
      </main>
    </div>
  );
}

export default Logout;
