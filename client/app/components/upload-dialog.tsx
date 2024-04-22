import axios from 'axios'
import { Button } from './ui/button'
import { Input } from '../components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'
import { Progress } from '../components/ui/progress'
import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'

// const MiB = 0x10_00_00

interface AlcovesAPIUploadRes {
    id: string
    url: string
}

export default function UploadDialog() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [percentCompleted, setPercentCompleted] = useState<number>(0)

    async function uploadFile(file: File) {
        console.log('Im gonnna upload', file.name)

        const { data: upload }: { data: AlcovesAPIUploadRes } =
            await axios.post('http://localhost:3005/uploads', {
                size: file.size,
                filename: file.name,
                contentType: file.type,
            })

        await axios.put(upload.url, file, {
            headers: {
                'Content-Type': file.type,
            },
            onUploadProgress: (progressEvent) => {
                if (
                    progressEvent &&
                    progressEvent.total &&
                    progressEvent.loaded
                ) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    setPercentCompleted(percentCompleted)
                }
            },
        })

        const { data: uploadComplete } = await axios.post(
            `http://localhost:3005/uploads/${upload?.id}/complete`,
            {
                id: upload.id,
            }
        )

        console.log('Upload complete', uploadComplete)
    }

    useEffect(() => {
        if (file) uploadFile(file)
    }, [file])

    const uploadDisabled = percentCompleted > 0 && percentCompleted < 100

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="h-7 p-2" disabled={uploadDisabled}>
                    <Upload size={18} className="mx-1" />
                    <div className="hidden md:block">
                        {uploadDisabled ? 'Uploading...' : 'Upload'}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload to Alcoves</DialogTitle>
                </DialogHeader>
                <div className="w-full">
                    <Button
                        size="sm"
                        className="w-full"
                        disabled={uploadDisabled}
                        onClick={() => inputRef?.current?.click()}
                    >
                        {uploadDisabled
                            ? 'Uploading...'
                            : 'Select files to upload'}
                    </Button>
                    <Input
                        onChange={(e) => {
                            console.log(e.target.files)
                            if (e?.target?.files?.length) {
                                setPercentCompleted(0)
                                setFile(e?.target?.files[0])
                            }
                        }}
                        ref={inputRef}
                        id="upload"
                        type="file"
                        accept="video/*"
                        multiple={false}
                        className="hidden"
                    />
                    {percentCompleted ? (
                        <Progress
                            value={percentCompleted}
                            className="my-2 h-2 bg-slate-500"
                        />
                    ) : null}
                    {percentCompleted === 100 ? (
                        <div className="flex flex-col items-center">
                            {file?.name ? <p>{file.name}</p> : null}
                            <p>Upload complete</p>
                        </div>
                    ) : null}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
