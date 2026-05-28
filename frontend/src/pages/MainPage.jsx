import { useEffect } from "react";

function MainPage() {
    useEffect(() => {
    document.title = "Pradžia";
  }, []);
    return <p className="text-5xl font-bold text-center">MainPage</p>
}


export default MainPage;