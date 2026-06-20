import React, { useEffect, useRef } from "react";
import SenegalMapSVG from "../../../public/images/sn_fixed.svg?react";
import { ID_MAP } from "../../constants/region";

const REGION_IDS = Object.values(ID_MAP);

const SenegalMap = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    Object.entries(ID_MAP).forEach(([oldId, newId]) => {
      const el = svg.querySelector(`#${oldId}`);
      if (!el) return;
      el.setAttribute("id", newId);
      el.style.cursor = "pointer";
      el.style.fill = "#316b45";
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = "1.5";
      el.style.transition = "fill 0.2s ease, opacity 0.2s ease";
    });

    REGION_IDS.forEach((id) => {
      const region = svg.querySelector(`#${id}`);
      if (!region) return;

      const box = region.getBBox();

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );

      text.textContent = id;

      text.setAttribute("x", `${box.x + box.width / 2}`);
      text.setAttribute("y", `${box.y + box.height / 2}`);

      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");

      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-weight", "200");
      text.setAttribute("pointer-events", "none");

      svg.appendChild(text);

      const onEnter = () => {
        region.style.fill = "#316b40";
      };

      const onLeave = () => {
        region.style.fill = "#316b45";
      };

      const onClick = () => {
        console.log(id);
        region.style.fill = "#16a34a";
      };

      region.addEventListener("mouseenter", onEnter);
      region.addEventListener("mouseleave", onLeave);
      region.addEventListener("click", onClick);
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-r from-zinc-900 via-gray-800 to-zinc-900 w-full overflow-hidden flex items-center justify-center">
      <div className="relative" ref={containerRef}>
        <SenegalMapSVG className="h-screen w-auto object-contain z-10 relative" />
      </div>
    </div>
  );
};

export default SenegalMap;
