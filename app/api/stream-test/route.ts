export const runtime = 'edge';

export async function POST(request: Request) {
  return new Response(JSON.stringify({ message: 'stream test works!' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
