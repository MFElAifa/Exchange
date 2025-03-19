import { useState } from "react";

export default function FixRate() {
  const [fixRateValue, setFixRate] = useState(true);

  const fixedRate = (e) => {
    setFixRate(e.target.checked);
  };

  return (
    <>
      <label>
        Fix : 
        <input
          type="checkbox"
          checked={fixRateValue}
          onChange={fixedRate}
        />
      </label>
    </>
  );
}