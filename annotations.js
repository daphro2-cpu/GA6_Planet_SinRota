/* Classroom annotation tools: ink is deliberately local to this browser tab. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #ink-layer{position:fixed;inset:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;touch-action:none}
    #ink-layer.drawing{pointer-events:auto;cursor:crosshair}
    #ink-tools{position:fixed;top:50%;left:8px;transform:translateY(-50%);z-index:9999;display:flex;flex-direction:column;gap:5px;align-items:stretch;justify-content:center;width:100px;padding:7px;background:#fffdf6;border:3px solid #243044;border-radius:18px;box-shadow:4px 5px 0 #243044;font:700 12px system-ui,sans-serif}
    #ink-tools button{border:2px solid #243044!important;background:#fff!important;color:#243044!important;border-radius:10px!important;padding:8px 4px!important;font:inherit!important;min-height:42px;cursor:pointer}
    #ink-tools button.active{background:#f8d755!important}
    #ink-tools button.ink-highlight.active{background:#ffe879!important}
    #ink-tools .ink-close{background:#dff3ff!important}
    #ink-tools .ink-label{font-size:11px;line-height:1.2;text-align:center}
    @media(max-width:600px){#ink-tools{left:3px;width:51px;padding:4px;gap:4px;border-radius:12px}#ink-tools button{padding:5px 2px!important;font-size:19px!important;min-height:39px}#ink-tools .ink-label,#ink-tools .ink-text{display:none}}
  `;
  document.head.append(style);
  const canvas = document.createElement('canvas'); canvas.id = 'ink-layer';
  document.body.append(canvas);
  const bar = document.createElement('div'); bar.id='ink-tools'; bar.setAttribute('role','toolbar'); bar.setAttribute('aria-label','Classroom drawing tools');
  bar.innerHTML = '<span class="ink-label">✏️ Classroom board</span><button data-tool="interact" class="active ink-close" title="Interact with lesson" aria-label="Interact with lesson">👆 <span class="ink-text">Interact</span></button><button data-tool="pen" title="Pen" aria-label="Pen">✏️ <span class="ink-text">Pen</span></button><button data-tool="highlight" class="ink-highlight" title="Highlight" aria-label="Highlight">🟨 <span class="ink-text">Highlight</span></button><button data-tool="erase" title="Eraser" aria-label="Eraser">◻️ <span class="ink-text">Erase</span></button><button data-action="undo" title="Undo" aria-label="Undo">↶ <span class="ink-text">Undo</span></button><button data-action="clear" title="Clear" aria-label="Clear">🗑 <span class="ink-text">Clear</span></button>';
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
