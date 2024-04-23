import { Alcoves } from '../lib/api.server.ts'
import { SidebarLink } from './sidebar-menu.js'

export default function ListAlcoves(props: { alcoves: Alcoves[] | null }) {
    return (
        <div className="py-4">
            <div className="text-xs uppercase font-bold mb-2">Alcoves</div>
            <ul>
                {props?.alcoves?.map((alcove) => {
                    return (
                        <SidebarLink
                            to={`/alcoves/${alcove.id}`}
                            key={alcove.id}
                            extraClasses="max-h-7 p-2 w-full truncate"
                        >
                            {alcove.name}
                        </SidebarLink>
                    )
                })}
            </ul>
        </div>
    )
}
