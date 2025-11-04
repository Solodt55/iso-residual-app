
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';

const ReportsListHeader = ({ 
  filterMonth, 
  filterYear, 
  setFilterMonth, 
  setFilterYear, 
  reportType, 
  setReportType, 
  searchTerm, 
  setSearchTerm, 
  onUploadClick,
  uniqueFirstNames,
  uniqueProcessor,
  userID 
}) => {
    const navigate = useNavigate();

    const handleUploadClick = () => {
        navigate('/upload-report');
    };
    // console.log(uniqueProcessor,'uniqueFirstProcessor from header');
    // console.log(reportType,'reportType')

    // Generate years from 2020 to the current year dynamically
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = 2020; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    };
        // Get isAdmin from token
    const token = localStorage.getItem('authToken');
    let decodedToken = null;
    try {
        decodedToken = token ? jwtDecode(token) : null;
    } catch {
        decodedToken = null;
    }

    // If agent, force reportType to 'agent'
    if (decodedToken && !decodedToken.isAdmin && reportType !== 'agent') {
        setReportType('agent');
    }
    // Debug log for decodedToken and isAdmin
    console.log('[reports-list-header] decodedToken:', decodedToken, '| isAdmin:', decodedToken && decodedToken.isAdmin);

        return (
                <div className="reports-header">
                        <div className="header">
                                <h2 className='text-lg font-semibold text-white mb-4'>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Reports</h2>
                                {/* Show upload button for admins only */}
                                {decodedToken && decodedToken.isAdmin && (
                                    <button onClick={handleUploadClick}
                                        className="text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69932f]"
                                        style={{ backgroundColor: '#69932f' }}
                                    >
                                        Go to Report Upload
                                    </button>
                                )}
                        </div>

            <div className="filters">
                {/* Month filter */}
                <select className='bg-zinc-800 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400 p-right' value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                    <option value="">All Months</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>

                {/* Year filter */}
                <select className='bg-zinc-800 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400 p-right' value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                    <option value="">All Years</option>
                    {getYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                {/* Report type filter */}
                {/* <select className='bg-zinc-800 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400 p-right' value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="all">All Reports</option>
                    <option value="agent">Agent Reports</option>
                    <option value="agent-summary">Agent Summary Reports</option>
                    <option value="ar">AR Reports</option>
                    <option value="bank-summary">Bank Summary Reports</option>
                    <option value="billing">Billing Reports</option>
                    <option value="processor">Processor Reports</option>
                    <option value="processor-summary">Processor Summary Reports</option>
                </select> */}


                {/* Show report type dropdown for admins only */}
                {decodedToken && decodedToken.isAdmin ? (
                    <select
                        className='bg-zinc-800 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400 p-right'
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="all">All Reports</option>
                        <option value="agent">Agent Reports</option>
                        <option value="agent-summary">Agent Summary Reports</option>
                        <option value="ar">AR Reports</option>
                        <option value="bank-summary">Bank Summary Reports</option>
                        <option value="billing">Billing Reports</option>
                        <option value="processor">Processor Reports</option>
                        <option value="processor-summary">Processor Summary Reports</option>
                    </select>
                ) : null}


                {/* Search field */}
                <input
                    type="text"
                    placeholder="Search reports..."
                    className='bg-zinc-800 border-zinc-700 text-white rounded-md focus:ring-yellow-400 focus:border-yellow-400'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {
                    decodedToken && decodedToken.isAdmin && reportType === 'agent' && userID === '' && (
                        <div className="w-64">
                            <Select
                                options={(uniqueFirstNames || []).map(name => ({
                                    value: name,
                                    label: name
                                }))}
                                placeholder="Select an Agent"
                                onChange={(selectedOption) => {
                                    setSearchTerm(selectedOption?.value || '');
                                }}
                                isClearable
                                menuShouldScrollIntoView={false}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? '#fff' : '#fafafa',
                                        borderColor: state.isFocused ? '#69932f' : '#d1d5db',
                                        color: '#333',
                                        minHeight: '38px',
                                        paddingLeft: '8px',
                                        padding: '4px',
                                        fontSize: '16px',
                                        boxShadow: state.isFocused ? '0 0 0 2px #69932f33' : 'none',
                                        outline: state.isFocused ? '2px solid #69932f' : 'none',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: '#333',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#fff',
                                        maxHeight: 'none',
                                        color: '#333',
                                        zIndex: 9999,
                                        border: '1px solid #d1d5db',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? '#69932f'
                                            : state.isFocused
                                            ? '#e6f4d7'
                                            : '#fff',
                                        color: state.isSelected
                                            ? '#fff'
                                            : state.isFocused
                                            ? '#333'
                                            : '#333',
                                        padding: '10px',
                                        cursor: 'pointer',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        color: '#888',
                                    }),
                                    dropdownIndicator: (provided, state) => ({
                                        ...provided,
                                        color: state.isFocused ? '#69932f' : '#888',
                                    }),
                                    indicatorSeparator: () => ({
                                        display: 'none',
                                    }),
                                }}
                            />
                        </div>
                    )
                }
 
                {
                    reportType === 'processor' && (
                        <div className="w-64">
                              <Select
                                options={(uniqueProcessor || []).map(name => ({
                                    value: name,
                                    label: name
                                }))}
                                placeholder="Select an Processor"
                                onChange={(selectedOption) => {
                                    setSearchTerm(selectedOption?.value || '');
                                }}
                                isClearable
                                menuShouldScrollIntoView={false}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? '#fff' : '#fafafa',
                                        borderColor: state.isFocused ? '#69932f' : '#d1d5db',
                                        color: '#333',
                                        minHeight: '38px',
                                        paddingLeft: '8px',
                                        padding: '4px',
                                        fontSize: '16px',
                                        boxShadow: state.isFocused ? '0 0 0 2px #69932f33' : 'none',
                                        outline: state.isFocused ? '2px solid #69932f' : 'none',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: '#333',
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#fff',
                                        maxHeight: 'none',
                                        color: '#333',
                                        zIndex: 9999,
                                        border: '1px solid #d1d5db',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? '#69932f'
                                            : state.isFocused
                                            ? '#e6f4d7'
                                            : '#fff',
                                        color: state.isSelected
                                            ? '#fff'
                                            : state.isFocused
                                            ? '#333'
                                            : '#333',
                                        padding: '10px',
                                        cursor: 'pointer',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        color: '#888',
                                    }),
                                    dropdownIndicator: (provided, state) => ({
                                        ...provided,
                                        color: state.isFocused ? '#69932f' : '#888',
                                    }),
                                    indicatorSeparator: () => ({
                                        display: 'none',
                                    }),
                                }}
                            />
                        </div>



                    )
                }

            </div>
        </div>
    );
};

export default ReportsListHeader;
