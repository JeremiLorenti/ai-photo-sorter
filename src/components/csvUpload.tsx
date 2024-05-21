import React, { useState } from "react";

interface CSVUploadComponentProps {
  onCSVUpload: (classNames: string[]) => void;
}

const CSVUploadComponent = ({ onCSVUpload }: CSVUploadComponentProps) => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [csvError, setCSVError] = useState<string | null>(null);

  const handleCSVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCSVFile(event.target.files?.[0] || null);
    setCSVError(null);
  };

  const handleCSVUpload = () => {
    if (!csvFile) {
      setCSVError("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      const classNames = parseCSVData(csvData);
      if (classNames) {
        onCSVUpload(classNames);
      } else {
        setCSVError("Invalid CSV file format.");
      }
    };
    reader.onerror = () => {
      setCSVError("Error reading CSV file.");
    };
    reader.readAsText(csvFile);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVChange}
        value={csvFile ? csvFile.name : ""}
      />
      <button onClick={handleCSVUpload}>Upload CSV</button>
      {csvError && <div style={{ color: "red" }}>{csvError}</div>}
    </div>
  );
};

const parseCSVData = (csvData: string): string[] | null => {
  const lines = csvData.split("\n");
  const classNames: string[] = [];

  for (const line of lines) {
    const [className] = line.split(",");
    if (className.trim()) {
      classNames.push(className.trim());
    }
  }

  return classNames.length > 0 ? classNames : null;
};

export default CSVUploadComponent;

