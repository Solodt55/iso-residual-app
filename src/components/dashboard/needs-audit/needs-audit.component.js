import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './needs-audit.component.css'; // Assuming you'll add styles here

const NeedsAudit = ({ reports, userID }) => {
  const [reportsThatNeedAudit, setReportsThatNeedAudit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5; // Adjust the number of reports per page
  const navigate = useNavigate();

  useEffect(() => {
    // Filter reports that have entries needing audit
    let reportsNeedingAudit = [];
    if(userID === ''){
      reportsNeedingAudit = reports.filter(report => 
        Array.isArray(report.reportData) && report.reportData.some(item => item.needsAudit)
      );
    }else{
      reportsNeedingAudit = reports.filter(report => 
        report.userID == userID && Array.isArray(report.reportData) && report.reportData.some(item => item.needsAudit)
      );
    }
    setReportsThatNeedAudit(reportsNeedingAudit);
  }, [reports]);

  console.log('reportsThatNeedAudit',reportsThatNeedAudit);

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reportsThatNeedAudit.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reportsThatNeedAudit.length / reportsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Navigate to the report edit page
  const handleEditClick = (reportID) => {
    navigate(`/report/${reportID}`);
  };

  return (
    <>

    {userID === '' && (
      <div className="needs-audit-container bg-zinc-900 rounded-lg shadow-sm p-6 mb-8 border border-[#69932f]/20 b-maine-wrap">
        <h3 className='text-lg font-semibold text-white mb-4'>Reports Needing Audit</h3>
        {reportsThatNeedAudit.length > 0 ? (
          <>
            <ul className="audit-list">
              {currentReports.map((report, index) => (
                <li key={index} className="audit-item px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <strong className='font-medium text-sm text-gray-300'>{report.processor || 'Unknown Processor'}</strong>
                  <button className='text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#69932f] hover:bg-[#8ba85a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69932f]' onClick={() => handleEditClick(report.reportID)}>Edit</button>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`pagination-btn ${index + 1 === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p class="text-sm text-gray-300 text-center">All reports have been audited.</p>
        )}
      </div>
    )}


    { userID != '' && (
      <>
        {/* Agent Report Section */}
        <div className="needs-audit-container bg-zinc-900 rounded-lg shadow-sm p-6 mb-8 border border-[#69932f]/20 b-maine-wrap">
          <h3 className='text-lg font-semibold text-white mb-4'>Agent Reports</h3>
                    <div className="mb-4">
              <p className="text-sm text-gray-300 mb-4">
                Welcome to your personalized agent report dashboard. Here you can view your performance metrics, 
                track your transactions, and manage your reports.
              </p>
              
              <div className="flex justify-center gap-4">
              <button 
                className='text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#69932f] hover:bg-[#8ba85a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69932f] transition-colors duration-200'
                onClick={() => navigate('/reports/all')}
              >
                View All Reports
              </button>
            </div>
            </div>
        </div>
      </>
    )}

    </>
  );
};

export default NeedsAudit;
