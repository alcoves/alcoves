function QualitySelector({ hls }) {
  if (!hls?.levels?.length) return <div />;

  return (
    <select
      id='visibility'
      name='visibility'
      defaultValue={hls.currentLevel}
      onChange={(e) => {
        hls.currentLevel = e.target.value;
      }}
    >
      {hls.levels.map((l, i) => (
        <option
          value={i}
          key={l.name}
        >
          {l.name}
        </option>
      ))}
    </select>
  );
}

export default QualitySelector;