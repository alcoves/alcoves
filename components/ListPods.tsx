export default function ListPods({ data }) {
  return (
    <div>
      Here are the data
      {data?.map(p => {
        return (
          <div key={p._id}>
            {p._id}
            <p>{p.name}</p>
          </div>
        )
      })}
    </div>
  )
}
