import { useEffect, } from 'react';
import shaka from 'shaka-player';

export default function StudioVideoPlayer({ link }) {
  useEffect(() => {
    const video = document.getElementById('studioVideoPlayer');
    const player = new shaka.Player(video);

    player.configure({
      manifest: {
        dash: {
          ignoreEmptyAdaptationSet: true,
        },
      },
    });

    player.load(link).then(() => {
      console.log('The video has now been loaded!');
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <video
      style={{ width: '100%', height: '100%', background: 'black' }}
      id='studioVideoPlayer' controls width='100%' height='100%'
    />
  );
}