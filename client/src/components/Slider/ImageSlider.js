import React, { useMemo, useState } from "react";
import { logClick } from "../../utils/tracking";

export default function ImageSlider({ slides }) {
  const safeSlides = useMemo(() => (Array.isArray(slides) ? slides : []), [slides]);
  const [idx, setIdx] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const total = safeSlides.length || 1;
  const current = safeSlides[idx] || [];

  const prev = () => {
    logClick({ element_type: "button", label: "Slider Prev", page: window.location.pathname });
    setIdx((p) => (p - 1 + total) % total);
  };
  const next = () => {
    logClick({ element_type: "button", label: "Slider Next", page: window.location.pathname });
    setIdx((p) => (p + 1) % total);
  };

  const onImageClick = (img) => {
    logClick({
      element_type: "image",
      label: `Slider Image ${img?.id}`,
      page: window.location.pathname,
      meta: { image_id: img?.id, image_url: img?.image_url }
    });
  };

  return (
    <div className="card slider">
      <div className="sliderTop">
        <div className="sliderTitle">Gallery</div>
        <button
          className="btn ghost"
          onClick={() => {
            logClick({ element_type: "button", label: "Help Button", page: window.location.pathname });
            setShowHelp((s) => !s);
          }}
        >
          ?
        </button>
      </div>

      {showHelp && (
        <div className="helpBox">
          <b>How it works:</b> Each slide contains <b>two images</b>. Buttons and image clicks are tracked.
        </div>
      )}

      <div className="slideRow">
        {current.slice(0, 2).map((img) => (
          <div className="slideItem" key={img.id} onClick={() => onImageClick(img)} role="button" tabIndex={0}>
            <img className="slideImg" src={process.env.REACT_APP_API_BASE + img.image_url} alt={img.title || "image"} loading="lazy" />
            <div className="slideMeta">
              <div className="slideH">{img.title || "Untitled"}</div>
              {img.description ? <div className="slideP">{img.description}</div> : null}
            </div>
          </div>
        ))}
        {current.length < 2 && <div className="slideItem placeholder">Upload more images in Admin</div>}
      </div>

      <div className="sliderNav">
        <button className="btn" onClick={prev}>Prev</button>
        <div className="dots">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              className={"dot " + (i === idx ? "active" : "")}
              onClick={() => {
                logClick({ element_type: "button", label: `Slider Dot ${i + 1}`, page: window.location.pathname });
                setIdx(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="btn" onClick={next}>Next</button>
      </div>
    </div>
  );
}
