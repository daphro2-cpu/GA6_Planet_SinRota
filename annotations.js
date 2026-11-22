/* Classroom annotation tools: ink is deliberately local to this browser tab. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #ink-layer{position:fixed;inset:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;touch-action:none}
    #ink-layer.drawing{pointer-events:auto;cursor:crosshair}
    #ink-tools{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:center;max-width:calc(100vw - 20px);padding:8px;background:#fffdf6;border:3px solid #243044;border-radius:18px;box-shadow:4px 5px 0 #243044;font:700 14px system-ui,sans-serif}
    #ink-tools button{border:2px solid #243044!important;background:#fff!important;color:#243044!important;border-radius:10px!important;padding:8px 11px!important;font:inherit!important;min-height:40px;cursor:pointer}
    #ink-tools button.active{background:#f8d755!important}
    #ink-tools button.ink-highlight.active{background:#ffe879!important}
    #ink-tools .ink-close{background:#dff3ff!important}
    #ink-tools .ink-label{font-size:13px;margin:0 3px;white-space:nowrap}
    @media(max-width:600px){#ink-tools{bottom:8px;padding:5px;gap:3px}#ink-tools button{padding:6px 7px!important;font-size:12px!important;min-height:36px}#ink-tools .ink-label{display:none}}
  `;
  document.head.append(style);
  const canvas = document.createElement('canvas'); canvas.id = 'ink-layer';
  document.body.append(canvas);
  const bar = document.createElement('div'); bar.id='ink-tools'; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label','Classroom drawing tools');
  bar.innerHTML = '<span class="ink-label">✏️ Classroom board</span><button data-tool="interact" class="active ink-close" title="Use the lesson normally">👆 Interact</button><button data-tool="pen">✏️ Pen</button><button data-tool="highlight" class="ink-highlight">🟨 Highlight</button><button data-tool="erase">◻️ Erase</button><button data-action="undo">↶ Undo</button><button data-action="clear">🗑 Clear</button>';
  document.body.append(bar);
  const ctx=canvas.getContext('2d');
  let tool='interact', strokes=[], active=null, pixelRatio=1;
  const width=()=>window.innerWidth, height=()=>window.innerHeight;
  function resize(){pixelRatio=Math.min(devicePixelRatio||1,3);canvas.width=Math.round(width()*pixelRatio);canvas.height=Math.round(height()*pixelRatio);ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);redraw();}
  function drawStroke(s){if(!s.points.length)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=s.tool==='highlight'?24:s.tool==='erase'?34:4;ctx.strokeStyle=s.tool==='highlight'?'rgba(255,221,20,.42)':'#e62d72';ctx.globalCompositeOperation=s.tool==='erase'?'destination-out':'source-over';ctx.beginPath();s.points.forEach((p,i)=>{let x=p.x*width(),y=p.y*height();i?ctx.lineTo(x,y):ctx.moveTo(x,y)});if(s.points.length===1){const p=s.points[0];ctx.lineTo(p.x*width()+.1,p.y*height()+.1)}ctx.stroke();ctx.restore()}
  function redraw(){ctx.clearRect(0,0,width(),height());strokes.forEach(drawStroke);if(active)drawStroke(active)}
  function setTool(t){tool=t;canvas.classList.toggle('drawing',t!=='interact');bar.querySelectorAll('[data-tool]').forEach(b=>{b.classList.toggle('active',b.dataset.tool===t);b.setAttribute('aria-pressed',String(b.dataset.tool===t))})}
  function point(e){return {x:e.clientX/width(),y:e.clientY/height()}}
  canvas.addEventListener('pointerdown',e=>{if(tool==='interact')return;e.preventDefault();canvas.setPointerCapture(e.pointerId);active={tool,points:[point(e)]};redraw()});
  canvas.addEventListener('pointermove',e=>{if(!active)return;e.preventDefault();active.points.push(point(e));redraw()});
  function finish(e){if(!active)return;active.points.push(point(e));strokes.push(active);active=null;redraw()}
  canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tool){setTool(b.dataset.tool);return}if(b.dataset.action==='undo'){strokes.pop();redraw()}if(b.dataset.action==='clear'&&strokes.length&&confirm('Erase all your annotations?')){strokes=[];redraw()}});
  window.addEventListener('resize',resize);resize();setTool('interact');
})();
