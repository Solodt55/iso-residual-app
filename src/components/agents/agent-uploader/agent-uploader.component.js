import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAgents, getAgents } from '../../../api/agents.api'; // This is the API call to upload the file
import { updateReportDataByType } from '../../../api/reports.api';
import './agent-uploader.component.css';

const AgentUploader = ({ authToken, organizationID }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('agents', file);

    try {
      const response = await uploadAgents(organizationID, formData, authToken);
      
      if (response && response.status === 200) {
        console.log('response.data',response.data);
        const { needsAudit, rejectedMerchants, createdAgents} = response.data;

        // Log to confirm data content
        // console.log("needsAudit data:", needsAudit);
        // console.log("rejectedMerchants data:", rejectedMerchants);
        // console.log("created agent data:", createdAgents);

        // Fetch and console.log all agents after successful upload
        // try {
        //   // const agentsResponse = await getAgents(organizationID, authToken);
        //   // console.log("All agents after upload:", agentsResponse);

        //   // Extract all clients from all agents and format them
        //   const allMerchants = [];
          
        //   if (createdAgents && Array.isArray(createdAgents)) {
        //     createdAgents.forEach(agent => {
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

        setUploadStatus('File uploaded successfully!');
        
        setTimeout(() => {
          // Redirect to needs-audit page with needsAudit and rejectedMerchants data
          navigate('/needs-audit', {
            state: { needsAudit, rejectedMerchants },
          });
        }, 1000);
      } else {
        setUploadStatus('Failed to upload the file.');
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="agtupload min-h-screen flex items-center justify-center">
    <div className="agent-upload-container bg-zinc-900 p-10 rounded-lg shadow-lg w-full max-w-md " >
      <h2 className='pb-6 mb-6 border-b border-yellow-400/20'>Upload Merchant Reports</h2>

      <form onSubmit={handleUpload}>
        <div className="file-input-container ">
          <label htmlFor="fileUpload" className='block font-medium text-gray-300 mb-2'>Choose file:</label>
          <input
            type="file"
            id="fileUpload"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="file-info">
            <p>Selected file: {file.name}</p>
          </div>
        )}

        <button type="submit" className="upload-btn w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-medium uppercase transition duration-200 dsabled:opacity-50">
          Upload File
        </button>
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

export default AgentUploader;
