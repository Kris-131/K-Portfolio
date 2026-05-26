/* ===== CURSOR ===== */
    const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring'), trail = document.getElementById('cur-trail');
    let mx = 0, my = 0, rx = 0, ry = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animC() {
      cur.style.left = mx - 5 + 'px'; cur.style.top = my - 5 + 'px';
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      ring.style.left = rx - 19 + 'px'; ring.style.top = ry - 19 + 'px';
      tx += (mx - tx) * .06; ty += (my - ty) * .06;
      trail.style.left = tx - 3 + 'px'; trail.style.top = ty - 3 + 'px';
      requestAnimationFrame(animC);
    })();
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    /* ===== NEURAL CANVAS ===== */
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', () => { resize(); initNodes(); });
    function initNodes() {
      nodes = [];
      const n = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
          r: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }
    initNodes();
    function drawNeural(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += .02;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        const glow = .4 + Math.sin(n.pulse) * .3;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${glow})`; ctx.fill();
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            const a = (1 - d / 160) * .25;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            g.addColorStop(0, `rgba(0,229,255,${a})`);
            g.addColorStop(1, `rgba(168,85,247,${a})`);
            ctx.strokeStyle = g; ctx.lineWidth = .6; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawNeural);
    }
    drawNeural(0);

    /* ===== FLOATING EMOJIS ===== */
    const emojis = ['🤖', '🧠', '⚡', '🔮', '📡', '💡', '🚀', '🌐', '🔬', '📊', '⚙️', '🛸', '🔐', '🧬', '💻'];
    function spawnEmoji() {
      const e = document.createElement('div');
      e.className = 'float-emoji';
      e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      e.style.left = Math.random() * 100 + 'vw';
      e.style.fontSize = (.8 + Math.random() * .8) + 'rem';
      const dur = 8 + Math.random() * 12;
      e.style.animationDuration = dur + 's';
      e.style.animationDelay = (Math.random() * 3) + 's';
      document.body.appendChild(e);
      setTimeout(() => e.remove(), (dur + 3) * 1000);
    }
    setInterval(spawnEmoji, 1800);
    for (let i = 0; i < 5; i++) setTimeout(spawnEmoji, i * 600);

    /* ===== DATA STREAM ===== */
    const ds = document.getElementById('data-stream');
    const streamChars = '01ABCDEFabcdef█▓▒░∑∫αβλ∂∇⊕⊗';
    function streamTick() {
      const line = document.createElement('div');
      let s = ''; for (let i = 0; i < 14; i++)s += streamChars[Math.floor(Math.random() * streamChars.length)];
      line.textContent = s;
      ds.insertBefore(line, ds.firstChild);
      if (ds.children.length > 60) ds.removeChild(ds.lastChild);
    }
    setInterval(streamTick, 120);

    /* ===== TYPEWRITER ===== */
    const tw = document.getElementById('tw');
    const phrases = ['Building intelligent systems...', 'AI & ML engineer in training.', 'Turning data into decisions.', 'Generative AI enthusiast.'];
    let pi = 0, ci = 0, del = false;
    function type() {
      const cur = phrases[pi];
      if (!del) {
        tw.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(type, 2200); return; }
      } else {
        tw.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(type, del ? 60 : 90);
    }
    setTimeout(type, 1800);

    /* ===== SCROLL REVEAL ===== */
    const allReveal = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    const ro = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (i % 4) * .1 + 's';
          e.target.classList.add('visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: .12 });
    allReveal.forEach(el => ro.observe(el));

    /* ===== SKILL BARS ===== */
    document.querySelectorAll('.skill-bar-fill').forEach(b => {
      const bo = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { b.classList.add('on'); bo.disconnect(); }
      }, { threshold: .5 });
      bo.observe(b);
    });

    /* ===== COUNTERS ===== */
    document.querySelectorAll('.counter').forEach(el => {
      const target = parseFloat(el.dataset.target), dec = parseInt(el.dataset.dec) || 0;
      const co = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        let start = 0, startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / 1500, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = ease * target;
          el.textContent = dec === 0 ? Math.floor(val) : val.toFixed(dec);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = dec === 0 ? target : target.toFixed(dec);
        }
        requestAnimationFrame(step);
        co.disconnect();
      }, { threshold: .5 });
      co.observe(el);
    });

    /* ===== NAV SCROLL ===== */
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      let cur = '';
      document.querySelectorAll('section[id]').forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) cur = s.id;
      });
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent-cyan)' : '';
      });
    });

    /* ===== RESUME DOWNLOAD ===== */
    /* Download Functions */);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'Krish_Mavani_CV.pdf';
      a.click(); URL.revokeObjectURL(url);
    }
    ['dl-btn', 'nav-dl'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', e => { e.preventDefault(); downloadResume(); });
    });
    const cvBtn = document.getElementById('dl-cv-btn');
    if (cvBtn) cvBtn.addEventListener('click', e => { e.preventDefault(); downloadCV(); });

    /* ===== PARALLAX ORBS ===== */
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      document.querySelectorAll('.orb').forEach((o, i) => {
        o.style.transform = `translateY(${sy * (i % 2 === 0 ? .08 : .05)}px)`;
      });
    });

    /* ===== PARTICLES ===== */
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width = size + 'px'; p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (12 + Math.random() * 20) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
      p.style.opacity = Math.random() * .6 + .2;
      if (Math.random() > .6) p.style.background = 'var(--accent-violet)';
      document.body.appendChild(p);
    }

    /* ===== TILT CARDS ===== */
    document.querySelectorAll('.project-card,.skill-item,.ai-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const cx = r.width / 2, cy = r.height / 2;
        const rx2 = (y - cy) / cy * 5, ry2 = -(x - cx) / cx * 5;
        card.style.transform = `perspective(600px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  </script>
<script>
var _btechPDF = "assets/Krish_Mavani_BTech_Results.pdf";
var _result12PDF = "assets/Krish_Mavani_12th_Results.pdf";
var _result10PDF = "assets/Krish_Mavani_10th_Results.pdf";
function _dlPDF(b64, filename) {
  var bc = atob(b64), bn = new Uint8Array(bc.length);
  for (var i=0;i<bc.length;i++) bn[i]=bc.charCodeAt(i);
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bn],{type:"application/pdf"}));
  a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}
/* Results Functions */
</script>
<div class="km-cursor"></div><script>
(function(){
  // Scroll reveal
  const revealEls = document.querySelectorAll('.km-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('km-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealEls.forEach(el => observer.observe(el));

  // Cursor follower for desktop
  const cursor = document.querySelector('.km-cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let rafId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.22;
      currentY += dy * 0.22;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.style.opacity = '1';
      if (!rafId) rafId = requestAnimationFrame(render);
    });

    window.addEventListener('pointerleave', () => {
      cursor.style.opacity = '0';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }
})();

    function downloadResume() {
      const link = document.createElement('a');
      link.href = 'assets/Krish_Mavani_Resume.pdf';
      link.download = 'Krish_Mavani_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    function downloadCV() {
      const link = document.createElement('a');
      link.href = 'assets/Krish_Mavani_CV.pdf';
      link.download = 'Krish_Mavani_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    function downloadBTechResult(e) {
      if (e) e.preventDefault();
      const link = document.createElement('a');
      link.href = 'assets/Krish_Mavani_BTech_Results.pdf';
      link.download = 'Krish_Mavani_BTech_Results.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    function download12thResult(e) {
      if (e) e.preventDefault();
      const link = document.createElement('a');
      link.href = 'assets/Krish_Mavani_12th_Results.pdf';
      link.download = 'Krish_Mavani_12th_Results.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    function download10thResult(e) {
      if (e) e.preventDefault();
      const link = document.createElement('a');
      link.href = 'assets/Krish_Mavani_10th_Results.pdf';
      link.download = 'Krish_Mavani_10th_Results.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }