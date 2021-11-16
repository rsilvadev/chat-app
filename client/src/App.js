import { useEffect, useRef, useState } from 'react';
import './scss/App.scss';
import Login from './components/Login';
import Message from './components/Message';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [isUserSet, setIsUserSet] = useState(false);
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    if(isUserSet) {
      socket.current = io('163.172.164.215:3000');
  
      socket.current.emit('join', { name: user, room }, (error) => {
        console.log(`error joining chat: ${error}`);
      });
  
      socket.current.on('getRoomData', ({ users }) => {
        setUsers(users);

        console.log(users);
      });

      socket.current.on('message', message => {
        setMessages((prevState) => (
          [...prevState, message]
        ));
        scrollRef.current?.scrollIntoView({ behaviour: 'smooth', block: 'end' });
      });
    }
  }, [isUserSet]);

  useEffect(() => {
    if(isUserSet) {
      socket.current.emit('userTyping', { room, isTyping }, (error) => {
        console.log(`error typing: ${error}`);
      });
    }
  }, [isTyping]);

  const setUsername = (e) => {
    e.preventDefault();

    if(user) {
      setIsUserSet(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if(message) {
      socket.current.emit('sendMessage', { message, room });
  
      setMessage('');
      setIsTyping(false);
    }
  };

  const changeMessage = (e) => {
    setMessage(e.target.value);

    if(e.target.value !== '') {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      {isUserSet ? 
        <div style={{ width: '80%', height: '80vh' }}>
          <div className="chat-container">
            <div className="messages-container">
              <div className="messages" ref={scrollRef}>
                {messages.map((msg, idx) => <Message key={idx} message={msg} name={user} />)}
              </div>
            </div>
            <form className="send-msg-container" onSubmit={(e) => sendMessage(e)}>
              <div className="text-input-container">
                <input type="text" value={message} onChange={(e) => changeMessage(e)}/>
              </div>
              <div className="send-icon-container">
                <button className="send-icon" type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', color: 'white' }}>
            <span style={{ fontWeight: 'bold' }}>online</span>
            <div style={{ display: 'flex' }}>
              { users.map((userObj, idx) => 
                <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', marginRight: '4px', borderRadius: '50%', backgroundColor: '#25D366' }}></div>
                  <span>{ userObj.name }{ userObj.name === user ? ' (me)' : '' }{ userObj.name !== user && userObj.isTyping ? ' (is typing...)' : '' }</span>
                </div>
              )}
            </div>
          </div>
        </div>
        :
        <Login 
          user={user} 
          setUser={setUser} 
          room={room} 
          setRoom={setRoom} 
          setUsername={setUsername} 
        />
      }
		</div>
	);
}

export default App;
