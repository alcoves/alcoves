export default function FileRejections({ fileRejections }: { fileRejections: any[] }) {
	if (fileRejections.length) {
		return (
			<div className='flex py-2'>
				{fileRejections.map((f) => {
					console.error(f);
					return (
						<div key={f.file.path}>
							<p>{f?.errors[0]?.code}</p>
							<p>{f.file.path}</p>
						</div>
					);
				})}
			</div>
		);
	}

	return null;
}
