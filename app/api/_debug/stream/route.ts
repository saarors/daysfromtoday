/**
 * 调试路由：测试 SSE 流式输出是否被缓冲
 * 
 * 如果这个路由也"最后才蹦出来"，说明是中间层缓冲问题
 */

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        const payload = `data: ${JSON.stringify({ msg: `tick-${i}`, time: new Date().toISOString() })}\n\n`;
        controller.enqueue(new TextEncoder().encode(payload));
        
        if (i >= 5) {
          clearInterval(timer);
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        }
      }, 500); // 每 0.5 秒发送一次
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Content-Encoding': 'identity',     // 🔥 关键：禁压缩
      'X-Accel-Buffering': 'no',          // 🔥 若后面有 Nginx 反代
    },
  });
}

