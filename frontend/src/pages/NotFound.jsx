// Paprastas patikrinimui skirtas puslapis
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'col', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '6rem', color: '#ef4444', margin: 0 }}>404</h1>
        <h1 className="text-gray-600 mt-2">
            Atsiprašome, bet ieškomas puslapis neegzistuoja.
        </h1> 
        <button 
        onClick={() => navigate("/pagrindinis")}
        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#437d38', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Grįžti į pradžią
      </button>
    </div>
  );
}

export default NotFound;