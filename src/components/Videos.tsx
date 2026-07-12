import { useState } from 'react'
import { videos, VideoTopic } from '../data/videoData'

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTopic | null>(null)

  if (selectedVideo) {
    return (
      <VideoPlayer
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
      />
    )
  }

  return (
    <div className="videos-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Videos</h1>
        <p className="page-desc">Watch video lessons on Wave Optics topics</p>
      </div>

      <div className="videos-grid">
        {videos.map((video) => (
          <button
            key={video.id}
            className="video-card glass-card"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="video-card-icon">{video.icon}</div>
            <h3 className="video-card-title">{video.title}</h3>
            <p className="video-card-desc">{video.description}</p>
            <div className="badge badge-cyan" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              {video.topic}
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .videos-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        .page-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .page-title {
          font-size: 32px;
          margin-bottom: 8px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .page-desc {
          color: var(--text-secondary);
          font-size: 15px;
        }
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .video-card {
          display: flex;
          flex-direction: column;
          padding: 24px;
          text-align: left;
          cursor: pointer;
          min-height: 200px;
        }
        .video-card-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }
        .video-card-title {
          font-size: 17px;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .video-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .videos-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .videos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function VideoPlayer({ video, onBack }: { video: VideoTopic; onBack: () => void }) {
  return (
    <div className="video-player-page animate-fade-in">
      <button className="back-btn" onClick={onBack}>
        ← Back to Videos
      </button>

      <div className="detail-header">
        <span className="detail-icon">{video.icon}</span>
        <div>
          <h1 className="detail-title">{video.title}</h1>
          <div className="badge badge-cyan">{video.topic}</div>
        </div>
      </div>

      <div className="video-container glass-card-static">
        <iframe
          className="video-iframe"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <style>{`
        .video-player-page {
          max-width: 800px;
          margin: 0 auto;
        }
        .back-btn {
          background: transparent;
          color: var(--accent-cyan);
          font-size: 14px;
          font-weight: 500;
          padding: 8px 0;
          margin-bottom: 20px;
          display: inline-block;
        }
        .back-btn:hover {
          color: var(--accent-electric);
        }
        .detail-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .detail-icon {
          font-size: 48px;
        }
        .detail-title {
          font-size: 28px;
          margin-bottom: 6px;
        }
        .video-container {
          padding: 8px;
          border-radius: var(--radius-lg);
        }
        .video-iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
          border-radius: var(--radius-md);
        }
      `}</style>
    </div>
  )
}
