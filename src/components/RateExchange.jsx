import { useState, useEffect, useRef } from "react";
import AmountExchange from "./AmountExchange";
import switchSvg from './../assets/switch.svg'

export default function RateExchange() {
  const [rateValue, setRate] = useState(1.1);
  const [fixRate, setFixRate] = useState(false);
  const [deviseInput, setDeviseInput] = useState("€");
  const [deviseOutput, setDeviseOutput] = useState("$");
  
  const origRateRef = useRef(rateValue);

  const changeRate = (obj) => {
    console.info("fixRate : "+fixRate);
    let newValue = obj.target.value;
    newValue = newValue.replace(',', '.');
    const regex = /^(\d+(\.\d*)?|\.\d+)$/;
    newValue = newValue === "" ? 0 : newValue;
    if (regex.test(newValue) && fixRate) {
        const variation = Math.abs((newValue - origRateRef.current) / origRateRef.current) * 100;
        console.log("variation: "+variation);
        if (variation > 2) {
            console.log("Variation > 2% : desactivate fix rate");
            setFixRate(false);
            newValue = origRateRef.current;
        }
    }

    setRate(newValue);
  };

  const fixedRate = (obj) => {
    const isChecked = obj.target.checked;
    setFixRate(isChecked);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const valueToAdded = parseFloat(Math.random() * 0.1 - 0.05);
      const newValue = parseFloat(origRateRef.current + valueToAdded).toFixed(2);
      
      if(!fixRate){
        origRateRef.current = parseFloat(newValue);
        setRate(origRateRef.current);
      }
      
      
    }, 3000);

    return () => clearInterval(interval);
  }, [fixRate, rateValue]);

  const switchDevises = () => {
    const prevInputDevise = deviseInput;
    setRate((prevValue) => (parseFloat(1 / prevValue)).toFixed(2));
    setDeviseInput(deviseOutput);
    setDeviseOutput(prevInputDevise);
  };

  return (
    <div>
       <div className="row g-3 align-items-center">
            <div className="col-auto">
                <label className="col-form-label">Rate :</label>
            </div>
            <div className="col-auto">
                <input
                    type="text"
                    value={rateValue}
                    onChange={changeRate} 
                    readOnly={!fixRate}
                    className="form-control" 
                />
            </div>
            
            <div className="col-auto">
                <div className="form-check">
                    <input 
                        type="checkbox" 
                        checked={fixRate} 
                        onChange={fixedRate} 
                        className="form-check-input"
                    />
                        <label className="form-check-label">
                            Fix
                        </label>
                </div>
            </div>
      </div>
      <div className="row g-4 mt-3 mb-3">
        <div className="col-auto d-flex justify-content-center">
            <button  className="btn btn-outline-primary" onClick={switchDevises}>
                {deviseInput} &nbsp;<img src={switchSvg} alt="Switch" />&nbsp;{deviseOutput}
            </button>
        </div>
      </div>
      <AmountExchange
        rate={rateValue}
        newRate={fixRate ? rateValue : null}
        deviseInput={deviseInput}
        deviseOutput={deviseOutput}
      />
    </div>
  );
}
