// import { useState } from 'react';
// import api from '../services/api';
// import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

// const FileUpload = ({ patientId, onUploadSuccess }) => {
//     const [file, setFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [status, setStatus] = useState(null); // success, error

//     const onFileChange = (e) => {
//         setFile(e.target.files[0]);
//         setStatus(null);
//     };

//     const uploadFile = async () => {
//         if(!file || !patientId) return;

//         setUploading(true);
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('patientId', patientId);

//         try {
//             await api.post('/reports/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             setStatus({ type: 'success', msg: 'Report uploaded and analyzed successfully!' });
//             setFile(null);
//             if(onUploadSuccess) onUploadSuccess();
//         } catch (err) {
//             console.error(err);
//             setStatus({ 
//                 type: 'error', 
//                 msg: err.response?.data?.message || err.response?.data?.error || 'Upload failed. Please try again.' 
//             });
//         } finally {
//             setUploading(false);
//         }
//     }

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <Upload className="w-5 h-5 mr-2 text-blue-600"/> Upload Medical Record
//             </h3>
            
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
//                 <input 
//                     type="file" 
//                     onChange={onFileChange}
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     className="hidden" 
//                     id="file-upload"
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
//                     <FileText className="w-12 h-12 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-500">
//                         {file ? file.name : "Click to select PDF or Image"}
//                     </span>
//                 </label>
//             </div>

//             {status && (
//                 <div className={`mt-4 p-3 rounded-md flex items-center text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
//                     {status.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2"/> : <AlertCircle className="w-4 h-4 mr-2"/>}
//                     {status.msg}
//                 </div>
//             )}

//             <button
//                 onClick={uploadFile}
//                 disabled={!file || uploading}
//                 className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium transition ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//             >
//                 {uploading ? 'Processing with Gemini AI...' : 'Upload & Analyze'}
//             </button>
//         </div>
//     );
// };

// export default FileUpload;


import { useState } from 'react';
import api from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ patientId, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus(null);
    };

    const uploadFile = async () => {
        if (!file || !patientId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientId', patientId);

        try {
            await api.post('/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', msg: 'Report uploaded and analyzed successfully!' });
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.message || err.response?.data?.error || 'Upload failed. Please try again.'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-purple-100/40 pointer-events-none" />

            <h3 className="relative text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Upload Medical Record
            </h3>

            {/* Upload Area */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-all"
            >
                <input
                    type="file"
                    onChange={onFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                />

                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                        <FileText className="w-12 h-12 text-blue-400 mb-2" />
                    </motion.div>

                    <span className="text-sm text-gray-600 font-medium">
                        {file ? file.name : "Click to select PDF or Image"}
                    </span>
                </label>
            </motion.div>

            {/* Status Message */}
            <AnimatePresence>
                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className={`mt-4 p-3 rounded-lg flex items-center text-sm shadow-sm
                        ${status.type === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'}`}
                    >
                        {status.type === 'success'
                            ? <CheckCircle className="w-4 h-4 mr-2" />
                            : <AlertCircle className="w-4 h-4 mr-2" />}
                        {status.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Button */}
            <motion.button
                whileHover={!uploading && file ? { scale: 1.02 } : {}}
                whileTap={!uploading && file ? { scale: 0.97 } : {}}
                onClick={uploadFile}
                disabled={!file || uploading}
                className={`relative mt-5 w-full py-2.5 px-4 rounded-lg text-white font-semibold transition-all overflow-hidden
                ${!file || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md'}`}
            >
                {uploading && (
                    <motion.span
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    />
                )}

                <span className="relative">
                    {uploading ? 'Processing with Gemini AI...' : 'Upload & Analyze'}
                </span>
            </motion.button>
        </motion.div>
    );
};

export default FileUpload;
