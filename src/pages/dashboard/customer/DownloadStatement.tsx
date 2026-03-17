import React, { useState, ChangeEvent } from 'react';

interface DownloadStatementProps {
  accountNumber: string;
}

interface DateRange {
  start: string;
  end: string;
}

const DownloadStatement: React.FC<DownloadStatementProps> = ({ accountNumber }) => {
  const [dates, setDates] = useState<DateRange>({ start: '', end: '' });
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDates({
      ...dates,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async (): Promise<void> => {
    if (!dates.start || !dates.end) {
      alert("Please select both start and end dates.");
      return;
    }

    setIsDownloading(true);
    try {
      // Logic for generating PDF/CSV from Spring Boot would go here
      console.log(`Fetching statement for ${accountNumber} from ${dates.start} to ${dates.end}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Statement generated and download started!");
    } catch (error) {
      alert("Failed to generate statement. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 mt-4 bg-white">
      <div className="d-flex align-items-center mb-3">
        <i className="bi bi-file-earmark-pdf text-danger fs-4 me-2"></i>
        <h5 className="mb-0 fw-bold">Download Account Statement</h5>
      </div>
      
      <div className="row g-3">
        <div className="col-md-5">
          <label className="form-label small text-muted text-uppercase fw-bold">Start Date</label>
          <input 
            type="date" 
            name="start"
            className="form-control" 
            value={dates.start}
            onChange={handleInputChange} 
          />
        </div>
        <div className="col-md-5">
          <label className="form-label small text-muted text-uppercase fw-bold">End Date</label>
          <input 
            type="date" 
            name="end"
            className="form-control" 
            value={dates.end}
            onChange={handleInputChange} 
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button 
            onClick={handleDownload} 
            className="btn btn-outline-primary w-100"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <><i className="bi bi-download me-1"></i> Get</>
            )}
          </button>
        </div>
      </div>
      <div className="form-text mt-2 small text-muted">
        Select a date range to export your transaction history for account <strong>{accountNumber}</strong>.
      </div>
    </div>
  );
};

export default DownloadStatement;
