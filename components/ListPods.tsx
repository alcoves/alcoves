export default function ListPods({ data }) {
  return (
    <div>
      Here are the data
      {data?.map(p => {
        return <div key={p.id}>{p.id}</div>
      })}
    </div>
  )
}
