export default function Notifications({ notifs }) {
  return (
    <div className="notif-wrap">
      {notifs.map(n => (
        <div key={n.id} className={`notif ${n.type}`}>
          <div className="ntitle" style={{ color: n.type === 'err' ? '#ff2244' : n.type === 'info' ? '#00c8ff' : '#00ff88' }}>
            {n.title}
          </div>
          <div className="nmsg">{n.msg}</div>
        </div>
      ))}
    </div>
  );
}
