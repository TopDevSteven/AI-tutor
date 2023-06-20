import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {CircularProgress } from '@mui/material';
import axios from 'axios';
import "./CreateModel.css"

const CreateModel = () => {
    const [activeUpload, setActiveUpload] = React.useState(false);
    const [onLoading, setOnLoading] = React.useState(false);

    const handleUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('files', file);

        if (file) {
            axios.post('/api/qa/upload/', formData)
            .then(response => {
                console.log(response)
                setOnLoading(false)
            })
            .catch(error => {
                console.error(error)
                setOnLoading(false)
            });
        };
    };

    return (
        <div  className='createmodel-container'>
            <div className='libraryname'>
                <Box
                    sx={{
                        display: 'block',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '100%',
                        // background: 'linear-gradient(45deg, #ff6b6b, #c72e9a)',
                        margin: "30px",
                        animation: 'gradientAnimation 10s ease infinite',
                    }}
                >
                    <TextField
                        id="standard-multiline-flexible"
                        label="Microlearning library"
                        variant="standard"
                        sx={{
                            width: "100%",
                            '& .MuiInputBase-input': {
                                fontSize: 30, // change the font size here
                                height: 50, // change the height here
                                fontFamily: 'cursive',

                            },
                        }}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (value.length !==0){
                                setActiveUpload(true)
                            } else {
                                setActiveUpload(false)
                            }
                        }
                    }
                    />
                        {
                        activeUpload && 
                        <div className='upload-container'>
                            {/* < */}

                            <input
                                accept="pdf/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={handleUpload}
                            />
                            <label htmlFor="raised-button-file">
                                <Button 
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}>
                                    Upload
                                </Button>
                            </label>
                        </div>
                        }
                </Box>
            </div>
        </div>
    )
}

export default CreateModel;