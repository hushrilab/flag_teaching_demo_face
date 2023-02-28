import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';
import smile_01 from './smile/smile_01.jpg';
import smile_02 from './smile/smile_02.jpg';
import smile_03 from './smile/smile_03.jpg';
import smile_04 from './smile/smile_04.jpg';
import smile_05 from './smile/smile_05.jpg';
import happy_01 from './happy/happy_01.jpg';
import happy_02 from './happy/happy_02.jpg';
import happy_03 from './happy/happy_03.jpg';
import happy_04 from './happy/happy_04.jpg';
import happy_05 from './happy/happy_05.jpg';
function ImageSequence() {
  const [index, setIndex] = useState(0);
  const [isHappy, setIsHappy] = useState(true);
  const smile_faces = [smile_01, smile_02, smile_03, smile_04, smile_05];
  const happy_faces = [happy_01, happy_02, happy_03, happy_04, happy_05];

  useEffect(() => {
    // Connecting to ROS
    const ros = new ROSLIB.Ros({
      url : 'ws://127.0.0.1:9090'
    });

    ros.on('connection', function() {
      console.log('Connected to websocket server.');
    });

    ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      console.log('Connection to websocket server closed.');
    });

    // Subscribing to a Topic
    const expression = new ROSLIB.Topic({
      ros : ros,
      name : '/expression',
      messageType : 'std_msgs/String'
    });

    expression.subscribe(function(message) {
      setIsHappy(message.data === 'happy');
    });

    // Clean up function
    return () => {
      expression.unsubscribe();
      ros.close();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const faces = isHappy ? happy_faces : smile_faces;
      setIndex((index) => (index + 1) % faces.length);
    }, 300);

    return () => clearInterval(intervalId);
  }, [isHappy]);

  const faces = isHappy ? happy_faces : smile_faces;

  return <img src={faces[index]} style={{ width: '100%', height: 'auto' }} />;
}


function App() {
  return (
    <div className="App">
      <ImageSequence />
    </div>
  );
}

export default App;