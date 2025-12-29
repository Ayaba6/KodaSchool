export default function VideoPlayer({ url }) {
  if (!url) return null;

  // On transforme l'URL YouTube classique en URL embed
  let embedUrl = url;
  if (url.includes("youtube.com/watch")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
      <iframe
        src={embedUrl}
        title="Vidéo de la leçon"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
}
