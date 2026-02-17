import { useEffect, useState } from "react";

const ProgressBar = ({ value, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setWidth(value);
    }, 200);
  }, [value]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;