import React, { useState, useEffect } from 'react'
import { getDimensions } from '../../../lib/metadata'
import { MediaPlayer, MediaOutlet } from '@vidstack/react'

interface VideoProps {
  options: {
    // poster: string;
    source: string
    // metadata: any;
  }
}

const VidstackPlayer: React.FC<VideoProps> = ({ options }) => {
  // const dimensions = getDimensions(options.metadata);
  const [maxWidth, setMaxWidth] = useState<number>(0)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    function handleResize() {
      const w = 1280
      const h = 720
      const parentWidth = window.innerWidth
      const parentHeight = window.innerHeight

      // calculate the aspect ratio of the video
      const aspectRatio = w / h

      // calculate the maximum possible width and height that the video can occupy
      const maxPossibleWidth = parentWidth
      const maxPossibleHeight = parentHeight

      // calculate the maximum width based on the height of the video
      const maxWidthBasedOnHeight = maxPossibleHeight * aspectRatio
      // calculate the maximum height based on the width of the video
      const maxHeightBasedOnWidth = maxPossibleWidth / aspectRatio

      // set the maximum width and height based on whichever is smaller
      if (maxWidthBasedOnHeight < maxPossibleWidth) {
        setMaxWidth(maxWidthBasedOnHeight)
        setMaxHeight(maxPossibleHeight)
      } else {
        setMaxWidth(maxPossibleWidth)
        setMaxHeight(maxHeightBasedOnWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <MediaPlayer
          controls
          src={options.source}
          // poster={options.poster}
        >
          <MediaOutlet />
        </MediaPlayer>
      </div>
    </div>
  )
}

export default VidstackPlayer

// import { useEffect, useState } from "react";
// import { getDimensions } from "../../../lib/metadata";
// import { MediaPlayer, MediaOutlet } from "@vidstack/react";

// import "vidstack/styles/base.css";

// interface VidstackPlayerProps {
//   options: {
//     poster: string;
//     source: string;
//     metadata: any;
//   };
// }

// export default function VidstackPlayer({ options }: VidstackPlayerProps) {
// 	const dimensions = getDimensions(options.metadata);
// 	const [maxWidth, setMaxWidth] = useState(0);
// 	const [visibility, setVisibility] = useState("hidden" as DocumentVisibilityState);

// 	useEffect(() => {
// 		function handleResize() {
//       const w = dimensions.width;
//       const h = dimensions.height;
//       const minH = 200;
//       const padding = 100;

//       let height = h;
//       if (h > window.innerHeight - padding) {
//         height = window.innerHeight - padding;
//         const minHeight = h < minH ? h : minH;
//         if (height < minHeight) {
//           height = minHeight;
//         }
//       }

//       setMaxWidth((w / h) * height);
//       setVisibility("visible");
// 		}

// 		handleResize();
// 		window.addEventListener("resize", handleResize);
// 		return () => window.removeEventListener("resize", handleResize);
// 	}, []);

// 	return (
// 		<div style={{ maxWidth, visibility }}>
// 			<MediaPlayer controls src={options.source} poster={options.poster}>
// 				<MediaOutlet />
// 			</MediaPlayer>
// 		</div>
// 	);
// }
