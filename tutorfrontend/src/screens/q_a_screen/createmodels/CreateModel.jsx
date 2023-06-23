import React, { useState }from 'react'
import { MdOutlineArrowBack } from 'react-icons/md'
import { ReactComponent as UploadIcon} from '../../../assets/images/uploadFileImage.svg'
import axios from 'axios'
import './CreateModel.scss'

export const CreateModel = ({setActiveTab}) => {
    const [topic, setTopic] = useState("");
    const [showSelector, setShowSelector] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [train, setTrain] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('topic', topic)
        setTrain(true)

        if (selectedFile != null) {
            axios.post('/api/qa/upload/', formData)
            .then(response => {
                console.log(response)
                setTrain(false)
                // setOnLoading(false)
            })
            .catch(error => {
                console.error(error)
                // setOnLoading(false)
            });
        };
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
                    <div onClick={()=> setShowUpload(true)}>Upload file</div>
                    <div>Use URL</div>
                    <div>Type text</div>

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
                <div className='uploadButton' style={showUpload ? null : {display: "none"}}>
                    <button className='upload-button' onClick={handleUpload}>Upload & Train</button>
                    {train && (
                        <div className="loading-bar">
                            <div className="loading-bar-progress" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
