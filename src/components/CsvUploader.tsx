import React, { useState } from "react";

interface CsvUploaderProps {
  onClassesAdded: (classes: string[]) => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onClassesAdded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    try {
      const classes = await parseCSV(file);
      onClassesAdded(classes);
      setSuccessMessage(`Successfully added ${classes.length} classes.`);
      setFile(null);
    } catch (err) {
      setError("Error processing the CSV file. Please check the file format.");
    }
  };

  const parseCSV = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        const classes = csvData.trim().split("\n");
        resolve(classes);
      };
      reader.onerror = () => {
        reject("Error reading the CSV file.");
      };
      reader.readAsText(file);
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
};

export default CsvUploader;

