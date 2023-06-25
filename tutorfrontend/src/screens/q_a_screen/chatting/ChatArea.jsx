import React, { useState } from 'react';
import axios from 'axios';
import { FiCopy , FiCheck } from 'react-icons/fi';
import { Typography, TextField, Button, Select, MenuItem ,CircularProgress } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import "./ChatArea.css"

const ChatArea = ({topic, returnToRecordModel}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMessageChange = (event) => {
    setInput(event.target.value);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      text: input,
      user: 'User',
    };

    setMessages([...messages, newMessage]);
    setLoading(true)

    axios.post(`/api/qa/query/`, { text: input, maintopic: topic })
      .then((response) => {
        const data = response.data;
        const botMessage = {
          text: data.message,
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

  return (
    <div className="chatarea">
         <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#f5f5f5',  // Or any color you prefer for background
                borderRadius: '10px',  // Rounded corners
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Topic: {topic}
            </Typography>
            <Button variant="outlined" onClick={returnToRecordModel}>
                Return
            </Button>
        </Box>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user === 'Bot' ? 'bot-message' : 'user-message'}`}>
          <div className="message-container">
            <div className="message-text">{message.text}</div>
            {/* {message.user === 'Bot' && renderCopyIcon(message, index)} */}
          </div>
        </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit} className="form-wrapper">
        <TextField
            value={input}
            onChange={handleMessageChange}
            className="code-text-input "
            variant="outlined"
            multiline
            placeholder='Text here ...'
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
                            disabled={!input.trim()}
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

export default ChatArea;
