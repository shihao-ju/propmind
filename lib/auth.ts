export type Role = 'landlord' | 'tenant'

export interface MockUser {
  id: string
  email: string
  name: string
  role: Role
  tenantSlug?: string
}

export interface Session {
  userId: string
  email: string
  name: string
  role: Role
  tenantSlug?: string
}

const MOCK_USERS: (MockUser & { password: string })[] = [
  {
    id: 'user-landlord',
    email: 'landlord@demo.com',
    name: 'Alex Johnson',
    role: 'landlord',
    password: 'demo123',
  },
  {
    id: 'user-maria',
    email: 'maria@demo.com',
    name: 'Maria Lopez',
    role: 'tenant',
    tenantSlug: 'portland-oak-st',
    password: 'demo123',
  },
  {
    id: 'user-james',
    email: 'james@demo.com',
    name: 'James Kim',
    role: 'tenant',
    tenantSlug: 'chicago-pine-rd',
    password: 'demo123',
  },
]

export function validateCredentials(
  email: string,
  password: string,
): MockUser | null {
  const found = MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  )
  if (!found) return null
  const { password: _, ...user } = found
  return user
}

export function encodeSession(user: MockUser): string {
  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    ...(user.tenantSlug && { tenantSlug: user.tenantSlug }),
  }
  return btoa(JSON.stringify(session))
}

export function decodeSession(cookie: string): Session | null {
  try {
    const json = atob(cookie)
    const parsed = JSON.parse(json)
    if (!parsed.userId || !parsed.email || !parsed.role) return null
    return parsed as Session
  } catch {
    return null
  }
}
