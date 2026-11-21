(function(){
const descriptions=[
 ['An adventurous person chooses a daring challenge.','A firefighter goes toward danger to help.'],
 ['A rocket launch makes the children cheer.','A roller coaster gives a strong rush.'],
 ['The bridge could cause harm.','Wearing summer clothes in snow is a poor decision.'],
 ['A child follows the instruction to stop.','The climber refuses to give up.'],
 ['The girl wins a prize by luck.','Zoog cannot stop looking at a new discovery.'],
 ['The glass egg could break easily.','Counting the same objects for hours is boring.']
];
let duelResults={},duelIdentity='';
const scene=document.querySelector('.scene');const game=document.createElement('div');game.id='duelgame';game.className='duel-game hidden';const instruction=document.createElement('div');instruction.className='duel-start hidden';instruction.textContent='👆 Choose a word under EACH picture!';scene.querySelector('.visual').after(instruction,game);
function drawDuel(){const active=mode==='compare';game.classList.toggle('hidden',!active);instruction.classList.toggle('hidden',!active);scene.classList.toggle('duel-active',active);if(!active)return;const identity=''+i;if(duelIdentity!==identity){duelIdentity=identity;duelResults={}}const pair=pairs[i],indices=duelIndices[i],words=[pair.a,pair.b];game.innerHTML=indices.map((id,j)=>{const col=id%4,row=Math.floor(id/4);return `<div class="duel-card"><div class="duel-art"><img alt="Comic scenario ${j+1}" src="./comic-scenes.png" style="width:400%;height:300%;position:absolute;left:-${col*100}%;top:-${row*100}%"></div><div class="duel-question">${descriptions[i][j]}</div><div class="duel-choices">${words.map((w,k)=>`<button class="duel-choice ${duelResults[j]===k?'correct':''}" data-side="${j}" data-pick="${k}">${w}</button>`).join('')}</div><div class="duel-result" id="duelresult${j}">${duelResults[j]!==undefined?'✅ Yes! '+words[j]+' fits this picture.':'Talk first. Then click!'}</div></div>`}).join('');game.querySelectorAll('.duel-choice').forEach(b=>b.onclick=()=>{const side=Number(b.dataset.side),pick=Number(b.dataset.pick),correct=side===pick;feedbackSound(correct);const parent=b.closest('.duel-card');parent.querySelectorAll('.duel-choice').forEach(z=>z.classList.remove('correct','wrong'));b.classList.add(correct?'correct':'wrong');parent.querySelector('.duel-result').textContent=correct?'🔔 DING! Exactly. '+pairs[i].tip:'💨 PFFT! Not this one. Think about what the person is doing.';if(correct)duelResults[side]=pick});$('heading').textContent='TAP THE BEST WORD!';$('paneltitle').textContent='DISCUSS, THEN CLICK';$('question').textContent='Choose a word beneath each picture. Correct = ding! Wrong = pffft! Explain your choice.'}
const originalDraw=render;render=function(){originalDraw();drawDuel()};render();
})();
