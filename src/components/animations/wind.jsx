import { useEffect } from "react";
import getWindVector from "../../utils/windVector";

const SVG_NS = "http://www.w3.org/2000/svg";

const Wind = ({ svgRef, regionWeather, regionCoords }) => {
  useEffect(() => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg || !regionWeather?.length || !regionCoords) return;

    const particlesByRegion = {};
    const createdNodes = [];

    const createParticle = (box) => {
      const line = document.createElementNS(SVG_NS, "line");

      const x = box.x + Math.random() * box.width;
      const y = box.y + Math.random() * box.height;
      const len = 12 + Math.random() * 24;

      line.setAttribute("x1", x);
      line.setAttribute("y1", y);
      line.setAttribute("x2", x + len);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(210, 240, 255, 0.55)");
      line.setAttribute("stroke-width", `${0.8 + Math.random() * 0.9}`);
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("filter", "url(#windBlur)");
      line.setAttribute("opacity", `${0.25 + Math.random() * 0.45}`);
      line.style.pointerEvents = "none";

      return {
        el: line,
        x,
        y,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 70 + Math.random() * 80,
        len,
        phase: Math.random() * Math.PI * 2,
      };
    };

    Object.values(regionCoords).forEach((region) => {
      const regionData = regionWeather.find((r) => r.nom === region.nom);
      const el = svg.querySelector(`#${region.id}`);
      if (!el) return;

      const box = el.getBBox();
      const particles = [];

      for (let i = 0; i < 14; i++) {
        const p = createParticle(box);
        svg.appendChild(p.el);
        createdNodes.push(p.el);
        particles.push(p);
      }

      particlesByRegion[region.id] = { particles, box, wind: regionData };
    });

    let frameId;

    const resetParticle = (p, box) => {
      const np = createParticle(box);
      p.x = np.x;
      p.y = np.y;
      p.vx = 0;
      p.vy = 0;
      p.life = 0;
      p.maxLife = np.maxLife;
      p.len = np.len;
      p.phase = np.phase;
      p.el.setAttribute("x1", p.x);
      p.el.setAttribute("y1", p.y);
      p.el.setAttribute("x2", p.x + p.len);
      p.el.setAttribute("y2", p.y);
      p.el.setAttribute("opacity", `${0.25 + Math.random() * 0.45}`);
    };

    const animate = () => {
      Object.values(particlesByRegion).forEach((region) => {
        const wind = region.wind;
        if (!wind) return;

        const dir = getWindVector(wind.windDeg || 0);
        const speed = Math.max(0.5, (wind.windSpeed || 1) * 0.14);

        region.particles.forEach((p) => {
          p.life += 1;

          const t = p.life * 0.06 + p.phase;
          const curlX = Math.sin(t) * 0.03;
          const curlY = Math.cos(t * 0.7) * 0.015;

          p.vx += dir.x * speed * 0.04 + curlX;
          p.vy += dir.y * speed * 0.04 + curlY;

          p.vx *= 0.97;
          p.vy *= 0.97;

          p.x += p.vx;
          p.y += p.vy;

          const trailX = p.x - dir.x * p.len;
          const trailY = p.y - dir.y * p.len;

          p.el.setAttribute("x1", trailX);
          p.el.setAttribute("y1", trailY);
          p.el.setAttribute("x2", p.x);
          p.el.setAttribute("y2", p.y);

          const fade = Math.max(0, 1 - p.life / p.maxLife);
          p.el.setAttribute("opacity", (fade * 0.7).toFixed(2));

          const box = region.box;
          const out =
            p.x < box.x - 30 ||
            p.x > box.x + box.width + 30 ||
            p.y < box.y - 30 ||
            p.y > box.y + box.height + 30 ||
            p.life > p.maxLife;

          if (out) resetParticle(p, box);
        });
      });

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      createdNodes.forEach((n) => n.remove());
    };
  }, [svgRef, regionWeather, regionCoords]);

  return null;
};

export default Wind;
