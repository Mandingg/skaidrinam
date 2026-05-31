import { useEffect } from "react";
function Warranties() {

    useEffect(() => {
    document.title = "Garantijos";
  }, []);
    return <p className="text-5xl font-bold text-center">Warranties</p>
}

export default Warranties;
