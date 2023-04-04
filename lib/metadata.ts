export function getDimensions(metadata): { width: number; height: number } {
	let width = 0;
	let height = 0;

	if (!metadata?.streams.length) return { width, height };

	for (const stream of metadata.streams) {
		if (stream.width) {
			width = stream.width;
		} else if (stream.coded_width) {
			width = stream.coded_width;
		}

		if (stream.height) {
			height = stream.height;
		} else if (stream.coded_height) {
			height = stream.coded_height;
		}
	}

	return { width, height };
}
