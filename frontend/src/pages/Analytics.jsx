import { useEffect } from "react";

function Analytics() {
  useEffect(() => {
    document.title = "Analitika";
  }, []);

  return <p className="text-5xl font-bold text-center">Analytics</p>
}

export default Analytics;