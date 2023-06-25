import React, { useEffect, useState } from 'react'
import './ViewModel.scss'
import { RecordModel } from '../recordmodels/RecordModel'
import axios from 'axios'
import ChatArea from '../chatting/ChatArea'

export const ViewModel = () => {

    const [topics, setTopics] = useState([]);
    const [dates, setDates] = useState([]);
    const [types, setTypes] = useState([]);
    const [onChatArea, setOnChatArea] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null)

    const  fetchRecord = async () => {
        try {
            const response = await axios.get('api/qa/records/');
            setTopics(response.data.topic);
            setDates(response.data.date);
            setTypes(response.data.type);
        }catch(error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        fetchRecord()
    }, [])

    return (
        <div className='library-wrapper'>
            <div className='header'>

                <div className='title'>
                    {/* <h2>Microlearning library</h2>
                    <div className='credit-wrapper'>
                        <div className='credit'>4 credits</div>
                    </div> */}
                </div>
                <div className='head'>
                    <div className='content'>Content</div>
                    <div className='filters'>
                        <div className='type'>Type</div>
                        <div className='status'>Status</div>
                        <div className='date'>Date</div>
                    </div>
                    <div className='actions'></div>
                </div>
                
            </div>
            <div className='body'>
                {/* {data.map((item) => (<RecordModel name={item.name} type={item.type} status={item.status} date={item.date} spec={item.spec}/>))} */}
                {!onChatArea && topics && topics.map((topic, index) => (
                    <div className='record-container'>
                        <RecordModel 
                            name={topic} 
                            type={types[index]}
                            status="Ready" 
                            date={dates[index]}
                            spec="" 
                            onClick={() => {setOnChatArea(true); setSelectedTopic(topic)}}
                        />
                    </div>))
                }
                {onChatArea && <ChatArea topic={selectedTopic} returnToRecordModel={() => setOnChatArea(false)}/>}
            </div>

        </div>
    )
}
