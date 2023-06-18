import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCopy , FiCheck } from 'react-icons/fi';
import { Typography, TextField, Button, Select, MenuItem ,CircularProgress } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';

import "./Lesson.css"

const Lessonarea = ({labels, startLesson}) => {
  const [input, setInput] = useState('');
  const [select, setSelect] = useState('');
  const [messages, setMessages] = useState([]);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lessonStyle, setLessonStyle] = useState({
    depth:"",
    lstyle: "",
    cstyle: "",
    tstyle: "",
    rframework: ""
  })

  const handleMessageChange = (event) => {
    setInput(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelect(event.target.value);
  }

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      text: input,
      user: 'User',
    };

    setMessages([...messages, newMessage]);
    setLoading(true)

    axios.post('/api/lesson/', { text: input })
      .then((response) => {
        const data = response.data;
        const botMessage = {
          text: data.code,
          user: 'Bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        console.log(data);
      })
      .catch((error) => {
        const botMessage = {
          text: "Net Error, or non-valid API-key",
          user: 'Bot',
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      })
      .finally(() => {
        setLoading(false)
      });


    setInput('');
  };

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageIndex(index)
  }

  const renderCopyIcon = (message, index) => {
    if (copiedMessageIndex === index) {
      return <FiCheck className="copy-icon" />;
    } else {
      return (
        <FiCopy onClick={() => handleCopyMessage(message.text, index)} className="copy-icon" >
          <p>copy code</p>
        </FiCopy>
      );
    }
  };

  useEffect(() => {
    // setLessonStyle({
    //   depth: labels.label1,
    //   lstyle: labels.label2,
    //   cstyle: labels.label3,
    //   tstyle: labels.label4,
    //   rframework: labels.label5,
    // });

    console.log(labels)
  }, [labels]);

  return (
      <div className="chatarea">
        <Typography variant="h2" className="title"></Typography>
        <div className="messages">
          {
            startLesson && 
            <div className='message bot-message'>
              <div className='message-container'>
                <pre className='message-text'>
                Hello! My name is EdTech. Inc, your personalized AI Tutor.<br />
                I am running version 2.6.2 made by JushBJJ. <br />
                Your current preferences are:<br />
                🎯Depth: {labels.label1}<br />
                🧠Learning Style: {labels.label2}<br />
                🗣️Communication Style: {labels.label3}<br />
                🌟Tone Style: {labels.label4}<br />
                🔎Reasoning Framework: {labels.label5}<br />
                😀Emojis: Enabled (Default)<br />
                🌐Language: English (Default)<br />

                You can change the language by using the /language [lang] command.<br />
                For example, you can change the language to Chinese by typing /language Chinese.<br />
                Let's begin by saying /plan [Any topic] to create a lesson plan for you.<br />
                </pre>
              </div>
            </div>
          }
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.user === 'Bot' ? 'bot-message' : 'user-message'}`}>
              <div className="message-container">
                <pre className="message-text">{message.text}</pre>
                {/* {message.user === 'Bot' && renderCopyIcon(message, index)} */}
            </div>
          </div>
          ))}
        </div>
        <form onSubmit={handleMessageSubmit} className="form-wrapper">
          <Select
            value={select}
            onChange={handleSelectChange}
            className="select-input"
            variant="outlined"
          >
            <MenuItem value="/plan">/plan</MenuItem>
            <MenuItem value="/start">/start</MenuItem>
            <MenuItem value="/continue">/continue</MenuItem>
            <MenuItem value="/test">/test</MenuItem>
          </Select>
          <TextField
              value={input}
              onChange={handleMessageChange}
              className="text-input"
              variant="outlined"
              multiline
              InputProps={{
                  disableUnderline: true, // Removes the underline
                  style: { // Adjusts the style of the TextField's container
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center', // Aligns text to the center vertically
                  },
                  inputProps: { // Adjusts the style of the input itself
                  style: {
                      height: '100%',
                      padding: '0 10px', // Adds horizontal padding
                  }
                  },
                  endAdornment: (
                      <InputAdornment position="end">
                          {loading ? (
                          <CircularProgress size={24} color="primary" />
                          ) : (
                          <Button
                              type="submit"
                              variant="contained"
                              className="submit-btn"
                              disabled={!input.trim() || !select.trim()}
                              style={{
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              }}
                          >
                              Send
                          </Button>
                          )}
                      </InputAdornment>
                  ),
              }}
          />
        </form>
      </div>
  );
}

Lessonarea.props ={
  labels: PropTypes.array.isRequired,
  startLesson: PropTypes.bool.isRequired,
}

export default Lessonarea;
