import '../scss/Message.scss';

const Message = ({ message: { user, text }, name }) => {
  const sendByCurrentUser = user === name;

  return (
    <div className={`message-container ${sendByCurrentUser ? 'self-sender-container': ''}`}>
      <div className={`message ${sendByCurrentUser ? 'self-sender' : ''}`}>
        { text }
      </div>
      { !sendByCurrentUser &&
        <div className="message-sender">
          { user }
        </div>
      }
    </div>
  );
}

export default Message;
