/* One outline icon and label primitive for ML controls. State changes must
   update both together so toggles never fall back to text-symbol icons. */


  const paths = {
    back: "m14 6-6 6 6 6",
    forward: "m10 6 6 6-6 6",
    close: "m6 6 12 12M18 6 6 18",
    exit: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    expand: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
    collapse: "M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5",
    moon: "M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z",
    sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  };
  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "ml-control-icon");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", paths[name]); svg.append(path);
    return svg;
  }
  function label(button, text, name) {
    const svg = icon(name);
    const span = document.createElement("span"); span.textContent = text;
    button.replaceChildren(svg, span);
  }
  export default Object.freeze({ label, icon });
