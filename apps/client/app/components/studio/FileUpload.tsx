import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

export default function FileUpload(props: { file: File }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{props.file.name}</CardTitle>
        <CardDescription>Uploading {props.file.size} bytes</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Start Upload</Button>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  )
}
