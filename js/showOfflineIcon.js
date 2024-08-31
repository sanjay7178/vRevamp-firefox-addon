const createOfflineIconSVG = () => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "30px");
  svg.setAttribute("height", "30px");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("version", "1.1");
  svg.setAttribute("xml:space", "preserve");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  const style = document.createElementNS(svgNS, "style");
  style.setAttribute("type", "text/css");
  style.textContent = `
    .st0{display:none;}
    .st1{display:inline;}
    .st2{opacity:0.2;fill:none;stroke:#000000;stroke-width:5.000000e-02;stroke-miterlimit:10;}
  `;
  svg.appendChild(style);

  const g1 = document.createElementNS(svgNS, "g");
  g1.setAttribute("class", "st0");
  g1.setAttribute("id", "grid_system");
  svg.appendChild(g1);

  const g2 = document.createElementNS(svgNS, "g");
  g2.setAttribute("id", "_icons");

  const path1 = document.createElementNS(svgNS, "path");
  path1.setAttribute(
    "d",
    "M2,14.5c0,1.6,0.9,3.1,2.2,3.9l-0.9,0.9c-0.4,0.4-0.4,1,0,1.4C3.5,20.9,3.7,21,4,21s0.5-0.1,0.7-0.3l14-14   c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-1.8,1.8C14.9,7,14.3,7,13.8,7c-0.1-0.2-0.3-0.3-0.4-0.4C12.4,5.6,11,5,9.5,5S6.6,5.6,5.6,6.6   C4.6,7.6,4,9,4,10.5c0,0.1,0,0.2,0,0.3c-0.2,0.2-0.5,0.3-0.7,0.6C2.5,12.2,2,13.3,2,14.5z M4.7,12.7c0.2-0.2,0.5-0.4,0.7-0.5   c0.4-0.2,0.7-0.6,0.6-1.1C6,10.9,6,10.7,6,10.5C6,9.6,6.4,8.7,7,8c1.3-1.3,3.6-1.3,4.9,0c0.2,0.2,0.4,0.4,0.5,0.7   c0.2,0.3,0.6,0.5,1,0.4l-7.7,7.7c-1-0.3-1.7-1.3-1.7-2.4C4,13.8,4.3,13.2,4.7,12.7z"
  );
  g2.appendChild(path1);

  const path2 = document.createElementNS(svgNS, "path");
  path2.setAttribute(
    "d",
    "M19.6,10.6c-0.2-0.4-0.4-0.8-0.6-1.2c-0.3-0.5-0.9-0.6-1.4-0.3c-0.5,0.3-0.6,0.9-0.3,1.4c0.2,0.3,0.4,0.7,0.5,1   c0.1,0.3,0.3,0.5,0.6,0.7c0.9,0.4,1.5,1.3,1.5,2.3c0,0.7-0.3,1.3-0.7,1.8c-0.5,0.5-1.1,0.7-1.8,0.7H10c-0.6,0-1,0.4-1,1s0.4,1,1,1   h7.5c1.2,0,2.3-0.5,3.2-1.3c0.9-0.8,1.3-2,1.3-3.2C22,12.8,21.1,11.3,19.6,10.6z"
  );
  g2.appendChild(path2);

  svg.appendChild(g2);

  return svg;
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "showOfflineIcon") {
    // check if offline button already exists
    if (document.getElementById("offlineIcon")) {
      return;
    }
    // put the show offline icon at the bottom left corner of the page
    const offlineIcon = document.createElement("div");
    offlineIcon.id = "offlineIcon";
    offlineIcon.style.position = "fixed";
    offlineIcon.style.bottom = "25px";
    offlineIcon.style.right = "25px";
    offlineIcon.style.zIndex = "1000";
    offlineIcon.style.backgroundColor = "white";
    offlineIcon.style.padding = "30px";
    offlineIcon.style.borderRadius = "50%";
    offlineIcon.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    offlineIcon.style.cursor = "pointer";
    offlineIcon.style.transition = "all 0.3s ease";
    offlineIcon.style.border = "1px solid #ccc";
    offlineIcon.style.width = "30px";
    offlineIcon.style.height = "30px";

    const svgIcon = createOfflineIconSVG();
    svgIcon.style.position = "absolute";
    svgIcon.style.top = "50%";
    svgIcon.style.left = "50%";
    svgIcon.style.transform = "translate(-50%, -50%)";

    offlineIcon.appendChild(svgIcon);

    offlineIcon.addEventListener("click", () => {
      // send message to background script to showOfflinePage
      chrome.runtime.sendMessage({ message: "showOfflinePage" });
    });

    document.body.appendChild(offlineIcon);
  }
});
