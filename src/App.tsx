import React, { useState } from 'react';

const App: React.FC = () => {
  const [sum, setSum] = useState<number>(0); //new state for the sum number
  const [fileUploaded, setFileUploaded] = useState<boolean>(false); //used to disable calculate sum button if no file uploaded
  const [newFile, setNewFile] = useState<string | undefined>(); //new state for capturing data from file

  //function for handling new file upload
  const handleNewFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const uploadedFile = event.target.files?.[0];
    //check to make sure file has been uploaded
    if (uploadedFile) {
      //update boolean to enable calculate sum button
      setFileUploaded(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const readFile: string = event.target.result;
          setNewFile(readFile);
        }
      };
      reader.readAsText(uploadedFile);
      setSum(0); //reset sum to 0 when a new file is uploaded
    }
  };

  //function for handling calculate sum button
  const calculateSum = (): void => {
    if (newFile) {
      const totalSum = newFile
        .split('\n') //split the data by line
        .slice(1) //remove the first line that contains headers
        .map((line) => {
          const values = line.split(','); //creates an array of the values separated by commas
          const numbers = values.map((value) => {
            const num = parseInt(value); //convert each value from string to number
            return isNaN(num) ? 0 : num; // return 0 for invalid values
          });
          return numbers.slice(1); //skip the first value which is the time/date stamp
        })
        .flat() //flatten the array
        .reduce((accum, current) => accum + current, 0); //reduce the values by adding them together into a single integer

      //update setSum to reflect new integer
      setSum(totalSum);
    }
  };

  return (
    <div className="app">
      <h1 className='title'>Sum Number Calculator</h1>
      <input type="file" accept=".csv" onChange={handleNewFile} />
      <h1 className='sum'>{sum}</h1>
      <button type="submit" disabled={!fileUploaded} onClick={calculateSum}>
        Calculate Sum
      </button>
    </div>
  );
};

export default App;

