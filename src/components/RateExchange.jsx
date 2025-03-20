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
        <hr />
        <div className="row g-4 align-items-center">
            <div className="col-md-3">
                <label className="col-form-label fs-1">Rate :</label>
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    value={rateValue}
                    onChange={changeRate} 
                    readOnly={!fixRate}
                    className="form-control" 
                />
            </div>
            
            <div className="col-md-3">
                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                        <input 
                            type="checkbox" 
                            checked={fixRate} 
                            onChange={fixedRate}
                            className="btn-check" id="btncheck1" autoComplete="off" />
                            <label className="btn btn-outline-primary" htmlFor="btncheck1">Fix</label>

                        
                </div>
            </div>
      
            <div className="col-md-3">
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
