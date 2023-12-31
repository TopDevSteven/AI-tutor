import React, { useState }from 'react'
import { MdOutlineArrowBack } from 'react-icons/md'
import { ReactComponent as UploadIcon} from '../../../assets/images/uploadFileImage.svg'
import { ReactComponent as DownloadIcon} from '../../../assets/images/download.svg'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import './CreateModel.scss'
import 'react-toastify/dist/ReactToastify.css';

export const CreateModel = ({setActiveTab}) => {
    const [topic, setTopic] = useState("");
    const [showSelector, setShowSelector] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showUrl, setShowUrl] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [train, setTrain] = useState(false);
    const [url, setUrl] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const isUploadDisabled = () => {
        return !selectedFile && !url;
    }

    const handleUpload = () => {
        const date = new Date().toISOString().split("T")[0]
        if (showUpload){
            if (selectedFile != null) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('topic', topic)
                formData.append('date', date)
                formData.append('type', 'Document')
                setTrain(true)
                axios.post('/api/qa/upload/', formData)
                .then(response => {
                    toast(response.data["message"])
                    setTrain(false)
                    // setOnLoading(false)
                })
                .catch(error => {
                    console.error(error)
                    setTrain(false)
                    // setOnLoading(false)
                });
            }
            else {
                return ;
            }
        }
        else if (showUrl) {
            if (url != "") {
                setTrain(true)
                axios.post('api/qa/upload/', {web_url: url, topic, date, type: "Web URL"})
                .then(response => {
                    toast(response.data["message"])
                    setTrain(false)
                })
                .catch(error => {
                    console.error(error)
                    setTrain(false)
                })
            }
            else {
                return ;
            }
        }
        else {
            return ;
        }
    }

    const handleSelectTopic = (event) => {
        setShowSelector(true);
        setTopic(event.target.value);
    }

    const handleGoBack = () => {
        setActiveTab(0)
    }

    return (
        <div className='create'>
            <button className='cancel'><MdOutlineArrowBack onClick={handleGoBack} /></button>
            <div className='form'>
                <input type='text' placeholder='Topic Title' className='title' onChange={handleSelectTopic} />
                <div className='selector' style={showSelector ? null : {display: "none"}}>
                    <div onClick={() => {setShowUpload(true); setShowUrl(false)}}>Upload file</div>
                    <div onClick={() => {setShowUrl(true); setShowUpload(false)}}>Use URL</div>
                    {/* <div>Type text</div> */}

                </div>
                {/* <div className='explanation'>
                50 pages maximum for documents, 50 minutes maximum for audio/video (AI analysis is done only when there are at least 500 characters, up to 50 000 characters) 
                </div> */}
                <div className="file-upload-container" style={showUpload ? null : {display:"none"}} >
                    {!selectedFile ? (
                        <label htmlFor="file-upload-input" className="upload-label">
                        <UploadIcon className="upload-icon" />
                        <span className="upload-text">Upload document</span>
                        </label>
                    ) : (
                        <label className="file-info">
                            <UploadIcon className="upload-icon" />
                            <span className="file-name">{selectedFile.name}</span>
                        </label>
                    )}
                    <input
                        id="file-upload-input"
                        type="file"
                        accept=".pdf, .doc, .docx, .avi, .mp3, .csv, .jpg"
                        className="file-upload-input"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="add-url-container" style={showUrl ? null : {display:"none"}} >
                    <label className="url-label">
                            <DownloadIcon className="url-icon" />
                            {/* <span className="upload-text">Add URL</span> */}
                            <input className='add-url' onChange={(e) => setUrl(e.target.value)} placeholder='Add URL' />
                    </label>
                </div>
                <div className='uploadButton' style={showUpload || showUrl ? null : {display: "none"}}>
                    <button className='upload-button' onClick={handleUpload} disabled={isUploadDisabled()}>Upload & Train</button>
                    {train && (
                        <div className="loading-bar">
                            <div className="loading-bar-progress" />
                        </div>
                    )}
                    <ToastContainer 
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </div>
        </div>
    )
}
