import React, { useState } from 'react';
import axios from 'axios';
import { FiCopy , FiCheck } from 'react-icons/fi';
import { Typography, TextField, Button, Select, MenuItem ,CircularProgress } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import "./Chatarea.css"

const Chatarea = () => {
  const [input, setInput] = useState('');
  const [select, setSelect] = useState('');
  const [messages, setMessages] = useState([]);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);
  const [loading, setLoading] = useState(false);

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

    axios.post('/api/codegenerator/', { text: input })
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
        console.error("There was an error!", error);
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

  return (
    <div className="chatarea">
      <Typography variant="h2" className="title">Chatbot</Typography>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user === 'Bot' ? 'bot-message' : 'user-message'}`}>
          <div className="message-container">
            <pre className="message-text">{message.text}</pre>
            {message.user === 'Bot' && renderCopyIcon(message, index)}
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
          <MenuItem value="/start">/start</MenuItem>
          <MenuItem value="/continue">/continue</MenuItem>
          <MenuItem value="/call">/call</MenuItem>
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

export default Chatarea;
