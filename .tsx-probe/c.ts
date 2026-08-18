export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  return Response.json({ q: searchParams.get("q") });
}
export {};
