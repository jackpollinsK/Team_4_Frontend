export type User = {
    email: string,
    salt: string,
    hash: string,
    roleId: number
}