export type UserType = { id: string; name: string; role?: string }
export const User = {
  async me(): Promise<UserType> { return { id: 'u1', name: 'Demo User', role: 'admin' } }
}
