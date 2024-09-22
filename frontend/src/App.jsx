import React, { useState } from 'react';
import axios from 'axios';

export const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [filteredData, setFilteredData] = useState(null);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    setError(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      JSON.parse(jsonInput);
    } catch (err) {
      setError('Invalid JSON format');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3020/bfhl', {
        data: JSON.parse(jsonInput).data,
      });

      setResponse(res.data);
    } catch (err) {
      setError('Error sending request to backend');
    }
  };

  const handleFilterChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);

    if (response) {
      if (option === 'Alphabets') {
        setFilteredData(response.alphabets);
      } else if (option === 'Numbers') {
        setFilteredData(response.numbers);
      } else if (option === 'Highest Lowercase Alphabet') {
        setFilteredData(response.highest_lowercase_alphabet);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url('/srm.jpg.webp')]  flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            API JSON Input
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            value={jsonInput}
            onChange={handleJsonChange}
            placeholder='{"data": ["A", "1", "B", "2", "a"]}'
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {response && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Multi Filter
              </label>
              <select
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleFilterChange}
                value={selectedOption}
              >
                <option value="">Select</option>
                <option value="Alphabets">Alphabets</option>
                <option value="Numbers">Numbers</option>
                <option value="Highest Lowercase Alphabet">
                  Highest Lowercase Alphabet
                </option>
              </select>
            </div>

            {filteredData && (
              <div className="mt-4">
                <h3 className="text-gray-800 font-bold text-lg mb-2">
                  Filtered Response
                </h3>
                <p className="text-gray-700">
                  {selectedOption}: {filteredData.join(', ')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
