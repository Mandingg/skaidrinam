import { useEffect } from "react";
function Profile() {

    useEffect(() => {
    document.title = "Profilis";
  }, []);
    return <p className="text-5xl font-bold text-center">Profile</p>
}

export default Profile;