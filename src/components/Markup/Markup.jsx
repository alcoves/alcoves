import React from 'react';
import { Header } from 'semantic-ui-react';

export default () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1> Header 1</h1>
      <h2> Header 2</h2>
      <h3> Header 3</h3>
      <h4> Header 4</h4>
      <h5> Header 5</h5>
      <h6> Header 6</h6>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus ipsum magna, vel
        ultrices enim ultricies eu. Integer efficitur diam et ante condimentum, quis scelerisque
        ipsum venenatis. Donec non enim turpis. Vivamus euismod nibh vel ante finibus pretium.
        Vestibulum a urna egestas elit vehicula imperdiet. In non nulla ipsum. Morbi dictum lacus
        vel lacinia vestibulum. Quisque pretium dolor vitae ante dapibus convallis. Nullam nec lacus
        diam. Nulla egestas tortor at lacus euismod suscipit. Proin consectetur, neque in dapibus
        consequat, tellus ante mollis sapien, vel vehicula elit diam in massa. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Sed ultricies hendrerit risus, volutpat laoreet lectus
        posuere eu. Cras sit amet blandit turpis, vitae finibus neque. Nullam vel malesuada urna.
        Morbi ultricies placerat nisl ac mattis.
      </p>
      <code>
        {`const helloWorld = () => {
          console.log('hey there!');
        };`}
      </code>
    </div>
  );
};
