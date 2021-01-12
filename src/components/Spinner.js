import styled from 'styled-components';

const MeterAnimation = styled.svg`
  border-top-color: #3498db;
  animation-name: spinner_animation;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spinner_animation { 
    0% {
      transform: rotate(0deg) scale(1,1); 
    }
    50% {
      transform: rotate(360deg) scale(1.1, 1.1); 
    }
    100% {
      transform: rotate(720deg) scale(1, 1); 
    }
  }
`;

export default function Spinner(props = {}) {
  return (
    <MeterAnimation
      className={`ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 ${{...props}}`}
    />
  );
}