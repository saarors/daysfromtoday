/**
 * VideoPlayer - 视频播放器组件
 * 
 * 用途: 嵌入视频，支持 MP4/WebM 格式
 * 使用场景: Guides（功能演示）、Tools（操作教程）
 */

interface VideoPlayerProps {
  src: string;             // 视频 URL（必填）
  poster?: string;         // 封面图 URL（可选）
  caption?: string;        // 视频说明（可选）
  controls?: boolean;      // 是否显示控制栏（默认 true）
  autoplay?: boolean;      // 是否自动播放（默认 false）
  loop?: boolean;          // 是否循环播放（默认 false）
  muted?: boolean;         // 是否静音（默认 false）
}

export function VideoPlayer({
  src,
  poster,
  caption,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
}: VideoPlayerProps) {
  return (
    <figure className="my-8">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
        <video
          className="w-full h-full"
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          playsInline
        >
          <track kind="captions" />
          您的浏览器不支持视频播放。
        </video>
      </div>
      
      {caption && (
        <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

