import { Alcove } from '../lib/api.server.ts'
import { SidebarLink } from './sidebar-menu.js'

export default function ListAlcoves(props: { alcoves: Alcove[] | null }) {
    return (
        <div className="py-4">
            <div className="text-xs uppercase font-bold mb-2">Alcoves</div>
            <div>
                {props?.alcoves?.map((alcove) => {
                    return (
                        <SidebarLink
                            to={`/alcoves/${alcove.id}`}
                            key={alcove.id}
                            extraClasses="w-full truncate" // max-h-7 p-2
                        >
                            {alcove.name}
                        </SidebarLink>
                    )
                })}
            </div>
        </div>
    )
}
