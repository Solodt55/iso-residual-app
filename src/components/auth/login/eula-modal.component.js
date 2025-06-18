import React, { useState } from 'react';

const EulaModal = ({ onAgree, onCancel }) => {
  const [hasConsented, setHasConsented] = useState(false);
  const termsLink = "https://isohub.io/privacy-policy";

  return (
    <div className="eula-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="eula-modal-card bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="eula-modal-header px-6 py-4 border-b border-gray-200">
          <h2 className="eula-modal-title text-2xl font-semibold text-gray-800">End User License Agreement (EULA)</h2>
        </div>

        {/* Body */}
        <div className="eula-modal-body flex-1 px-6 py-4 overflow-y-auto text-sm text-gray-700 leading-relaxed">
          <p className="mb-4">
            Welcome to Tracer. Before you proceed, please review and accept our End User License Agreement.
          </p>
          <p className="mb-4">
            By checking the box below and clicking <strong>"Agree and Login"</strong>, you acknowledge that you have read,
            understood, and agree to be bound by the privacy policy outlined in our{' '}
            <a
              href="#"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Privacy Policy
            </a>.
          </p>
          <p className="mb-2 font-medium">Key points of the agreement include:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Data privacy and usage policies.</li>
            <li>Acceptable use of the platform.</li>
            <li>Disclaimers and limitations of liability.</li>
            <li>Intellectual property rights.</li>
          </ul>
          <p>
            Failure to accept this agreement will prevent access to certain features of the platform.
          </p>
        </div>

        {/* Footer */}
        <div className="eula-modal-footer px-6 py-4 border-t border-gray-200 bg-white flex flex-wrap justify-between items-center gap-4">
          {/* Checkbox */}
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              className={`h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-300 ${
                hasConsented ? 'bg-yellow-400' : 'bg-white'
              }`}
            />
            <span className="ml-2">I agree to the Terms and Conditions</span>
          </label>

          {/* Buttons aligned right */}
          <div className="flex space-x-3 ml-auto">
            <button
              onClick={onCancel}
              className="cancel-btn px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onAgree}
              disabled={!hasConsented}
              className={`agree-btn px-4 py-2 rounded-md ${
                hasConsented
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-yellow-400 text-white opacity-50 cursor-not-allowed'
              }`}
            >
              Agree and Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EulaModal;
