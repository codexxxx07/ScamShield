import { useEffect, useRef, useState } from 'react';

export default function MatrixIntro({ onEnter }) {
  const canvasRef = useRef(null);
  const [welcome, setWelcome] = useState('');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener('change', updateMotionPreference);
    return () => motionQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const fullText = 'WELCOME TO CYBER SHIELD';
    if (reducedMotion) {
      setWelcome(fullText);
      return undefined;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setWelcome(fullText.slice(0, index));
      if (index >= fullText.length) window.clearInterval(timer);
    }, 45);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || reducedMotion) return undefined;
    let animationFrame;
    let lastFrame = 0;
    const fontSize = 14;
    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let drops = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array(Math.ceil(window.innerWidth / fontSize)).fill(0);
    };
    const draw = (time) => {
      animationFrame = window.requestAnimationFrame(draw);
      if (time - lastFrame < 90) return;
      lastFrame = time;
      context.fillStyle = 'rgba(0, 0, 0, 0.10)';
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = '#00ff99';
      context.font = `${fontSize}px monospace`;
      drops.forEach((drop, index) => {
        context.fillText(characters[Math.floor(Math.random() * characters.length)], index * fontSize, drop * fontSize);
        if (drop * fontSize > window.innerHeight && Math.random() > 0.98) drops[index] = 0;
        else drops[index] += 1;
      });
    };
    resize();
    window.addEventListener('resize', resize);
    animationFrame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return <div className="matrix-screen" role="dialog" aria-modal="true" aria-labelledby="welcomeTyping">
    <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />
    <div className="center-box">
      <div className="center-logo" aria-hidden="true"><i className="fas fa-shield-halved" /></div>
      <h1 id="welcomeTyping" aria-live="polite">{welcome}<span className="typing-cursor" aria-hidden="true">_</span></h1>
      <p className="center-tagline">Explainable phishing-awareness checks</p>
      <button className="enter-button" type="button" onClick={onEnter} aria-label="Enter CODEX AI Cyber Shield"><i className="fas fa-terminal" aria-hidden="true" /><span>Enter</span></button>
      <p className="intro-note">Rule-based · local only · never opens submitted links</p>
    </div>
  </div>;
}
