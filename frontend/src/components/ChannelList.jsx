function ChannelList({ channels, onSelect }) {
  // Kelompokkan berdasarkan negara
  const grouped = {};
  channels.forEach((channel) => {
    const key = channel.country || 'Unknown';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(channel);
  });

  return (
    <div>
      {Object.entries(grouped).map(([country, chans]) => (
        <div key={country} style={{ marginBottom: '1.5rem' }}>
          <h3>{country}</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {chans.map((ch) => (
              <li key={ch.id} style={{ marginBottom: '0.3rem' }}>
                <button onClick={() => onSelect(ch)} style={{ cursor: 'pointer' }}>
                  {ch.name} {ch.group && <small>({ch.group})</small>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ChannelList;
