import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import { addReport, updateReportDataByType } from '../../../../api/reports.api.js';
import './report-upload.component.css';
import { jwtDecode } from 'jwt-decode';
import { getAgents } from '../../../../api/agents.api.js';

const ReportUpload = ({ authToken, organizationID }) => {
  const processors = [
    'accept.blue',
    'Clearent',
    'Fiserv Bin & ICA',
    'Fiserv Omaha',
    'Global',
    'Hyfin',
    'Merchant Lynx',
    'Micamp',
    'PAAY',
    'Payment Advisors',
    'Rectangle Health',
    'Shift4',
    'TRX',
    'First Data',
    'Moneris',
    'Global Payments',
    'TSYS',
    'Elavon',
    'Evo',
    'Chase Paymentech',
    'Worldpay',
    'Heartland Payment Systems',
    'Maverick Payments',
    'North American Bank Card',
    'Priority Payments',
    'Total Merchant Service',
    'PayBright',
    'Stripe',
    'ACI Worldwide',
    'TracerPay',
    'Adyen',
    'Authorize.net',
    'CSG Forte',
    'Payline Data',
    'NMI',
    'Paypal',
    'Square',
    'Clover',
    'Verifone',
    'Ingenico',
    'NCR Corporation',
    'PAX Technology',
    'Light Speed',
    'Elo Touch Solutions',
    'Datacap Systems',
    'Tabit',
    'rPower',
    'Touch Bistro',
    'Swipe Simple'
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Dynamically generate years including the current year and the previous few years
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const [rows, setRows] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAddRow = () => {
    setRows([...rows, { processor: '', file: null }]);
  };

  const handleProcessorChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].processor = value;
    setRows(updatedRows);
  };

  const handleFileChange = (index, file) => {
    const updatedRows = [...rows];
    updatedRows[index].file = file;
    setRows(updatedRows);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (rows.length === 0) {
      setUploadStatus('Please add at least one file to upload.');
      return;
    }

    if (!selectedMonth || !selectedYear) {
      setUploadStatus('Please select a month and year.');
      return;
    }

    try {
      setLoading(true); // Show loading popup
      const formData = new FormData();
      
      rows.forEach((row) => {
        if (row.file && row.processor) {
          const processorFieldName = row.processor;
          formData.append(processorFieldName, row.file);
        }
      });

      formData.append('month', selectedMonth);
      formData.append('year', selectedYear);

      // Get token and decode it
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.user_id || '';
      const roleId = decodedToken?.roleId || '';

      // Add userId to formData if condition is met
      if (decodedToken && (userId !== '') && (roleId !== 1 && roleId !== 2)) {
        formData.append('userID', userId);
      }

      const response = await addReport(organizationID, formData, authToken);
      console.log('API Response:', response);

      if (response && response.status === 200) {

        // Fetch and console.log all agents after successful upload
        //  try {
        //   const agentsResponse = await getAgents(organizationID, authToken);
        //   console.log("All agents after upload:", agentsResponse);

        //   // Extract all clients from all agents and format them
        //   const allMerchants = [];
          
        //   if (agentsResponse && Array.isArray(agentsResponse.agents)) {
        //     agentsResponse.agents.forEach(agent => {
        //       if (agent.clients && Array.isArray(agent.clients)) {
        //         agent.clients.forEach(client => {
        //           if (client.merchantID && client.merchantName) {
        //             allMerchants.push({
        //               "Merchant Id": client.merchantID,
        //               "Merchant Name": client.merchantName,
        //               "Branch ID": client.branchID || ""
        //             });
        //           }
        //         });
        //       }
        //     });
        //   }

        //   // Create the formatted structure
        //   const formattedMerchants = {
        //     "type": "processor",
        //     "newMerchants": allMerchants
        //   };

        //   console.log("Formatted merchants data:", formattedMerchants);
        //   console.log("Total merchants found:", allMerchants.length);

        //   // Call the API to update report data with the formatted merchants
        //   if (allMerchants.length > 0) {
        //     try {
        //       const updateResponse = await updateReportDataByType(
        //         organizationID, 
        //         "processor", 
        //         allMerchants, 
        //         authToken
        //       );
        //       console.log("Report data update response:", updateResponse);
        //     } catch (updateError) {
        //       console.error("Error updating report data:", updateError);
        //     }
        //   }

        // } catch (agentError) {
        //   console.error("Error fetching agents:", agentError);
        // }

        setUploadStatus('Files uploaded successfully!');
        setLoading(false); // Hide loading popup
        navigate('/reports/all'); // Redirect after successful upload
      } else {
        setUploadStatus('Failed to upload files.');
        setLoading(false); // Hide loading popup on failure
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
      setLoading(false); // Hide loading popup on error
      console.error('Upload error:', error);
    }
  };
  
  
  const selectedProcessors = rows.map(row => row.processor); // Get all selected processors

  return (
    <div className='p-6'>
    <div className="report-upload-container max-w-7xl mx-auto bg-zinc-900 rounded-lg shadow-sm p-6 mb-8 ">
      <h2 className='text-lg font-semibold text-white mb-4'>Upload Reports</h2>

      {/* Month and Year Selection */}
      <div className="month-year-selection">
        <label className='text-xs font-medium text-gray-300'>
          Month:
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} required className='text-sm px-5 bg-zinc-800 ml-2 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400'>
            <option value="" disabled>Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </label>

        <label className='text-xs font-medium text-gray-300'>
          Year:
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} required className='text-sm px-5 bg-zinc-800 ml-2 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400'>
            <option value="" disabled>Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      <form onSubmit={handleUpload}>
        <table className="report-upload-table">
          <thead>
            <tr>
              <th>Processor</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={row.processor}
                    onChange={(e) => handleProcessorChange(index, e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Processor</option>
                    {processors
                      .filter(processor => !selectedProcessors.includes(processor) || processor === row.processor) // Ensure processor is available or already selected
                      .map((processor) => (
                        <option key={processor} value={processor}>
                          {processor}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <input
                    type="file"
                    accept=".csv, .xlsx" // Limit file types to CSV and XLSX
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                    required
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="add-row-btn">
          <button type="button" onClick={handleAddRow} className='text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#69932f] hover:bg-[#69932f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69932f]'>
            Add File <i className="fa fa-plus"></i>
          </button>
        </div>

        {rows.length > 0 && (
          <button type="submit" className="upload-btn text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#69932f] hover:bg-[#69932f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69932f]">
            Upload Files
          </button>
        )}
      </form>
      
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

      {/* Loading Popup */}
      {loading && (
        <div className="loading-popup">
          <div className="loading-spinner"></div>
          <p>Uploading... Please wait</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default ReportUpload;
