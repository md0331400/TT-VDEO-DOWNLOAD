import { useState, useEffect, useRef } from 'react';

// ─── ADSTERRA LINKS ───────────────────────────────────────────
const ADSTERRA_HD_LINK   = "https://www.effectivecpmnetwork.com/jhpgvmraha?key=d9080b086a14fcf3df06cd716385f932";
const ADSTERRA_NOWM_LINK = "https://www.effectivecpmnetwork.com/m0ihrjph27?key=4bd1e4926d21d538f6b8798af4390315";
const ADSTERRA_MP3_LINK  = "https://www.effectivecpmnetwork.com/bm5z3xe9?key=90170fca02a2ec6181844090ed387d4f";

// ─── TYPES ────────────────────────────────────────────────────
interface VideoAuthor {
  id?: string;
  unique_id?: string;
  nickname?: string;
  avatar?: string;
}
interface MusicInfo {
  play?: string;
  title?: string;
}
interface VideoData {
  id?: string;
  title?: string;
  cover?: string;
  play?: string;
  hdplay?: string;
  wmplay?: string;
  music?: string;
  music_info?: MusicInfo;
  author?: VideoAuthor;
  digg_count?: number;
  comment_count?: number;
  share_count?: number;
  download_count?: number;
  duration?: number;
}

// ─── UTILS ────────────────────────────────────────────────────
function isValidTikTokUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return /tiktok\.com/i.test(u.hostname);
  } catch { return false; }
}

function formatNum(n?: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

// ─── ICONS ────────────────────────────────────────────────────
const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconHeart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);
const IconComment = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconShare = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);
const IconMusic = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ─── FAQ ITEM ─────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 14, overflow: 'hidden',
      borderColor: open ? 'rgba(255,45,85,0.35)' : 'rgba(255,255,255,0.09)',
      transition: 'border-color 0.3s'
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '18px 24px', background: 'none', border: 'none',
        color: '#f0f0f0', fontSize: '0.93rem', fontWeight: 600, textAlign: 'left',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 12, fontFamily: 'inherit',
      }}>
        <span style={{ color: open ? '#ff2d55' : '#f0f0f0', transition: 'color 0.2s' }}>{q}</span>
        <span style={{ color: '#ff2d55', flexShrink: 0 }}><IconChevron open={open} /></span>
      </button>
      <div style={{
        maxHeight: open ? 300 : 0, overflow: 'hidden',
        transition: 'max-height 0.4s ease',
        color: '#999', fontSize: '0.875rem', lineHeight: 1.7,
        padding: open ? '0 24px 18px' : '0 24px',
      }}>{a}</div>
    </div>
  );
}

// ─── FEATURE CARD ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='translateY(0)'; obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 16, padding: 28, opacity: 0, transform: 'translateY(24px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,45,85,0.4)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#ff2d55,#ff6b00)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: '1.3rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ─── STEP CARD ────────────────────────────────────────────────
function StepCard({ num, title, desc, delay }: { num: number; title: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => { el.style.opacity='1'; el.style.transform='translateY(0)'; }, delay); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 16, padding: 32, textAlign: 'center',
      opacity: 0, transform: 'translateY(24px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#ff2d55,#ff6b00)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.3rem', fontWeight: 900 }}>{num}</div>
      <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  // ── FETCH ──────────────────────────────────────────────────
  async function handleFetch() {
    setError(''); setVideoData(null);
    const trimmed = url.trim();
    if (!trimmed) { setError('⚠️ Please paste a TikTok video URL first.'); return; }
    if (!isValidTikTokUrl(trimmed)) { setError('⚠️ Invalid URL. Please use a valid TikTok link (tiktok.com, vm.tiktok.com, vt.tiktok.com).'); return; }
    setLoading(true);
    try {
      const res = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(trimmed));
      if (!res.ok) throw new Error('Network error. Status: ' + res.status);
      const json = await res.json();
      if (!json || json.code !== 0 || !json.data) {
        setError('❌ ' + (json?.msg || 'Failed to fetch video. The video may be private or unavailable.'));
        return;
      }
      setVideoData(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError('❌ Error: ' + msg);
    } finally {
      setLoading(false);
    }
  }

  // ── DOWNLOAD ───────────────────────────────────────────────
  async function handleDownload(type: 'hd' | 'nowm' | 'mp3') {
    if (!videoData) return;
    const confirmed = confirm('Your download will start after a short ad. Click OK to continue.');
    if (!confirmed) return;

    if (type === 'hd')   window.open(ADSTERRA_HD_LINK,   '_blank', 'noopener,noreferrer');
    if (type === 'nowm') window.open(ADSTERRA_NOWM_LINK, '_blank', 'noopener,noreferrer');
    if (type === 'mp3')  window.open(ADSTERRA_MP3_LINK,  '_blank', 'noopener,noreferrer');

    let dlUrl = '';
    let filename = 'ttvdo-' + (videoData.id || Date.now());
    if (type === 'hd')   { dlUrl = videoData.hdplay || videoData.play || ''; filename += '-hd.mp4'; }
    if (type === 'nowm') { dlUrl = videoData.play   || ''; filename += '-nowm.mp4'; }
    if (type === 'mp3')  { dlUrl = videoData.music  || videoData.music_info?.play || ''; filename += '.mp3'; }

    if (!dlUrl) { alert('Download URL not available for this video.'); return; }

    setDownloading(true);
    try {
      const r = await fetch(dlUrl);
      if (!r.ok) throw new Error('fetch failed');
      const blob = await r.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href);
    } catch {
      const a = document.createElement('a');
      a.href = dlUrl; a.download = filename; a.target = '_blank';
      document.body.appendChild(a); a.click(); a.remove();
    } finally {
      setDownloading(false);
    }
  }

  // ── STYLES ─────────────────────────────────────────────────
  const s = {
    page: { fontFamily: "'Inter', -apple-system, sans-serif", background: '#0f0f0f', color: '#f0f0f0', minHeight: '100vh', lineHeight: 1.6, overflowX: 'hidden' as const },
    container: { maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative' as const, zIndex: 1 },
    grad: { background: 'linear-gradient(135deg,#ff2d55,#ff6b00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as React.CSSProperties,
  };

  const faqs = [
    { q: 'Is tt vdo downloader free?', a: 'Yes, tt vdo downloader is completely free to use. There are no subscriptions, no hidden fees, and no registration required. You can download unlimited TikTok videos at no cost, anytime.' },
    { q: 'Is it safe to use?', a: 'Absolutely. tt vdo downloader does not store any of your data, does not require login, and does not install any software on your device. All downloads happen directly from TikTok\'s servers through a secure API connection.' },
    { q: 'Do you store user data or video links?', a: 'No. We do not store any user data, video URLs, or personal information. We have no cookies, no analytics software, and no tracking of any kind. Your usage is 100% anonymous.' },
    { q: 'Why do I see ads?', a: 'Ads help keep this service free for everyone. We use minimal, non-intrusive ads to cover server and maintenance costs. Without ads, we could not offer this service for free. We appreciate your understanding.' },
    { q: 'Why does my download fail?', a: 'Download failures usually happen because the video is private, region-restricted, or has been deleted. Ensure you\'re pasting a valid TikTok URL (tiktok.com, vm.tiktok.com, or vt.tiktok.com). Check your internet connection and try again.' },
    { q: 'Can I use it on mobile?', a: 'Yes! tt vdo downloader is fully mobile-friendly and works on all devices — iPhone, Android, iPad, and desktop browsers. No app download is needed. Just open your browser and visit our site.' },
    { q: 'Does it support HD quality?', a: 'Yes. We offer HD video downloads without watermark. The available quality depends on the original video uploaded by the creator. We never compress or downgrade quality.' },
    { q: 'Can I download TikTok audio as MP3?', a: 'Yes! tt vdo downloader supports MP3 audio extraction. Just paste your TikTok link, click Fetch, and hit the "MP3 Audio" button to download just the audio track.' },
  ];

  return (
    <div style={s.page}>
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      })}} />

      {/* Background Blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
        {[
          { bg: '#ff2d55', top: -200, left: -200, w: 600, delay: '0s' },
          { bg: '#ff6b00', bottom: -200, right: -200, w: 500, delay: '-7s' },
          { bg: '#7b2fff', top: '40%', left: '40%', w: 400, delay: '-14s' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.11,
            width: b.w, height: b.w, background: b.bg,
            top: (b as any).top, left: (b as any).left, bottom: (b as any).bottom, right: (b as any).right,
            animation: `blobMove 20s ease-in-out ${b.delay} infinite`,
          }} />
        ))}
        <style>{`
          @keyframes blobMove { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }
          @keyframes spin { to{transform:rotate(360deg)} }
          @keyframes fadeDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          * { box-sizing:border-box; margin:0; padding:0; }
          ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#1a1a1a} ::-webkit-scrollbar-thumb{background:#ff2d55;border-radius:3px}
          html{scroll-behavior:smooth}
        `}</style>
      </div>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,15,15,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.09)', padding: '14px 0',
      }}>
        <div style={{ ...s.container, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: '1.3rem', fontWeight: 800, textDecoration: 'none', ...s.grad, letterSpacing: '-0.5px' }}>tt vdo downloader</a>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Features', 'How to Use', 'FAQ', 'Privacy', 'Terms'].map((l, i) => (
              <a key={l} href={i < 3 ? `#${['features','how-to','faq'][i]}` : `/${l.toLowerCase()}.html`}
                style={{ color: '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#f0f0f0'}
                onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#888'}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center' }}>
        <div style={s.container}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', color: '#ff2d55', padding: '6px 16px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 700, marginBottom: 24, animation: 'fadeDown 0.6s ease both' }}>
            <IconStar /> Free &amp; Fast TikTok Downloader
          </div>

          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16, animation: 'fadeDown 0.6s ease 0.1s both' }}>
            TikTok Video Downloader –<br />
            <span style={s.grad}>Download Videos Online</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#888', maxWidth: 560, margin: '0 auto 40px', animation: 'fadeDown 0.6s ease 0.2s both' }}>
            Download TikTok videos without watermark in HD quality. No registration, no app, no hassle — 100% free.
          </p>

          {/* Downloader Card */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32,
            maxWidth: 700, margin: '0 auto', animation: 'fadeUp 0.6s ease 0.3s both',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              <input
                type="url" value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && handleFetch()}
                placeholder="Paste TikTok video URL here… (tiktok.com, vm.tiktok.com)"
                disabled={loading}
                style={{
                  flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px',
                  color: '#f0f0f0', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none',
                  opacity: loading ? 0.6 : 1,
                }}
                onFocus={e => (e.target.style.borderColor = '#ff2d55')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button onClick={handleFetch} disabled={loading} style={{
                background: 'linear-gradient(135deg,#ff2d55,#ff6b00)', color: '#fff', border: 'none',
                padding: '14px 28px', borderRadius: 12, fontSize: '0.95rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>
                {loading ? <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> : <IconDownload />}
                {loading ? 'Fetching…' : '⬇ Download'}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', color: '#ff3b30', fontSize: '0.875rem' }}>{error}</div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20, color: '#888', fontSize: '0.9rem' }}>
                <span style={{ width: 26, height: 26, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ff2d55', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Fetching video info…
              </div>
            )}

            {/* Result */}
            {videoData && !loading && (
              <div style={{ marginTop: 28 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
                  <video
                    ref={videoRef}
                    src={videoData.play || videoData.wmplay || ''}
                    poster={videoData.cover || ''}
                    controls preload="none" playsInline
                    style={{ width: '100%', maxHeight: 360, objectFit: 'cover', background: '#000', display: 'block' }}
                  />
                  <div style={{ padding: 20 }}>
                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <img
                        src={videoData.author?.avatar || ''} alt={videoData.author?.nickname || 'Author'}
                        loading="lazy"
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff2d55', background: '#222' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{videoData.author?.nickname || 'Unknown'}</div>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>@{videoData.author?.unique_id || 'unknown'}</div>
                      </div>
                    </div>

                    {/* Description */}
                    {videoData.title && (
                      <p style={{ fontSize: '0.875rem', color: '#ccc', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                        {videoData.title}
                      </p>
                    )}

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                      {[
                        { icon: <IconHeart />, val: formatNum(videoData.digg_count), label: 'Likes' },
                        { icon: <IconComment />, val: formatNum(videoData.comment_count), label: 'Comments' },
                        { icon: <IconShare />, val: formatNum(videoData.share_count), label: 'Shares' },
                      ].map(({ icon, val, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#888' }} title={label}>
                          {icon} {val}
                        </div>
                      ))}
                    </div>

                    {/* Download Buttons */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                      {[
                        { id: 'hd', label: 'HD Video', type: 'hd' as const, bg: 'linear-gradient(135deg,#ff2d55,#ff6b00)', color: '#fff', border: 'none' },
                        { id: 'nowm', label: 'No Watermark', type: 'nowm' as const, bg: 'rgba(255,45,85,0.13)', color: '#ff2d55', border: '1.5px solid #ff2d55' },
                        { id: 'mp3', label: 'MP3 Audio', type: 'mp3' as const, bg: 'rgba(255,107,0,0.13)', color: '#ff6b00', border: '1.5px solid #ff6b00' },
                      ].map(btn => (
                        <button key={btn.id} onClick={() => handleDownload(btn.type)} disabled={downloading}
                          style={{
                            flex: 1, minWidth: 120, padding: '12px 14px', borderRadius: 10,
                            fontWeight: 700, fontSize: '0.875rem', cursor: downloading ? 'not-allowed' : 'pointer',
                            border: btn.border, background: btn.bg, color: btn.color, fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                            opacity: downloading ? 0.6 : 1, transition: 'opacity 0.2s, transform 0.2s',
                          }}
                          onMouseEnter={e => !downloading && ((e.target as HTMLButtonElement).style.opacity = '0.85')}
                          onMouseLeave={e => ((e.target as HTMLButtonElement).style.opacity = '1')}
                        >
                          {btn.type === 'mp3' ? <IconMusic /> : <IconDownload />}
                          {downloading ? 'Downloading…' : btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,45,85,0.4),transparent)' }} />

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 0' }}>
        <div style={s.container}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', ...s.grad, marginBottom: 12 }}>Why Choose Us</div>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>Everything You Need to Download<br />TikTok Videos</h2>
            <p style={{ color: '#888', maxWidth: 540, fontSize: '0.95rem' }}>Fast, reliable, and completely free. No registration required — just paste and download.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            <FeatureCard icon="⚡" title="Lightning Fast Downloads" desc="Our servers fetch your TikTok video in seconds. No waiting, no queues — instant results every time." />
            <FeatureCard icon="🎥" title="HD Quality Support" desc="Download TikTok videos in the highest available resolution. Crystal clear HD quality preserved." />
            <FeatureCard icon="🎵" title="MP3 Audio Extraction" desc="Extract just the audio from any TikTok video. Download background music or sounds as MP3 files." />
            <FeatureCard icon="🚫" title="No Registration Required" desc="No account, no sign-up, no email. Just paste your TikTok link and get your video immediately." />
            <FeatureCard icon="📱" title="Mobile Friendly" desc="Works perfectly on iPhone, Android, iPad, and desktop. Fully responsive design for all screen sizes." />
            <FeatureCard icon="🔒" title="Secure &amp; Private" desc="No data stored, no tracking, no cookies. Your privacy is our priority. 100% anonymous usage." />
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,45,85,0.4),transparent)' }} />

      {/* HOW TO USE */}
      <section id="how-to" style={{ padding: '80px 0' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', ...s.grad, marginBottom: 12 }}>Simple Process</div>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>How to Download TikTok Videos</h2>
            <p style={{ color: '#888', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem' }}>Three easy steps to download any TikTok video in seconds.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            <StepCard num={1} title="Copy TikTok Link" desc="Open TikTok and find the video you want. Tap Share → Copy Link to copy the video URL to your clipboard." delay={0} />
            <StepCard num={2} title="Paste the URL" desc="Come back to tt vdo downloader and paste the TikTok link into the input field above. Works with all TikTok URL formats." delay={100} />
            <StepCard num={3} title="Click Download" desc="Hit the Download button, choose your format (HD video, no watermark, or MP3), and save to your device instantly." delay={200} />
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,45,85,0.4),transparent)' }} />

      {/* SEO CONTENT */}
      <section id="about" style={{ padding: '80px 0' }}>
        <div style={{ ...s.container, maxWidth: 860 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', ...s.grad, marginBottom: 12 }}>About</div>

          {[
            { h: 'What is tt vdo downloader?', body: 'tt vdo downloader is a free, browser-based TikTok video downloader that allows anyone to save TikTok videos directly to their device — without needing to install any app, create an account, or pay any subscription. Whether you\'re on a smartphone, tablet, or desktop computer, tt vdo downloader works seamlessly across all platforms and operating systems. Our tool is designed with simplicity in mind. You don\'t need to be tech-savvy to use it. Just copy a TikTok video link, paste it into our input box, and click download. Within seconds, you\'ll have access to your video in multiple formats — HD quality, watermark-free, or even just the audio as an MP3 file.' },
            { h: 'Why Use tt vdo downloader?', body: 'There are dozens of TikTok downloader tools online, but tt vdo downloader stands out for several important reasons. We offer no-watermark downloads so your video looks clean and professional. We retrieve the highest quality version available — no compression, no quality loss. We support MP3 audio extraction, perfect for saving trending sounds. No account is needed, providing frictionless access. We are privacy-first — we don\'t store your video URLs or track your usage in any way. The interface is fully responsive and touch-friendly for all mobile users.' },
            { h: 'Is It Safe to Use?', body: 'Yes, tt vdo downloader is completely safe. We do not install any software on your device. We do not request access to your TikTok account. We do not store your video URLs or search history. We do not use cookies or tracking pixels of any kind. All video fetching happens through an encrypted API connection. Our service acts as a bridge between you and TikTok\'s public servers. We never host or permanently store any TikTok content on our own servers.' },
            { h: 'Troubleshooting Download Errors', body: 'If you encounter an error, here are common causes: Invalid URL — ensure you\'re pasting a valid TikTok video URL (tiktok.com, vm.tiktok.com, vt.tiktok.com). Private video — videos set to "Only Me" cannot be downloaded by third-party tools. Region restriction — some TikTok videos are only available in specific countries. Deleted video — if the creator deleted the video, it won\'t be accessible. Network issues — check your internet connection and try again. If the problem persists, reach out via email at abusayem0866@gmail.com.' },
          ].map(({ h, body }) => (
            <div key={h} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 14, letterSpacing: -0.3 }}>{h}</h2>
              <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: 1.85 }}>{body}</p>
            </div>
          ))}

          {/* HD Guide */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20, letterSpacing: -0.3 }}>HD Video &amp; MP3 Download Guide</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { t: '🎬 HD Video', d: 'Download the video in its highest available resolution. Ideal for sharing on other platforms or archiving content.' },
              { t: '🚫 No Watermark', d: 'Download the video without the TikTok logo overlay. Perfect for repurposing content across platforms.' },
              { t: '🎵 MP3 Audio', d: 'Extract only the audio track. Perfect for saving trending sounds, voiceovers, or background music.' },
            ].map(card => (
              <div key={card.t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{card.t}</div>
                <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>{card.d}</p>
              </div>
            ))}
          </div>

          {/* Mobile Guide */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 16, letterSpacing: -0.3 }}>Mobile Usage Guide</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🍎 On iPhone (Safari)</h3>
              <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.7 }}>Open TikTok → find your video → Share → Copy Link. Open Safari, go to tt vdo downloader, paste the link and tap Download. Choose your format and the file will be saved to your Files or Photos app.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🤖 On Android (Chrome)</h3>
              <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.7 }}>In TikTok, tap Share then Copy Link. Open Chrome, visit tt vdo downloader, paste and tap Download. Select your preferred format. The file will download to your Downloads folder.</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,45,85,0.4),transparent)' }} />

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 0' }}>
        <div style={{ ...s.container, maxWidth: 780 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', ...s.grad, marginBottom: 12 }}>Got Questions?</div>
            <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>Frequently Asked Questions</h2>
            <p style={{ color: '#888', fontSize: '0.95rem' }}>Everything you need to know about tt vdo downloader.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,45,85,0.4),transparent)' }} />

      {/* FOOTER */}
      <footer style={{ background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 0 30px' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <a href="/" style={{ fontSize: '1.2rem', fontWeight: 800, textDecoration: 'none', ...s.grad, display: 'inline-block', marginBottom: 12 }}>tt vdo downloader</a>
              <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.7 }}>Free TikTok video downloader — download HD videos, remove watermarks, and extract MP3 audio. No registration needed.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>Quick Links</h4>
              {['#features|Features', '#how-to|How to Use', '#faq|FAQ', '#about|About'].map(l => {
                const [href, label] = l.split('|');
                return <a key={label} href={href} style={{ display: 'block', color: '#666', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 10 }}
                  onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#ff2d55'}
                  onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#666'}>{label}</a>;
              })}
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>Legal</h4>
              {['/privacy.html|Privacy Policy', '/terms.html|Terms of Service'].map(l => {
                const [href, label] = l.split('|');
                return <a key={label} href={href} style={{ display: 'block', color: '#666', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 10 }}
                  onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = '#ff2d55'}
                  onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = '#666'}>{label}</a>;
              })}
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.875rem' }}>Contact</h4>
              <a href="mailto:abusayem0866@gmail.com" style={{ display: 'block', color: '#666', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 10 }}>abusayem0866@gmail.com</a>
              <a href="tel:+8801962610866" style={{ display: 'block', color: '#666', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 10 }}>+880 1962-610866</a>
              <a href="https://www.tiktok.com/@amisayembro" target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: '#ff2d55', textDecoration: 'none', fontSize: '0.85rem' }}>@amisayembro</a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.82rem', color: '#666' }}>
              Created by <strong style={{ color: '#f0f0f0' }}>Ami Sayem</strong> &nbsp;|&nbsp;
              📞 <a href="tel:+8801962610866" style={{ color: '#ff2d55', textDecoration: 'none' }}>+8801962610866</a> &nbsp;|&nbsp;
              ✉️ <a href="mailto:abusayem0866@gmail.com" style={{ color: '#ff2d55', textDecoration: 'none' }}>abusayem0866@gmail.com</a> &nbsp;|&nbsp;
              🎵 <a href="https://www.tiktok.com/@amisayembro" target="_blank" rel="noopener noreferrer" style={{ color: '#ff2d55', textDecoration: 'none' }}>@amisayembro</a>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#555' }}>© 2025 tt vdo downloader. All rights reserved.</div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: '#444' }}>
            tt vdo downloader is not affiliated with TikTok or ByteDance Ltd. For personal use only.
          </div>
        </div>
      </footer>
    </div>
  );
}
