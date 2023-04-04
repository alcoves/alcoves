"use client";

import "vidstack/styles/base.css";
// the following styles are optional - remove to go headless.
import "vidstack/styles/ui/buttons.css";
import "vidstack/styles/ui/sliders.css";

import { useEffect, useState } from "react";
import { getDimensions } from "../../../lib/metadata";
import { MediaPlayer, MediaOutlet } from "@vidstack/react";

export default function VidstackPlayer({
	options,
}: {
	options: { poster: string; source: string; metadata: any };
}) {
	const dimensions = getDimensions(options.metadata);
	const [maxWidth, setMaxWidth] = useState(0);
	const [visibility, setVisibility] = useState("hidden" as DocumentVisibilityState);

	useEffect(() => {
		function handleResize() {
			let height;
			const w = dimensions.width;
			const h = dimensions.height;
			const minH = 200;
			const padding = 100;

			if (h > window.innerHeight - padding) {
				height = window.innerHeight - padding;
				const minHeight = h < minH ? h : minH;
				if (height < minHeight) {
					height = minHeight;
				}
			} else {
				height = h;
			}

			setMaxWidth((w / h) * height);
			setVisibility("visible");
		}

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div style={{ maxWidth, visibility }}>
			<MediaPlayer controls src={options.source} poster={options.poster}>
				<MediaOutlet />
			</MediaPlayer>
		</div>
	);
}
