import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Track {
  id: string;
  title: string;
  durationLabel: string;
  src: string;
}

const SILENT_AUDIO_DATA_URI =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';

const tracks: Track[] = [
  { id: 'reset', title: '2-minute calm reset', durationLabel: '2:00', src: SILENT_AUDIO_DATA_URI },
  { id: 'grounding', title: '5-minute grounding', durationLabel: '5:00', src: SILENT_AUDIO_DATA_URI },
  { id: 'ambient', title: 'Soft ambient sound', durationLabel: '3:00', src: SILENT_AUDIO_DATA_URI },
];

const formatTime = (timeInSeconds: number) => {
  const safe = Number.isFinite(timeInSeconds) ? Math.floor(timeInSeconds) : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const AudioCalmingGuides = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedSources, setLoadedSources] = useState<Record<string, boolean>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const handleToggle = async (track: Track) => {
    const audio = audioRefs.current[track.id];
    if (!audio) {
      return;
    }

    if (!loadedSources[track.id]) {
      setLoadedSources((prev) => ({ ...prev, [track.id]: true }));
      audio.src = track.src;
      audio.load();
    }

    if (activeTrackId === track.id && !audio.paused) {
      audio.pause();
      setActiveTrackId(null);
      return;
    }

    if (activeTrackId && activeTrackId !== track.id) {
      const currentAudio = audioRefs.current[activeTrackId];
      currentAudio?.pause();
      if (currentAudio) {
        currentAudio.currentTime = 0;
      }
    }

    try {
      await audio.play();
      setActiveTrackId(track.id);
    } catch {
      setActiveTrackId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audio Calming Guides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tracks.map((track) => {
          const isActive = activeTrackId === track.id;
          const progress = duration > 0 && isActive ? (currentTime / duration) * 100 : 0;

          return (
            <div key={track.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{track.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {isActive ? `${formatTime(currentTime)} / ${formatTime(duration || 0)}` : track.durationLabel}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggle(track)}
                  aria-label={isActive ? `Pause ${track.title}` : `Play ${track.title}`}
                >
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>

              <div className="space-y-1">
                <div className="h-2 rounded-full bg-muted overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={1}
                  value={isActive ? currentTime : 0}
                  onChange={(event) => {
                    const audio = audioRefs.current[track.id];
                    const nextTime = Number(event.target.value);
                    if (audio) {
                      audio.currentTime = nextTime;
                    }
                    setCurrentTime(nextTime);
                  }}
                  className="w-full"
                  aria-label={`Seek ${track.title}`}
                />
              </div>

              <audio
                ref={(el) => {
                  audioRefs.current[track.id] = el;
                }}
                preload="none"
                onLoadedMetadata={(event) => {
                  if (activeTrackId === track.id) {
                    setDuration(event.currentTarget.duration || 0);
                  }
                }}
                onTimeUpdate={(event) => {
                  if (activeTrackId === track.id) {
                    setCurrentTime(event.currentTarget.currentTime || 0);
                    setDuration(event.currentTarget.duration || 0);
                  }
                }}
                onEnded={() => {
                  setActiveTrackId(null);
                  setCurrentTime(0);
                }}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AudioCalmingGuides;
