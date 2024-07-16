import LogoutButton from './logoutButton'

import { User } from '../types/user'
import { Avatar, Flex, Heading } from '@chakra-ui/react'

export default function Profile({ data }: { data: User }) {
    return (
        <Flex w="100%" direction="column" align="center" gap="2">
            <Avatar size="xl" src={data?.avatar} />
            <Heading size="sm">{data?.email}</Heading>
            <Heading size="xs" opacity=".4">
                {data?.id}
            </Heading>
            <LogoutButton />
        </Flex>
    )
}
