import { Alcoves } from '../lib/api.server.ts'

export default function ListAlcoves(props: { alcoves: Alcoves[] | null }) {
    return (
        <div>
            <div className="text-xs uppercase font-bold">Alcoves</div>
            <ul>
                {props?.alcoves?.map((alcove) => {
                    return <li key={alcove.id}>{alcove.name}</li>
                })}
            </ul>
        </div>
    )
}
