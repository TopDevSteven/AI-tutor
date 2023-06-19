import React, { useState } from 'react';
import "./LessonLevel.css"
import Lessonarea from '../ChatComponent/Lesson';

import {
    Button,
    Modal,
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
  } from '@mui/material';

const LessonLevel = () => {
  const [open, setOpen] = useState(false);
  const [startLesson, setStartLesson] = useState(false);
  const [labels, setLabels] = useState({
    label1: '',
    label2: '',
    label3: '',
    label4: '',
    label5: '',
  });
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    option5: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const updatedLabels = {
      label1: options.option1,
      label2: options.option2,
      label3: options.option3,
      label4: options.option4,
      label5: options.option5,
    };
    setLabels(updatedLabels);
    handleClose();
  };

  const handleOptionChange = (option) => (event) => {
    setOptions({ ...options, [option]: event.target.value });
  };

  const handleStartLessn = () => {
    setStartLesson(true)
  }

  return (
    <div className='lessonapp-container'>
        <div className='lessonarea-container'>
            <Lessonarea labels={labels} startLesson={startLesson}/>
        </div>
        <div className='setting-wrap'>
        <div className='setting-container'>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6">Depth: </Typography>
                        <Typography variant="h6">{labels.label1}</Typography>
                    </div>
                </Grid>
                <Grid item>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6">Learning Style:</Typography>
                        <Typography variant="h6">{labels.label2}</Typography>
                    </div >
                </Grid>
                <Grid item>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6">Communication Style</Typography>
                        <Typography variant="h6">{labels.label3}</Typography>
                    </div>
                </Grid>
                <Grid item>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6">Tone Style:</Typography>
                        <Typography variant="h6">{labels.label4}</Typography>
                    </div >
                    
                </Grid>
                <Grid item>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6">Reasoning Framework:</Typography>
                        <Typography variant="h6">{labels.label5}</Typography>
                    </div>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={handleOpen} fullWidth>
                    Settings
                    </Button>
                </Grid>
                <Grid item>
                    <Button 
                        variant="contained" 
                        onClick={handleStartLessn} 
                        color="primary" 
                        fullWidth
                        disabled={!labels.label1.trim() || !labels.label2.trim()||!labels.label3.trim()||!labels.label4.trim()||!labels.label5.trim()}
                        style = {{
                                // Styles for disabled button
                              ...(!labels.label1.trim() || !labels.label2.trim() || !labels.label3.trim() || !labels.label4.trim() || !labels.label5.trim() ? { background: 'grey', cursor: 'not-allowed' } : {})
                        }}
                    >
                    Start Lesson
                    </Button>
                </Grid>
            </Grid>
        </div>  
      <Modal open={open} onClose={handleClose} animation="fade">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: '300px',
            maxWidth: '500px',
            borderRadius: '25px'
          }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item>
                <Typography variant="h5">Lesson Level&Style</Typography>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Depth</InputLabel>
                <Select
                  value={options.option1}
                  onChange={handleOptionChange('option1')}
                >
                  <MenuItem value="Elementary (Grade 1-6)">Elementary (Grade 1-6)</MenuItem>
                  <MenuItem value="Middle School (Grade 7-9)">Middle School (Grade 7-9)</MenuItem>
                  <MenuItem value="High School (Grade 10-12)">High School (Grade 10-12)</MenuItem>
                  <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                  <MenuItem value="Master's">Master's</MenuItem>
                  <MenuItem value="Doctoral Candidate (Ph.D Candidate)">Doctoral Candidate (Ph.D Candidate)</MenuItem>
                  <MenuItem value="Postdoc">Postdoc</MenuItem>
                  <MenuItem value="Ph.D">Ph.D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Learning Style</InputLabel>
                <Select
                  value={options.option2}
                  onChange={handleOptionChange('option2')}
                >
                  <MenuItem value="Visual">Visual</MenuItem>
                  <MenuItem value="Verbal">Verbal</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Intuitive">Intuitive</MenuItem>
                  <MenuItem value="Reflective">Reflective</MenuItem>
                  <MenuItem value="Global">Global</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Communication Style</InputLabel>
                <Select
                  value={options.option3}
                  onChange={handleOptionChange('option3')}
                >
                  <MenuItem value="Formal">Formal</MenuItem>
                  <MenuItem value="Textbook">Textbook</MenuItem>
                  <MenuItem value="Layman">Layman</MenuItem>
                  <MenuItem value="Story Telling">Story Telling</MenuItem>
                  <MenuItem value="Socratic">Socratic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Tone Style</InputLabel>
                <Select
                  value={options.option4}
                  onChange={handleOptionChange('option4')}
                >
                  <MenuItem value="Encouraging">Encouraging</MenuItem>
                  <MenuItem value="Neutral">Neutral</MenuItem>
                  <MenuItem value="Informative">Informative</MenuItem>
                  <MenuItem value="Friendly">Friendly</MenuItem>
                  <MenuItem value="Humorous">Humorous</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel>Reasoning Framework</InputLabel>
                <Select
                  value={options.option5}
                  onChange={handleOptionChange('option5')}
                >
                  <MenuItem value="Deductive">Deductive</MenuItem>
                  <MenuItem value="Inductive">Inductive</MenuItem>
                  <MenuItem value="Abductive">Abductive</MenuItem>
                  <MenuItem value="Analogical">Analogical</MenuItem>
                  <MenuItem value="Causal">Causal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleSave} fullWidth>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
        </div>
        
    </div>
  );
};

export default LessonLevel;
