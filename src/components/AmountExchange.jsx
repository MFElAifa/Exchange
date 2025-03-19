import { useState, useEffect } from "react";

export default function AmountExchange({rate, newRate, deviseInput, deviseOutput}) {
  const [amount, setAmount] = useState(0);
  const [amountConverted, setAmountConverted] = useState(0);
  const [exchangeOperation, setExchangeOperation] = useState([]);
  
  const amountChange = (obj) => {
    let value = obj.target.value;
    value = value.replace(',', '.');
    
    const regex = /^(\d+(\.\d*)?|\.\d+)$/;

    if (regex.test(value) || value === "") {
      setAmount(value);
    }
  }

  const addOperation = (newAmountConverted) => {
    setExchangeOperation(prevOperations => {
      const newOperations = [
        { rate, newRate, amount, newAmountConverted, deviseInput, deviseOutput}, 
        ...prevOperations
      ];
      if (newOperations.length > 5) {
        newOperations.pop(); 
      }
      return newOperations;
    });
  }
  const converterAmount= () => {
    if(amount>0){
      setAmountConverted(parseFloat(amount*rate).toFixed(2));
      addOperation(parseFloat(amount*rate).toFixed(2));
    }
  }

  
  useEffect(() => {
    converterAmount();
  }, [rate]);

  
  return (
    <div>
        <div className="row g-4 align-items-center">
          <div className="col-auto">
            <label  className="col-form-label">Amount:</label>
          </div>
          <div className="col-auto">
            <input type="text"
              value={amount}
              onChange={amountChange}
              onBlur={converterAmount}
              className="form-control" 
            />
          </div>
          <div className="col-auto">
            <span className="form-text">
              {deviseInput}
            </span>
          </div>
          <div className="col-auto">
            <label className="col-form-label">{amountConverted} &nbsp;{deviseOutput}</label>
          </div>
        </div>
        
        
        {exchangeOperation.length > 0 && (
          <div className="row g-4 align-items-center"> 
            <h2>Operations : </h2>
            <table border={1}>
              <thead>
                <tr>
                  <th>Real Rate</th>
                  <th>Rate</th>
                  <th>Initial value</th>
                  <th>Calculed value</th>
                </tr>
              </thead>
              <tbody>
              {exchangeOperation.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.rate}</td>
                    <td>{entry.newRate}</td>
                    <td>{entry.amount} {entry.deviseInput}</td>
                    <td>{entry.newAmountConverted} {entry.deviseOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}