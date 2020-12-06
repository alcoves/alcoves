

export default function Icon(props) {
  return (
    <svg
      width='24'
      height='24'
      fill='none'
      strokeWidth='2'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <use xlinkHref={`feather.svg#${props.name}`} />
    </svg>
  );
}