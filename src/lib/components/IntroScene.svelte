<!-- src/lib/components/IntroScene.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import * as THREE from 'three';
  import { audioStore, SFX_SUCCESS, SFX_CLICKS } from '$lib/stores/audio';
  import { POETIC_PHRASES } from '$lib/data/phrases';
  import Icon from '$lib/components/Icons.svelte';

  const PRIMARY   = '#706bfe';
  const SECONDARY = '#a78bfa';
  const TERTIARY  = '#38bdf8';
  const ANIM_DURATION = 2000;
  const TRANSITION_DELAY = 500;

  // ── Geometry helpers ──
  const getCubePoint     = (s: number) => ({x:(Math.random()-.5)*s,y:(Math.random()-.5)*s,z:(Math.random()-.5)*s});
  const getTorusPoint    = (R: number,r: number) => { const u=Math.random()*Math.PI*2,v=Math.random()*Math.PI*2; return {x:(R+r*Math.cos(v))*Math.cos(u),y:(R+r*Math.cos(v))*Math.sin(u),z:r*Math.sin(v)}; };
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
  let isTouch = false;
  if (typeof window !== 'undefined') isTouch = window.matchMedia('(hover: none)').matches;
  let sceneStep = 0;
  let clickCount = 0;
  let currentMessage: typeof POETIC_PHRASES[0] | null = null;
  let messageVisible = false;
  let isClickFlash = false;
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
  let mouseRotX = 0, mouseRotY = 0, mousePosX = 0, mousePosY = 0;
  // friction delay: only jiggle after 500ms of sustained fast movement
  let fastMouseSince = 0;
  let targetGeometry = 'sphere';
  let isLocked = false, isReturning = false;
  let time = 0;
  let fibTime = 0;
  let introStartTime: number | null = null;

  let spherePos: Float32Array, heartPos: Float32Array, cubePos: Float32Array;
  let torusPos: Float32Array, spiralPos: Float32Array, diamondPos: Float32Array;
  let ringPos: Float32Array, cylinderPos: Float32Array, infinityPos: Float32Array;
  let N = 0;

  onMount(() => {
    const w = window.innerWidth, h = window.innerHeight;
    const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = w < 768;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020205');
    scene.fog = new THREE.FogExp2(0x020205, 0.002);
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    // Fit camera so widest shape (ring ≈ 7 units wide) stays in frame at any aspect ratio
    const fitCamera = () => {
      const aspect = camera.aspect;
      if (aspect < 1) {
        const hFovHalf = Math.atan(Math.tan(37.5 * Math.PI / 180) * aspect);
        camera.position.z = Math.min(Math.ceil(3.8 / Math.tan(hFovHalf)) + 1, 14);
      } else {
        camera.position.z = 7;
      }
    };
    fitCamera();
    renderer = new THREE.WebGLRenderer({ antialias: !isMobile });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.setAttribute('role', 'presentation');
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // ── Math helpers ──
    const h3 = (x:number,y:number,z:number)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
    const n3 = (x:number,y:number,z:number)=>{
      const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;
      const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);
      const l=(a:number,b:number,t:number)=>a+(b-a)*t;
      return l(l(l(h3(xi,yi,zi),h3(xi+1,yi,zi),u),l(h3(xi,yi+1,zi),h3(xi+1,yi+1,zi),u),v),l(l(h3(xi,yi,zi+1),h3(xi+1,yi,zi+1),u),l(h3(xi,yi+1,zi+1),h3(xi+1,yi+1,zi+1),u),v),w);
    };
    const c01 = (v:number)=>Math.max(0,Math.min(1,v));
    const ss  = (a:number,b:number,x:number)=>{const t=c01((x-a)/(b-a));return t*t*(3-2*t);};

    // ── Fibonacci sphere — base distribution for all N particles ──
    N = prefersRM ? 500 : isMobile ? 3000 : 5000;
    const FIB_R = 2.4;
    const fibGolden = Math.PI * (3 - Math.sqrt(5));
    const fibNormals = new Float32Array(N * 3);

    const positions = new Float32Array(N*3), colors = new Float32Array(N*3);
    spherePos   = new Float32Array(N*3); heartPos    = new Float32Array(N*3);
    spiralPos   = new Float32Array(N*3);

    // ── Double hélice volumique (spirale) ──
    {
      const half = Math.floor(N/2);
      const buildHelix = (offset: number, start: number, count: number) => {
        for (let i=0; i<count; i++) {
          const i3=(start+i)*3, progress=i/count;
          const t=(progress)*Math.PI*6-Math.PI*3;
          const r=2.2*Math.sin(progress*Math.PI);
          const spread=0.1+r*0.06;
          spiralPos[i3]  =Math.cos(t+offset)*r+(Math.random()-.5)*spread;
          spiralPos[i3+1]=t/3+(Math.random()-.5)*spread;
          spiralPos[i3+2]=Math.sin(t+offset)*r+(Math.random()-.5)*spread;
        }
      };
      buildHelix(0, 0, half);
      buildHelix(Math.PI, half, N-half);
    }

    // ── Cœur 3D creux — surface via équation implicite + Fibonacci ray casting ──
    {
      const fH = (x: number, y: number, z: number) => { const a=x*x+9/4*y*y+z*z-1; return a*a*a-x*x*z*z*z-9/80*y*y*z*z*z; };
      const grH = Math.PI*(3-Math.sqrt(5));
      for (let i=0; i<N; i++) {
        const i3=i*3, yy=1-(i/(N-1))*2, rd=Math.sqrt(Math.max(0,1-yy*yy)), th=grH*i;
        const hfx=Math.cos(th)*rd, hfy=Math.sin(th)*rd, hfz=yy;
        let lo=0, hi=3.5;
        for (let k=0; k<30; k++) { const m=(lo+hi)*.5; fH(hfx*m,hfy*m,hfz*m)<=0?lo=m:hi=m; }
        const t=(lo+hi)*.5, jit=0.022;
        heartPos[i3]   = hfx*t*1.7+(Math.random()-.5)*jit;
        heartPos[i3+1] = hfz*t*1.7*1.05-0.45+(Math.random()-.5)*jit;
        heartPos[i3+2] = hfy*t*1.7*0.65+(Math.random()-.5)*jit;
      }
    }
    cubePos     = new Float32Array(N*3); torusPos    = new Float32Array(N*3);
    diamondPos  = new Float32Array(N*3);
    ringPos     = new Float32Array(N*3); cylinderPos = new Float32Array(N*3);
    infinityPos = new Float32Array(N*3);

    // Cache du blob (déformation de la sphère) — recalculé une frame sur deux.
    // La cible n'est rafraîchie qu'à ~30 Hz mais les particules lerpent vers elle
    // à chaque frame → mouvement identique à l'œil, coût du bruit divisé par deux.
    const blobCache = new Float32Array(N).fill(1);
    let frameCount = 0;

    const colorBase = new THREE.Color(PRIMARY);

    for (let i = 0; i < N; i++) {
      const i3 = i*3;
      // Fibonacci sphere normals + positions
      const fy = 1 - (i / (N - 1)) * 2;
      const fr = Math.sqrt(1 - fy * fy);
      const ft = fibGolden * i;
      const fx = Math.cos(ft) * fr, fz = Math.sin(ft) * fr;
      fibNormals[i3]=fx; fibNormals[i3+1]=fy; fibNormals[i3+2]=fz;
      spherePos[i3]=fx*FIB_R; spherePos[i3+1]=fy*FIB_R; spherePos[i3+2]=fz*FIB_R;
      positions[i3]=fx*FIB_R; positions[i3+1]=fy*FIB_R; positions[i3+2]=fz*FIB_R;

      // other shape positions
      const c=getCubePoint(3.5);       cubePos[i3]=c.x;      cubePos[i3+1]=c.y;      cubePos[i3+2]=c.z;
      const tt=getTorusPoint(2,.8);    torusPos[i3]=tt.x;    torusPos[i3+1]=tt.y;    torusPos[i3+2]=tt.z;
      const d=getDiamondPoint(4.5);    diamondPos[i3]=d.x;   diamondPos[i3+1]=d.y;   diamondPos[i3+2]=d.z;
      const r=getRingPoint(3.5,.5);    ringPos[i3]=r.x;      ringPos[i3+1]=r.y;      ringPos[i3+2]=r.z;
      const cy=getCylinderPoint(1.5,5);cylinderPos[i3]=cy.x; cylinderPos[i3+1]=cy.y; cylinderPos[i3+2]=cy.z;
      const inf=getInfinityPoint(4,.6);infinityPos[i3]=inf.x; infinityPos[i3+1]=inf.y; infinityPos[i3+2]=inf.z;

      colors[i3]=colorBase.r; colors[i3+1]=colorBase.g; colors[i3+2]=colorBase.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const spriteCtx = spriteCanvas.getContext('2d')!;
    const spriteGrad = spriteCtx.createRadialGradient(32,32,0,32,32,32);
    spriteGrad.addColorStop(0,   'rgba(255,255,255,1)');
    spriteGrad.addColorStop(0.35,'rgba(255,255,255,0.7)');
    spriteGrad.addColorStop(1,   'rgba(255,255,255,0)');
    spriteCtx.fillStyle = spriteGrad; spriteCtx.fillRect(0,0,64,64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);
    const mat = new THREE.PointsMaterial({size:.085, map:sprite, transparent:true, opacity:.9,
      vertexColors:true, blending:THREE.AdditiveBlending, depthWrite:false});
    particlesSystem = new THREE.Points(geo, mat);
    scene.add(particlesSystem);

    // ── Glow layer ──
    const glowPositions = positions.slice();
    const glowColors    = colors.slice();
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
    glowGeo.setAttribute('color',    new THREE.BufferAttribute(glowColors, 3));
    const glowMat = new THREE.PointsMaterial({size:.13, map:sprite, transparent:true, opacity:.12,
      vertexColors:true, blending:THREE.AdditiveBlending, depthWrite:false});
    const glowSystem = new THREE.Points(glowGeo, glowMat);
    scene.add(glowSystem);

    // ── Halo layer (desktop only) — ambient violet silhouette glow ──
    let haloSystem: THREE.Points | null = null;
    let hPosAttr: THREE.BufferAttribute | null = null;
    let hColAttr: THREE.BufferAttribute | null = null;
    let hPosArr: Float32Array | null = null;
    let hColArr: Float32Array | null = null;
    if (!isMobile && !prefersRM) {
      const haloGeo = new THREE.BufferGeometry();
      haloGeo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
      haloGeo.setAttribute('color',    new THREE.BufferAttribute(colors.slice(), 3));
      const haloMat = new THREE.PointsMaterial({size:.85, map:sprite, transparent:true, opacity:.08,
        vertexColors:true, blending:THREE.AdditiveBlending, depthWrite:false});
      haloSystem = new THREE.Points(haloGeo, haloMat);
      scene.add(haloSystem);
      hPosAttr = haloGeo.attributes.position as THREE.BufferAttribute;
      hColAttr = haloGeo.attributes.color    as THREE.BufferAttribute;
      hPosArr  = hPosAttr.array as Float32Array;
      hColArr  = hColAttr.array as Float32Array;
    }

    // ── Background stars ──
    const bgN = prefersRM ? 200 : 2500;
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

    // per-shape accent color (MID for Fresnel gradient)
    const shapeColor: Record<string,string> = {
      sphere:'#8a86ff', breathing:'#8a86ff', wave:'#8a86ff',
      torus:'#8a86ff',
      heart:'#cc88ff',
      cube:'#b090ff', diamond:'#b090ff',
      spiral:'#70d4ff', ring:'#70d4ff', infinity:'#70d4ff',
      cylinder:'#8a86ff',
    };

    const FIB_MID = new THREE.Color('#8a86ff');
    const speedFactor = prefersRM ? 0.1 : 1.0;
    const useBlob = !prefersRM;

    const posAttr  = geo.attributes.position as THREE.BufferAttribute;
    const colAttr  = geo.attributes.color    as THREE.BufferAttribute;
    const gPosAttr = glowGeo.attributes.position as THREE.BufferAttribute;
    const gColAttr = glowGeo.attributes.color    as THREE.BufferAttribute;
    const posArr  = posAttr.array  as Float32Array;
    const colArr  = colAttr.array  as Float32Array;
    const gPosArr = gPosAttr.array as Float32Array;
    const gColArr = gColAttr.array as Float32Array;

    const clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      // clamp delta to 100ms to avoid jump after tab switch; normalize to 60fps baseline
      const dt = Math.min(clock.getDelta(), 0.1) * 60;
      // prefers-reduced-motion: render one static frame then pause
      if (prefersRM && time > 0.1) { renderer.render(scene, camera); return; }
      time    += 0.008 * speedFactor * dt;
      fibTime += 0.006 * speedFactor * dt;

      // ── Floating motion — organic float ──
      const floatRY = Math.sin(fibTime*0.18)*0.22;
      const floatRX = 0.05 + Math.cos(fibTime*0.13)*0.1;
      const floatPY = Math.sin(fibTime*0.35)*0.18;
      const floatPX = Math.sin(fibTime*0.22)*0.1;

      // ── Lerp mouse influence — smooth coast, no bounce possible ──
      if (!prefersRM) {
        const lag = 0.025; // slower than 0.035 → ~2s to 95% = more coast
        mouseRotY += (mouseVec.x * 0.18 - mouseRotY) * lag;
        mouseRotX += (mouseVec.y * 0.12 - mouseRotX) * lag;
        mousePosX += (mouseVec.x * 0.30 - mousePosX) * lag;
        mousePosY += (mouseVec.y * 0.30 - mousePosY) * lag;
      }
      particlesSystem.rotation.y = floatRY + mouseRotY;
      particlesSystem.rotation.x = floatRX + mouseRotX;
      particlesSystem.position.y = floatPY + mousePosY;
      particlesSystem.position.x = floatPX + mousePosX;
      glowSystem.rotation.copy(particlesSystem.rotation);
      glowSystem.position.copy(particlesSystem.position);
      if (haloSystem) { haloSystem.rotation.copy(particlesSystem.rotation); haloSystem.position.copy(particlesSystem.position); }

      // ── Audio static — mouse speed drives audio engine ──
      const dx = mouseVec.x - prevMouse.x, dy = mouseVec.y - prevMouse.y;
      const mouseSpeed = Math.sqrt(dx*dx+dy*dy);
      velocityVal += (mouseSpeed - velocityVal) * 0.1;
      audioStore.engine?.updateStatic(velocityVal);

      if (vibration > 0) vibration = Math.max(0, vibration - 0.05);
      if (flood !== 0) flood = flood > 0 ? flood + 0.01 : (flood+.05 > 0 ? 0 : flood+.05);

      let introFactor = 0;
      if (introStartTime !== null) {
        const elapsed = (Date.now() - introStartTime) / 1000;
        if (elapsed < 2) introFactor = Math.sin((elapsed/2)*Math.PI);
        else introStartTime = null;
      }

      const cosY = Math.cos(particlesSystem.rotation.y);
      const sinY = Math.sin(particlesSystem.rotation.y);

      const shape = targetGeometry;
      FIB_MID.set(shapeColor[shape] ?? '#8a86ff');
      const tarArr = shapeMap[shape] ?? spherePos;
      const isSphere = shape === 'sphere' || shape === 'breathing' || shape === 'wave';
      const updateBlob = (frameCount++ & 1) === 0;

      for (let i = 0; i < N; i++) {
        const i3 = i*3;
        const nx = fibNormals[i3], ny = fibNormals[i3+1], nz = fibNormals[i3+2];

        let tx = tarArr[i3], ty = tarArr[i3+1], tz = tarArr[i3+2];

        // blob deformation — sphere state only (cible recalculée 1 frame/2)
        if (isSphere && useBlob) {
          let blob: number;
          if (updateBlob) {
            if (isMobile) {
              // Cheap sine-based deformation — no Perlin, near-zero CPU cost
              blob = 1 + Math.sin(nx*3.1 + fibTime*0.35) * 0.10
                       + Math.cos(ny*2.7 + fibTime*0.28) * 0.07
                       + Math.sin(nz*2.3 + fibTime*0.22) * 0.05;
            } else {
              const n1 = n3(nx*1.4+10, ny*1.4+10, nz*1.4+fibTime*0.09);
              const n2 = n3(nx*2.6-30, ny*2.6-30, nz*2.6+fibTime*0.07);
              blob = 1 + (n1-0.5)*0.30 + (n2-0.5)*0.12;
            }
            blobCache[i] = blob;
          } else {
            blob = blobCache[i];
          }
          tx = nx*FIB_R*blob; ty = ny*FIB_R*blob; tz = nz*FIB_R*blob;
        }

        // shape-specific animations
        if (!prefersRM) {
          if (shape === 'heart')     { const b=1+Math.sin(time*4)*.03; tx*=b; ty*=b; tz*=b; }
          else if (shape === 'breathing') { const b=1+Math.sin(fibTime*1.5+i*0.01)*.15; tx*=b; ty*=b; tz*=b; }
          else if (shape === 'wave') { tx+=Math.sin(time*2.5+ty*1.5)*.5; tz+=Math.cos(time*2+tx*1.5)*.4; ty+=Math.sin(time*1.8+nx*2)*.25; }
          else if (shape === 'ring') {
            // rotation lente autour de l'axe X (bas → haut)
            const cosT=Math.cos(fibTime*0.4), sinT=Math.sin(fibTime*0.4);
            const py=ringPos[i3+1], pz=ringPos[i3+2];
            ty = py*cosT - pz*sinT;
            tz = py*sinT + pz*cosT;
          }
        }

        if (introFactor > 0) { const e=1+introFactor*.2; tx*=e; ty*=e; tz*=e; }
        if (vibration > 0) { const sh=(Math.random()-.5)*vibration*.5; tx+=sh; ty+=sh; tz+=sh; }
        if (flood !== 0) { const f=Math.abs(flood); tx*=(1+f*30); ty*=(1+f*30); tz+=f*25; }

        // frame-rate independent lerp: 1-(1-spd)^dt gives same effective speed at any Hz
        const spdBase = isReturning ? .12 : isLocked ? .18 : prefersRM ? .01 : .03;
        const spd = 1 - Math.pow(1 - spdBase, dt);
        posArr[i3]   += (tx - posArr[i3])   * spd;
        posArr[i3+1] += (ty - posArr[i3+1]) * spd;
        posArr[i3+2] += (tz - posArr[i3+2]) * spd;
        gPosArr[i3]=posArr[i3]; gPosArr[i3+1]=posArr[i3+1]; gPosArr[i3+2]=posArr[i3+2];

        // ── Fresnel coloring — uses Fibonacci normals throughout ──
        const facing = -nx*sinY + nz*cosY;
        const visibility = ss(-0.25, 0.1, facing);
        const fresnel = Math.pow(Math.max(0, 1 - Math.abs(facing)), 3.5);
        const t = Math.min(1, fresnel * 0.9 + Math.min(0.4, frictionHeat * 1.5));

        const cr = (FIB_MID.r + (1-FIB_MID.r)*t*0.4) * visibility;
        const cg = (FIB_MID.g + (1-FIB_MID.g)*t*0.4) * visibility;
        const cb = (FIB_MID.b + (1-FIB_MID.b)*t*0.4) * visibility;
        colArr[i3]=cr; colArr[i3+1]=cg; colArr[i3+2]=cb;
        gColArr[i3]=cr; gColArr[i3+1]=cg; gColArr[i3+2]=cb;

        if (hPosArr && hColArr) {
          hPosArr[i3]=posArr[i3]; hPosArr[i3+1]=posArr[i3+1]; hPosArr[i3+2]=posArr[i3+2];
          const hm = Math.pow(fresnel, 1.8) * visibility * 0.8;
          hColArr[i3]=FIB_MID.r*hm; hColArr[i3+1]=FIB_MID.g*hm; hColArr[i3+2]=FIB_MID.b*hm;
        }
      }

      posAttr.needsUpdate = true; colAttr.needsUpdate = true;
      gPosAttr.needsUpdate = true; gColAttr.needsUpdate = true;
      if (hPosAttr) { hPosAttr.needsUpdate = true; hColAttr!.needsUpdate = true; }

      mat.size = (isLocked || isReturning) && !prefersRM ? 0.1 : 0.085;
      mat.needsUpdate = true;

      // ── Background stars ──
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
      fitCamera();
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(reqId);
      clearStepTimers();
      renderer.dispose();
    };
  });

  // Timers de l'étape en cours — annulables pour qu'un nouveau clic interrompe
  // immédiatement l'animation précédente au lieu d'attendre sa fin.
  let stepTimers: ReturnType<typeof setTimeout>[] = [];
  const clearStepTimers = () => { stepTimers.forEach(clearTimeout); stepTimers = []; };

  function advanceScene() {
    audioStore.engine?.init();
    audioStore.engine?.wakeUp();

    if (sceneStep === 0) {
      sceneStep = 1;
      introStartTime = Date.now();
      audioStore.engine?.markBGMActive();
      if (!isMuted) { audioStore.engine?.playIntro(); audioStore.engine?.startBGM(); }
      return;
    }

    if (clickCount >= 10) return;
    doStep();
  }

  function doStep() {
    if (clickCount >= 10) return;

    // Interrompt l'étape en cours → la forme et le message changent tout de suite.
    clearStepTimers();

    const next = clickCount + 1;
    const phraseIdx = next - 1;
    clickCount = next;

    if (!isMuted) {
      if (next < 10) {
        const url = SFX_CLICKS[sfxIndex % SFX_CLICKS.length];
        audioStore.engine?.playSound(url);
        sfxIndex++;
      } else if (next === 10) {
        audioStore.engine?.playSound(SFX_SUCCESS);
      }
    }

    isClickFlash = true;
    stepTimers.push(setTimeout(() => { isClickFlash = false; }, 300));
    vibration = 1.0;

    if (POETIC_PHRASES[phraseIdx]) {
      // Changement de forme + message immédiats
      targetGeometry = POETIC_PHRASES[phraseIdx].shape;
      isLocked = true; isReturning = false;
      currentMessage = POETIC_PHRASES[phraseIdx];
      messageVisible = true;

      if (next < 10) {
        // Maintien de la phrase, puis retour à la sphère — annulé si on reclique
        stepTimers.push(setTimeout(() => {
          messageVisible = false;
          targetGeometry = 'sphere';
          isLocked = false; isReturning = true;
          stepTimers.push(setTimeout(() => { isReturning = false; }, 2200));
        }, ANIM_DURATION));
      }
    }

    if (next === 10) {
      stepTimers.push(setTimeout(() => { if (!isMuted) audioStore.engine?.fadeOutBGM(); }, ANIM_DURATION));
      stepTimers.push(setTimeout(() => { flood = 0.1; }, ANIM_DURATION));
      stepTimers.push(setTimeout(() => { goto('/home'); }, ANIM_DURATION + TRANSITION_DELAY));
    }
  }
</script>

<div
  class="relative w-full h-[100dvh] bg-[#020205] overflow-hidden select-none text-white custom-cursor"
  role="application"
  aria-label="Expérience immersive portfolio — appuyez sur Entrée ou Espace pour avancer"
  tabindex="0"
  on:pointerdown={(e) => { if (!(e.target as HTMLElement).closest('button, a')) advanceScene(); }}
  on:keydown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !(e.target as HTMLElement).closest('button, a')) { e.preventDefault(); advanceScene(); } }}
>
  <div bind:this={mountEl} class="absolute inset-0 z-0" aria-hidden="true"></div>

  <!-- Sound toggle -->
  <div class="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto z-50
              transition-all duration-500 opacity-100 translate-y-0">
    <button
      on:click|stopPropagation={audioStore.toggleMute}
      aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
      aria-pressed={!isMuted}
      class="w-full md:w-auto flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl
             border border-white/10 rounded-xl px-5 py-3 hover:bg-white/10 hover:border-white/20
             transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-[#706bfe]"
    >
      {#key isMuted}
        <div class="w-2 h-2 rounded-full {isMuted ? 'bg-red-500' : 'bg-emerald-400'}"></div>
      {/key}
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
             {isClickFlash ? 'animate-pulse-scale border-white/30 bg-white/10' : ''}"
      on:click|stopPropagation={advanceScene}
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
        <h2 class="text-2xl md:text-4xl font-semibold mb-2 leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,1),0_0_50px_rgba(0,0,0,0.9)]">{currentMessage.text}</h2>
      {/if}
    </div>
  </div>

  <!-- Hero title (sceneStep 0) -->
  <div class="absolute inset-0 z-20 flex items-center justify-center pointer-events-none
              transition-opacity duration-1000 {sceneStep === 0 ? 'opacity-100' : 'opacity-0'}">
    <div class="text-center px-4 w-full max-w-[90%] animate-pulse flex flex-col items-center justify-center h-full">
      <h1 class="text-4xl md:text-6xl font-semibold tracking-tighter mb-4 bg-clip-text text-transparent
                 bg-gradient-to-r from-white via-[#706bfe] to-white/50
                 [filter:drop-shadow(0_2px_16px_rgba(0,0,0,0.9))_drop-shadow(0_0_40px_rgba(0,0,0,0.7))]">
        DESIGNING<br/>INTENTIONS
      </h1>
      <span class="text-[10px] text-white mt-8 block uppercase tracking-[0.3em] [text-shadow:0_1px_12px_rgba(0,0,0,1),0_0_30px_rgba(0,0,0,0.8)]">{isTouch ? "Touchez l'écran" : 'Cliquez pour commencer'}</span>
    </div>
  </div>

</div>
