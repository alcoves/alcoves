// import LogoutButton from './auth/logout'

// import { UserRecord } from '../services/auth.server'
// import { Button } from './ui/button'
// import { Link } from '@remix-run/react'
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from './ui/dropdown-menu'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

// export default function AccountMenu(props: { user: UserRecord | null }) {
//     if (props.user) {
//         return (
//             <DropdownMenu>
//                 <DropdownMenuTrigger>
//                     <Avatar className="w-8 h-8">
//                         <AvatarImage src="" />
//                         <AvatarFallback>
//                             {props?.user?.username?.[0]?.toUpperCase() ?? ''}
//                         </AvatarFallback>
//                     </Avatar>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                         <LogoutButton />
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         )
//     }

//     return (
//         <Link to="/login">
//             <Button size="sm" variant="secondary">
//                 Log In
//             </Button>
//         </Link>
//     )
// }
