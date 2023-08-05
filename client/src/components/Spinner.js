import Loading from "./spinner.gif";
import React, { useState } from "react";


const count = ['.','....'];
const Spinner = () => {
  const [dots, setDots] = useState("");
    var i = 0;
  setInterval(() => {
    setDots(count[i]);
    i = (i+1)%2;
  }, 1000);
  return (
    <div className="flex flex-row">
      <img className="w-4 h-4" src={Loading} alt="nothing" />
      <div className="text-sm">{`submission queuing ${dots}`}</div>
    </div>
  );
};

export default Spinner;
