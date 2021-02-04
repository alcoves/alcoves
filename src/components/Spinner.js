export default function Spinner(props = {}) {
  return (
    <div
      style={{
        borderTopColor: '#CBD5E1',
        animationDuration: '1000ms',
        animationTimingFunction: 'linear',
        animationName: 'spinner_animation',
        animationIterationCount: 'infinite',
      }}
      className={`ease-linear rounded-full border-4 border-t-4 border-gray-800 h-12 w-12 ${{ ...props }}`}
    />
  );
}