import '../scss/Login.scss';

const Login = ({ user, setUser, room, setRoom, setUsername }) => {
  return (
    <div className="login-container">
      <form onSubmit={(e) => setUsername(e)}>
        <label>Username</label>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
        <label>Room</label>
        <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
        <button type="submit">Start chatting <i className="fas fa-sign-in-alt"></i></button>
      </form>
    </div>
  );
};

export default Login;
