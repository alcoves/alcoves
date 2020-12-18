import { Meter, } from 'grommet';
import styled from 'styled-components';

const MeterAnimation = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  animation-name: spin;
  animation-duration: 1000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spin { 
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

export default function Spinner(props) {
  return (
    <MeterAnimation>
      <Meter
        round
        values={[{
          value: 80,
        }]}
        type='circle'
        size='xsmall'
        thickness='xsmall'
        {...props}
      />
    </MeterAnimation>
  );
}