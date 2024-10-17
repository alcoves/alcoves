import { useRef } from "react";
import {
	Button,
	Flex,
	Heading,
	Progress,
	type ToastId,
	useToast,
	type UseToastOptions,
} from "@chakra-ui/react";
import {
	completeUpload,
	createAsset,
	getSignedUrlChunk,
} from "../../features/api";
import { splitFileIntoChunks } from "../../utils/chunk";

export default function UploadRoute() {
	const toast = useToast();
	const toastIdRef = useRef<ToastId>();
	const fileInputRef = useRef<HTMLInputElement>(null);

	function updateToast(id: ToastId, options: UseToastOptions) {
		if (toastIdRef.current) {
			toast.update(id, options);
		}
	}

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0] || null;
		if (!file) return;
		console.log(file);

		toastIdRef.current = toast({
			title: "Upload Starting",
			description: `Uploading ${file.name}`,
			status: "info",
			isClosable: false,
		});

		try {
			const response = await createAsset({
				size: file.size,
				title: file.name,
				contentType: file.type,
			});

			const { id: assetId, uploadId } = response.payload;

			const fileChunks = splitFileIntoChunks(file);
			console.log(fileChunks, fileChunks.length);

			updateToast(toastIdRef.current, {
				title: "Upload Processing",
				description: `Uploading ${file.name}`,
				status: "info",
				isClosable: false,
			});

			for (let i = 0; i < fileChunks.length; i++) {
				const chunk = fileChunks[i];
				console.log(chunk, uploadId);
				const { payload: signedUrl } = await getSignedUrlChunk({
					assetId,
					uploadId,
					partId: i + 1, // 1-indexed
				});

				updateToast(toastIdRef.current, {
					title: "Uploading",
					description: (
						<Progress
							w="100%"
							isAnimated
							size="sm"
							rounded="md"
							colorScheme="gray"
							value={(i / fileChunks.length) * 100}
						/>
					),
					status: "info",
					isClosable: false,
				});

				console.info(`Uploading part ${i + 1} to ${signedUrl}`);
				const uploadResponse = await fetch(signedUrl, {
					method: "PUT",
					body: chunk,
				});

				if (!uploadResponse.ok) {
					throw new Error(`Failed to upload part ${i + 1}`);
				}

				console.info(`Part ${i + 1} uploaded successfully`);
			}

			console.info("Completing multipart upload...");

			await completeUpload({
				assetId,
				uploadId,
			});

			updateToast(toastIdRef.current, {
				title: "Upload Success!",
				status: "success",
				isClosable: true,
			});
		} catch (e) {
			console.error(e);
			updateToast(toastIdRef.current, {
				title: "Upload Error",
				description: `${e}`,
				status: "error",
				isClosable: true,
			});
		}
	};

	const triggerFileSelect = () => {
		fileInputRef.current!.click();
	};

	return (
		<Flex direction="column" gap="2">
			<Heading size="md">Upload a File</Heading>
			<input
				type="file"
				multiple={false}
				ref={fileInputRef}
				onChange={handleFileSelect}
				style={{ display: "none" }}
			/>
			<Button size="sm" maxW="200px" onClick={triggerFileSelect}>
				Select File
			</Button>
		</Flex>
	);
}
