function QualitySelector({ hls }) {
  if (!hls?.levels?.length) return <div />;

  return (
    <select
      id='visibility'
      name='visibility'
      defaultValue={hls.currentLevel}
      className='cursor-pointer bg-transparent text-gray-200 text-sm w-full font-semibold rounded-md'
      onChange={(e) => {
        hls.currentLevel = e.target.value;
      }}
    >
      {hls.levels.map((l, i) => (
        <option
          value={i}
          key={l.name}
          className='bg-gray-800'
        >
          {l.name}
        </option>
      ))}
    </select>
  );
}

export default QualitySelector;