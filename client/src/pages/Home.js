import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import ImageSlider from "../components/Slider/ImageSlider";
import QuestionBox from "../components/Content/QuestionBox";
import SocialLinks from "../components/Content/SocialLinks";
import Stories from "../components/Content/Stories";
import ShareWithAdmin from "../components/ShareWithAdmin";

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [question, setQuestion] = useState(null);
  const [links, setLinks] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [s, q, l, st] = await Promise.all([
        api.get("/content/slider-images"),
        api.get("/content/question"),
        api.get("/content/social-links"),
        api.get("/content/stories")
      ]);
      setSlides(s.data.slides || []);
      setQuestion(q.data.question || null);
      setLinks(l.data.links || []);
      setStories(st.data.stories || []);
    };
    load().catch(() => {});
  }, []);

  return (
    <div className="grid">
      <div className="col">
        <div className="sectionTitle">Image Slider</div>
        <ImageSlider slides={slides} />
      </div>

      <div className="col">
        <div className="sectionTitle">Daily Question</div>
        <QuestionBox question={question} />

        <div className="spacer" />

        <div className="sectionTitle">Social Links</div>
        <SocialLinks links={links} />
      </div>

      <div className="full">
        <div className="sectionTitle">Stories</div>
        <Stories stories={stories} />
      </div>
      
        <ShareWithAdmin />
    </div>
  );
}
