import { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getTasks } from "~/lib/api.server"

export async function loader({ request }: LoaderFunctionArgs) {
    const {tasks} = await getTasks(request)
    return tasks || null
  }

export default function AdminTasksPage() {
    const tasks = useLoaderData<typeof loader>()

    return (
      <div>
        <h1>Admin tasks</h1>
        {tasks?.map((job: any) => (
            <div key={job.id}>
                <h2>{job.title}</h2>
                <p>{job.description}</p>
            </div>
        ))}
      </div>
    )
  }