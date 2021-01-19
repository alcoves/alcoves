function QualitySelector({ hls }) {
  function handleLevel(i) {
    console.log('setting load level', i);
    hls.currentLevel = i;
  }

  if (!hls?.levels?.length) return <div />;

  return (
    <select
      id='visibility'
      name='visibility'
      onChange={(e) => handleLevel(e.target.value)}
      className='cursor-pointer bg-transparent text-gray-200 text-sm w-full font-semibold rounded-md'
    >
      {hls.levels.map((l, i) => (
        <option
          value={i}
          key={l.name}
          className='bg-gray-800'
          selected={hls.currentLevel === i}
        >
          {l.name}
        </option>
      ))}
    </select>
  );
}

export default QualitySelector;