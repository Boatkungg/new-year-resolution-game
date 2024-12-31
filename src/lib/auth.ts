const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export function isAdmin(request: Request): boolean {
  if (!ADMIN_TOKEN) {
    console.error('ADMIN_TOKEN environment variable is not set');
    return false;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === ADMIN_TOKEN;
}
