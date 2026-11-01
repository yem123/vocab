import React, { useState } from "react";
import { Play, SkipBack, SkipForward } from "lucide-react";
import AddVideoLink from "../videos/AddVideoLink";

const thumb = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

export default function VideosScreen({ videos, onVideoAdded }) {
  const [selectedId, setSelectedId] = useState(videos[0]?.id || null);

  const index = videos.findIndex((v) => v.id === selectedId);
  const current = index >= 0 ? videos[index] : videos[0];
  const currentIndex = index >= 0 ? index : 0;

  const goTo = (i) => {
    if (videos[i]) setSelectedId(videos[i].id);
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-2 space-y-3">
      {/* Header */}
      <div className="bg-[#f4f6f4] border border-[#e5eae6] rounded-2xl p-5">
        <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#637368]">
          Videos
        </span>
        <h2 className="text-xl font-serif text-[#2c302e] mt-1">Playlist</h2>
        <p className="font-sans text-xs text-[#637368] mt-1">
          {videos.length} {videos.length === 1 ? "Video" : "Videos"}
        </p>
      </div>

      <AddVideoLink onAdded={onVideoAdded} />

      {videos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#e2e7e3] rounded-2xl">
          <Play className="w-6 h-6 text-[#b8c2bc] mx-auto mb-2" />
          <p className="font-sans text-sm text-[#767d78]">Noch keine Videos.</p>
          <p className="font-sans text-xs text-[#8a928e] mt-1">
            Tap “Add link” to add your first one.
          </p>
        </div>
      ) : (
        <>
          {/* Player: stays visible while you scroll the playlist */}
          <div className="sticky top-16 z-20 bg-white pb-2">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                key={current.id}
                src={`https://www.youtube-nocookie.com/embed/${current.id}?rel=0&playsinline=1`}
                title={current.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="pt-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-sans text-sm font-semibold text-[#2c302e] line-clamp-2">
                  {current.title}
                </h3>
                <p className="font-sans text-xs text-[#637368] mt-0.5 truncate">
                  {current.channel}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-full bg-[#f4f3ef] text-[#2c302e] disabled:opacity-30"
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(currentIndex + 1)}
                  disabled={currentIndex === videos.length - 1}
                  className="p-2 rounded-full bg-[#f4f3ef] text-[#2c302e] disabled:opacity-30"
                  title="Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Playlist panel */}
          <div className="border border-[#e8e5e0] rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f9f9f7] border-b border-[#e8e5e0] flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-[#2c302e]">
                Playlist
              </span>
              <span className="font-sans text-[11px] text-[#8a928e]">
                {currentIndex + 1} / {videos.length}
              </span>
            </div>

            <div>
              {videos.map((v, i) => {
                const active = v.id === current.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      active ? "bg-[#e9efea]" : "hover:bg-[#f4f6f4]"
                    }`}
                  >
                    <span className="w-4 shrink-0 text-center font-sans text-[11px] text-[#8a928e]">
                      {active ? (
                        <Play
                          className="w-3 h-3 inline text-[#2c302e]"
                          fill="currentColor"
                        />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <img
                      src={thumb(v.id)}
                      alt=""
                      loading="lazy"
                      className="w-28 aspect-video object-cover rounded-md bg-[#e2e7e3] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-xs font-semibold text-[#2c302e] line-clamp-2">
                        {v.title}
                      </p>
                      <p className="font-sans text-[11px] text-[#637368] mt-0.5 truncate">
                        {v.channel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
