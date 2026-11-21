(function(){
// Each comic is one square in a 4-column by 3-row sprite sheet.
// Keep its viewport square so that the complete panel is visible at all sizes.
const sceneStyle=document.createElement('style');
sceneStyle.textContent=`#visual:not(.free):not(.duel){aspect-ratio:1/1;height:auto!important;max-height:none!important;background-size:400% 300%!important;background-repeat:no-repeat!important;background-color:#bdeafa}`;
document.head.appendChild(sceneStyle);
// Switching tabs previously left an inline background-image:none on the scene div.
const beforeFix=render;
render=function(){beforeFix();const v=document.getElementById('visual');if(mode==='discover'){v.style.backgroundImage="url('./comic-scenes.png')";v.style.backgroundSize='400% 300%';v.style.backgroundRepeat='no-repeat';const col=i%4,row=Math.floor(i/4);v.style.backgroundPosition=`${col*100/3}% ${row*50}%`;}else if(mode==='compare'){v.style.backgroundImage='none'}};
render();
// Always let the teacher stop narration, including in the middle of a paragraph.
let listening=false,paused=false;
let availableVoices=[];
function refreshVoices(){availableVoices=speechSynthesis.getVoices()||[]}
function naturalEnglishVoice(){
  const english=availableVoices.filter(v=>/^en([_-]|$)/i.test(v.lang));
  const priority=v=>{
    const n=v.name.toLowerCase();
    let score=/en[-_]us/i.test(v.lang)?30:0;
    if(/natural|neural|premium|enhanced/.test(n))score+=100;
    if(/google us english|microsoft.*(jenny|aria|guy)|samantha|ava|allison/.test(n))score+=80;
    if(v.localService)score+=10;
    return score;
  };
  return english.sort((a,b)=>priority(b)-priority(a))[0]||null;
}
if('speechSynthesis'in window){refreshVoices();speechSynthesis.addEventListener?.('voiceschanged',refreshVoices)}
async function readyVoice(){
  refreshVoices();if(availableVoices.length)return naturalEnglishVoice();
  // Some browsers populate speech voices shortly after the first request.
  await new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;speechSynthesis.removeEventListener?.('voiceschanged',finish);clearTimeout(timer);resolve()};const timer=setTimeout(finish,1300);speechSynthesis.addEventListener?.('voiceschanged',finish)});
  refreshVoices();return naturalEnglishVoice();
}
let readRequest=0;
function stopReading(){if('speechSynthesis'in window){speechSynthesis.cancel()}listening=false;paused=false;updateControls()}
function updateControls(){const play=document.getElementById('readaloud');if(play)play.textContent=listening?(paused?'▶ Resume reading':'⏸ Pause reading'):'🔊 Read this page';const pa=document.getElementById('pauseaudio');if(pa)pa.textContent=paused?'▶ Resume':'⏸ Pause'}
document.addEventListener('click',async e=>{const play=e.target.closest('#readaloud');if(play){e.preventDefault();e.stopImmediatePropagation();if(!('speechSynthesis'in window))return;if(listening){if(paused){speechSynthesis.resume();paused=false}else{speechSynthesis.pause();paused=true}}else{speechSynthesis.cancel();const txt=document.querySelector('.read-text')?.textContent||'';if(!txt)return;const request=++readRequest;play.textContent='🎙️ Preparing natural voice…';const voice=await readyVoice();if(request!==readRequest)return;let u=new SpeechSynthesisUtterance(txt);u.lang='en-US';if(voice)u.voice=voice;u.rate=.96;u.pitch=1;u.onend=()=>{listening=false;paused=false;updateControls()};u.onerror=()=>{listening=false;paused=false;updateControls()};speechSynthesis.speak(u);listening=true;paused=false}updateControls();return}if(e.target.closest('#stopaudio')){readRequest++;stopReading();return}if(e.target.closest('#pauseaudio')){if(!listening)return;if(paused){speechSynthesis.resume();paused=false}else{speechSynthesis.pause();paused=true}updateControls();return}if(e.target.closest('#readnext,#readprev,#backvocab,.read-tabs button,.nav button,#contextsay')){readRequest++;stopReading()}},true);
const stopBtn=document.createElement('button');stopBtn.id='stopaudio';stopBtn.className='audio-stop';stopBtn.textContent='■ Stop reading';const pauseBtn=document.createElement('button');pauseBtn.id='pauseaudio';pauseBtn.className='audio-stop';pauseBtn.textContent='⏸ Pause';const group=document.createElement('div');group.className='audio-toolbar';group.append(pauseBtn,stopBtn);document.querySelector('#reader').prepend(group);
const observer=new MutationObserver(()=>{if(!document.getElementById('stopaudio')){document.querySelector('#reader')?.prepend(group);updateControls()}});observer.observe(document.getElementById('reader'),{childList:true});
})();
