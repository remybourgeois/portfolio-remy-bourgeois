<!-- src/lib/components/IntroScene.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import * as THREE from 'three';
  import { audioStore, SFX_SUCCESS } from '$lib/stores/audio';
  import { introDone } from '$lib/stores/intro';
  import { POETIC_PHRASES } from '$lib/data/phrases';
  import Icon from '$lib/components/Icons.svelte';

  const PRIMARY   = '#706bfe';
  const SECONDARY = '#a78bfa';
  const TERTIARY  = '#38bdf8';
  const HOT       = '#ffffff';
  const ANIM_DURATION = 3000;
  const TRANSITION_DELAY = 500;

  // ── Geometry helpers ──
  const getSpherePoint   = (r: number) => { const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1); return {x:r*Math.sin(ph)*Math.cos(th),y:r*Math.sin(ph)*Math.sin(th),z:r*Math.cos(ph)}; };
  const getHeartPoint    = (s: number) => { const t=Math.random()*Math.PI*2,r=Math.pow(Math.random(),.3),sc=s*.12,o=1+(Math.random()-.5)*.1; return {x:16*Math.pow(Math.sin(t),3)*sc*r*o,y:(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*sc*r*o+.8,z:(Math.random()-.5)*s*.6*r}; };
  const getCubePoint     = (s: number) => ({x:(Math.random()-.5)*s,y:(Math.random()-.5)*s,z:(Math.random()-.5)*s});
  const getTorusPoint    = (R: number,r: number) => { const u=Math.random()*Math.PI*2,v=Math.random()*Math.PI*2; return {x:(R+r*Math.cos(v))*Math.cos(u),y:(R+r*Math.cos(v))*Math.sin(u),z:r*Math.sin(v)}; };
  const getSpiralPoint   = (h: number,r: number) => { const t=Math.random()*h*2,a=t*.5; return {x:r*Math.cos(a),y:t-h,z:r*Math.sin(a)}; };
  const getDiamondPoint  = (s: number): {x:number,y:number,z:number} => { const x=(Math.random()-.5)*s,y=(Math.random()-.5)*s,z=(Math.random()-.5)*s; if(Math.abs(x)+Math.abs(y)+Math.abs(z)>s/2) return getDiamondPoint(s); return {x,y,z}; };
  const getRingPoint     = (r: number,w: number) => { const th=Math.random()*Math.PI*2,rad=r+(Math.random()-.5)*w; return {x:rad*Math.cos(th),y:(Math.random()-.5)*.2,z:rad*Math.sin(th)}; };
  const getCylinderPoint = (r: number,h: number) => { const th=Math.random()*Math.PI*2; return {x:r*Math.cos(th),y:(Math.random()-.5)*h,z:r*Math.sin(th)}; };
  const getInfinityPoint = (s: number,th: number) => {
    const t=Math.random()*Math.PI*2,d=1+Math.sin(t)*Math.sin(t);
    const x=(s*Math.cos(t))/d,y=(s*Math.sin(t)*Math.cos(t))/d;
    const a=Math.random()*Math.PI*2,rr=Math.random()*th;
    return {x:x+rr*Math.cos(a),y:y+rr*Math.sin(a),z:(Math.random()-.5)*th*2};
  };

  let mountEl: HTMLDivElement;
  let sceneStep = 0;
  let clickCount = 0;
  let currentMessage: typeof POETIC_PHRASES[0] | null = null;
  let messageVisible = false;
  let isClickAnimating = false;
  let sfxIndex = 0;
  let isMuted = false;
  $: isMuted = $audioStore.isMuted;

  let reqId: number;
  let renderer: THREE.WebGLRenderer;
  let particlesSystem: THREE.Points;
  let bgSystem: THREE.Points;
  const mouseVec  = new THREE.Vector2();
  const prevMouse = new THREE.Vector2();
  let velocityVal = 0, frictionHeat = 0, vibration = 0, flood = 0;
  let targetGeometry = 'sphere';
  let isLocked = false, isReturning = false;
  let time = 0;
  let introStartTime: number | null = null;
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // position arrays — init lazily in onMount
  let spherePos: Float32Array, heartPos: Float32Array, cubePos: Float32Array;
  let torusPos: Float32Array, spiralPos: Float32Array, diamondPos: Float32Array;
  let ringPos: Float32Array, cylinderPos: Float32Array, infinityPos: Float32Array;
  let N = 0;

  onMount(() => {
    // Si l'intro a déjà été faite (retour depuis /projects), skip directement au contenu
    if (get(introDone)) {
      sceneStep = 2;
    }

    const w = window.innerWidth, h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020205');
    scene.fog = new THREE.FogExp2(0x020205, 0.002);
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 7;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.setAttribute('role', 'presentation');
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    N = prefersReducedMotion ? 500 : 2800;
    const positions = new Float32Array(N*3), colors = new Float32Array(N*3);
    spherePos   = new Float32Array(N*3); heartPos    = new Float32Array(N*3);
    cubePos     = new Float32Array(N*3); torusPos    = new Float32Array(N*3);
    spiralPos   = new Float32Array(N*3); diamondPos  = new Float32Array(N*3);
    ringPos     = new Float32Array(N*3); cylinderPos = new Float32Array(N*3);
    infinityPos = new Float32Array(N*3);
    const colorBase = new THREE.Color(PRIMARY);

    for (let i=0;i<N;i++) {
      const i3=i*3;
      const s=getSpherePoint(2.5);    spherePos[i3]=s.x;    spherePos[i3+1]=s.y;    spherePos[i3+2]=s.z;
      const hh=getHeartPoint(2.5);    heartPos[i3]=hh.x;    heartPos[i3+1]=hh.y;    heartPos[i3+2]=hh.z;
      const c=getCubePoint(3.5);      cubePos[i3]=c.x;      cubePos[i3+1]=c.y;      cubePos[i3+2]=c.z;
      const tt=getTorusPoint(2,.8);   torusPos[i3]=tt.x;    torusPos[i3+1]=tt.y;    torusPos[i3+2]=tt.z;
      const sp=getSpiralPoint(4,1.5); spiralPos[i3]=sp.x;   spiralPos[i3+1]=sp.y;   spiralPos[i3+2]=sp.z;
      const d=getDiamondPoint(4.5);   diamondPos[i3]=d.x;   diamondPos[i3+1]=d.y;   diamondPos[i3+2]=d.z;
      const r=getRingPoint(3.5,.5);   ringPos[i3]=r.x;      ringPos[i3+1]=r.y;      ringPos[i3+2]=r.z;
      const cy=getCylinderPoint(1.5,5);cylinderPos[i3]=cy.x;cylinderPos[i3+1]=cy.y;cylinderPos[i3+2]=cy.z;
      const inf=getInfinityPoint(4,.6);infinityPos[i3]=inf.x;infinityPos[i3+1]=inf.y;infinityPos[i3+2]=inf.z;
      positions[i3]=s.x; positions[i3+1]=s.y; positions[i3+2]=s.z;
      colors[i3]=colorBase.r; colors[i3+1]=colorBase.g; colors[i3+2]=colorBase.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors,3));
    const sprite = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png');
    const mat = new THREE.PointsMaterial({size:.15,map:sprite,transparent:true,opacity:.85,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false});
    particlesSystem = new THREE.Points(geo,mat);
    scene.add(particlesSystem);

    const bgN = prefersReducedMotion ? 200 : 2500;
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(bgN*3), bgCol = new Float32Array(bgN*3);
    const bgVel: {x:number,y:number,z:number}[] = [];
    for (let i=0;i<bgN;i++) {
      const i3=i*3;
      bgPos[i3]=(Math.random()-.5)*35; bgPos[i3+1]=(Math.random()-.5)*35; bgPos[i3+2]=(Math.random()-.5)*20-5;
      const rand=Math.random();
      const col=new THREE.Color(rand>.7?PRIMARY:rand>.4?SECONDARY:'#ffffff');
      bgCol[i3]=col.r; bgCol[i3+1]=col.g; bgCol[i3+2]=col.b;
      bgVel.push({x:(Math.random()-.5)*.01,y:(Math.random()-.5)*.01,z:(Math.random()-.5)*.01});
    }
    bgGeo.setAttribute('position',new THREE.BufferAttribute(bgPos,3));
    bgGeo.setAttribute('color',new THREE.BufferAttribute(bgCol,3));
    const bgMat = new THREE.PointsMaterial({size:.09,map:sprite,transparent:true,opacity:.5,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false});
    bgSystem = new THREE.Points(bgGeo,bgMat);
    scene.add(bgSystem);

    const shapeMap: Record<string,Float32Array> = {
      sphere:spherePos, torus:torusPos, cube:cubePos, breathing:spherePos,
      spiral:spiralPos, diamond:diamondPos, wave:spherePos, ring:ringPos,
      heart:heartPos, cylinder:cylinderPos, infinity:infinityPos
    };

    const targetColor = new THREE.Color(PRIMARY);
    const hotColor    = new THREE.Color(HOT);
    const tempColor   = new THREE.Color();
    const curPosV = new THREE.Vector3(), tarPosV = new THREE.Vector3();
    let curRotX=0, curRotY=0;
    const speedFactor = prefersReducedMotion ? 0.1 : 1.0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      time += 0.008 * speedFactor;

      let introFactor = 0;
      if (introStartTime !== null) {
        const elapsed = (Date.now() - introStartTime) / 1000;
        if (elapsed < 2) introFactor = Math.sin((elapsed/2)*Math.PI);
        else introStartTime = null;
      }

      const dx = mouseVec.x - prevMouse.x, dy = mouseVec.y - prevMouse.y;
      velocityVal += (Math.sqrt(dx*dx+dy*dy) - velocityVal) * 0.1;
      frictionHeat *= 0.92;
      if (velocityVal > 0.02) frictionHeat += velocityVal * 0.5;
      audioStore.engine?.updateStatic(frictionHeat);

      if (vibration > 0) vibration = Math.max(0, vibration - 0.05);
      if (flood !== 0) flood = flood > 0 ? flood + 0.01 : (flood+.05 > 0 ? 0 : flood+.05);

      const tRX = prefersReducedMotion ? .001 : .001+mouseVec.y*.3;
      const tRY = prefersReducedMotion ? .002 : .002+mouseVec.x*.3;
      const iner = prefersReducedMotion ? .01 : .03;
      curRotX += (tRX - curRotX) * iner;
      curRotY += (tRY - curRotY) * iner + .003*speedFactor;
      particlesSystem.rotation.x = curRotX;
      particlesSystem.rotation.y = curRotY;

      const tX = prefersReducedMotion ? 0 : mouseVec.x*.8;
      const tY = prefersReducedMotion ? 0 : mouseVec.y*.8;
      particlesSystem.position.x += (tX - particlesSystem.position.x) * (prefersReducedMotion?.02:.08);
      particlesSystem.position.y += (tY - particlesSystem.position.y) * (prefersReducedMotion?.02:.08);

      const shape = targetGeometry;
      if (['heart','breathing'].includes(shape)) targetColor.set(PRIMARY);
      else if (['cube','diamond'].includes(shape)) targetColor.set(SECONDARY);
      else if (['spiral','ring','infinity'].includes(shape)) targetColor.set(TERTIARY);
      else targetColor.set(PRIMARY);

      const tarArr = shapeMap[shape] ?? spherePos;
      const posAttr = particlesSystem.geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = particlesSystem.geometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      for (let i=0;i<N;i++) {
        const i3=i*3;
        let tx=tarArr[i3], ty=tarArr[i3+1], tz=tarArr[i3+2];
        if (!prefersReducedMotion) {
          if (shape==='heart') { const b=1+Math.sin(time*4)*.03; tx*=b; ty*=b; tz*=b; }
          else if (shape==='breathing') { const b=1+Math.sin(time*3+i*.01)*.15; tx*=b; ty*=b; tz*=b; }
          else if (shape==='wave') { tx+=Math.sin(time*2+ty)*.2; tz+=Math.cos(time*2+tx)*.2; }
        }
        if (introFactor>0) { const e=1+introFactor*.2; tx*=e; ty*=e; tz*=e; }
        if (frictionHeat>0.01) { const hh=frictionHeat*2; tx+=(Math.random()-.5)*hh; ty+=(Math.random()-.5)*hh; tz+=(Math.random()-.5)*hh; }
        if (vibration>0) { const sh=(Math.random()-.5)*vibration*.5; tx+=sh; ty+=sh; tz+=sh; }
        if (flood!==0) { const f=Math.abs(flood); tx*=(1+f*30); ty*=(1+f*30); tz+=f*25; }

        curPosV.set(posArr[i3], posArr[i3+1], posArr[i3+2]);
        tarPosV.set(tx,ty,tz);
        const spd = isReturning ? .12 : isLocked ? .08 : frictionHeat>.5 ? .2 : prefersReducedMotion ? .01 : .03;
        curPosV.lerp(tarPosV, spd);
        posArr[i3]=curPosV.x; posArr[i3+1]=curPosV.y; posArr[i3+2]=curPosV.z;
        tempColor.setRGB(colArr[i3], colArr[i3+1], colArr[i3+2]);
        tempColor.lerp(targetColor.clone().lerp(hotColor,Math.min(1,frictionHeat*1.5)), .1);
        colArr[i3]=tempColor.r; colArr[i3+1]=tempColor.g; colArr[i3+2]=tempColor.b;
      }
      posAttr.needsUpdate = true; colAttr.needsUpdate = true;

      const bgPosAttr = bgSystem.geometry.attributes.position as THREE.BufferAttribute;
      const bgPosArray = bgPosAttr.array as Float32Array;
      for (let i=0;i<bgN;i++) {
        const i3=i*3;
        bgPosArray[i3]+=bgVel[i].x*speedFactor; bgPosArray[i3+1]+=bgVel[i].y*speedFactor;
        if (Math.abs(bgPosArray[i3])>15) bgPosArray[i3]*=-.9;
        if (Math.abs(bgPosArray[i3+1])>15) bgPosArray[i3+1]*=-.9;
      }
      bgPosAttr.needsUpdate = true;
      bgSystem.rotation.y = time*.05*speedFactor;

      prevMouse.copy(mouseVec);
      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      prevMouse.copy(mouseVec);
      mouseVec.x = (e.clientX/window.innerWidth)*2-1;
      mouseVec.y = -(e.clientY/window.innerHeight)*2+1;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  });

  function handlePointerDown(e: PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    audioStore.engine?.init();
    if (sceneStep < 2) audioStore.engine?.wakeUp();

    if (sceneStep === 2) return;

    if (sceneStep === 0) {
      sceneStep = 1;
      introStartTime = Date.now();
      if (!isMuted) { audioStore.engine?.playIntro(); audioStore.engine?.startBGM(); }
      return;
    }

    if (clickCount >= 10) return;

    const next = clickCount + 1;
    const phraseIdx = next - 1;

    if (!isMuted) {
      if (next < 10) {
        const url = `/assets/sfx-${(sfxIndex % 9) + 1}.ogg`;
        audioStore.engine?.playSound(url);
        sfxIndex++;
      } else if (next === 10) {
        audioStore.engine?.playSound(SFX_SUCCESS);
      }
    }

    isClickAnimating = true;
    setTimeout(() => isClickAnimating = false, 300);
    vibration = 1.0;

    if (POETIC_PHRASES[phraseIdx]) {
      targetGeometry = POETIC_PHRASES[phraseIdx].shape;
      isLocked = true; isReturning = false;
      currentMessage = POETIC_PHRASES[phraseIdx];
      messageVisible = true;

      setTimeout(() => {
        messageVisible = false;
        if (next < 10) {
          targetGeometry = 'sphere';
          isLocked = false; isReturning = true;
          setTimeout(() => { isReturning = false; }, 2200);
        }
      }, ANIM_DURATION);
    }

    clickCount = next;

    if (next === 10) {
      setTimeout(() => { if (!isMuted) audioStore.engine?.fadeOutBGM(); }, ANIM_DURATION);
      setTimeout(() => { flood = 0.1; }, ANIM_DURATION);
      setTimeout(() => {
        sceneStep = 2;
        introDone.set(true);
      }, ANIM_DURATION + TRANSITION_DELAY);
    }
  }
</script>

<div
  class="relative w-full h-[100dvh] bg-[#020205] overflow-hidden select-none text-white custom-cursor"
  role="application"
  aria-label="Expérience immersive portfolio"
  on:pointerdown={handlePointerDown}
>
  <div bind:this={mountEl} class="absolute inset-0 z-0" aria-hidden="true"></div>

  <!-- Sound toggle -->
  <div class="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto z-50
              transition-all duration-500 {sceneStep < 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}">
    <button
      on:click|stopPropagation={audioStore.toggleMute}
      aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
      aria-pressed={!isMuted}
      class="w-full md:w-auto flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl
             border border-white/10 rounded-xl px-5 py-3 hover:bg-white/10 hover:border-white/20
             transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-[#706bfe]"
    >
      <div class="w-2 h-2 rounded-full {isMuted ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}"></div>
      <span class="text-[10px] uppercase tracking-widest font-medium text-white/70">
        Sound Experience {isMuted ? 'OFF' : 'ON'}
      </span>
      <Icon name={isMuted ? 'SpeakerOff' : 'Speaker'} size={14} className="text-white/50" />
    </button>
  </div>

  <!-- Progression button (sceneStep 1) -->
  <div class="absolute top-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-500
              {sceneStep === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}">
    <button
      type="button"
      aria-label="Créer le lien. Progression {clickCount} sur 10."
      class="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2
             flex items-center gap-4 hover:bg-white/10 transition-all duration-300
             focus-visible:ring-2 focus-visible:ring-[#706bfe]
             {isClickAnimating ? 'animate-pulse-scale border-white/30 bg-white/10' : ''}"
      on:click|stopPropagation={(e) => handlePointerDown(e as unknown as PointerEvent)}
    >
      <div class="relative w-12 h-12 flex items-center justify-center">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
          <path class="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2"/>
          <path style="stroke:#706bfe" stroke-dasharray="{clickCount*10},100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3" class="transition-all duration-500"/>
        </svg>
        <span class="absolute font-semibold text-sm text-white" aria-hidden="true">{clickCount}</span>
      </div>
      <div class="flex flex-col pr-4 text-left">
        <span class="text-white/70 text-[10px] uppercase tracking-wider">Création du Lien</span>
        <span class="font-medium text-xs text-white">Appuyez pour découvrir</span>
      </div>
    </button>
  </div>

  <!-- Poetic messages -->
  <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4" aria-live="polite">
    <div class="transform transition-all duration-700 ease-in-out flex flex-col items-center text-center max-w-md
                {messageVisible ? 'opacity-100 scale-100 blur-0 translate-y-0' : 'opacity-0 scale-50 blur-xl translate-y-10'}">
      {#if currentMessage}
        <div class="mb-4 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(112,107,254,0.2)]">
          <Icon name={currentMessage.icon} className="text-white {currentMessage.anim}" size={24} />
        </div>
        <h2 class="text-2xl md:text-4xl font-semibold mb-2 drop-shadow-lg leading-tight">{currentMessage.text}</h2>
      {/if}
    </div>
  </div>

  <!-- Hero title (sceneStep 0) -->
  <div class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none
              transition-opacity duration-1000 {sceneStep === 0 ? 'opacity-100' : 'opacity-0'}">
    <div class="text-center px-4 w-full max-w-[90%] animate-pulse flex flex-col items-center justify-center h-full">
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tighter mb-4 bg-clip-text text-transparent
                 bg-gradient-to-r from-white via-[#706bfe] to-white/50">
        DESIGNING<br/>INTENTIONS
      </h1>
      <span class="text-[10px] text-white mt-8 block uppercase tracking-[0.3em]">Touchez l'écran pour commencer</span>
    </div>
  </div>

  <!-- Main content slot (sceneStep 2) -->
  <div
    id="main-content"
    tabindex="-1"
    class="absolute inset-0 z-30 bg-[#020205]/95 backdrop-blur-sm transition-transform duration-1000 ease-in-out
           overflow-y-auto overflow-x-hidden
           {sceneStep === 2 ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none invisible'}"
  >
    <slot />
  </div>
</div>
