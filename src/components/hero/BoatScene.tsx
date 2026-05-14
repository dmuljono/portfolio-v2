export default function BoatScene() {
  return (
    <svg className="vessel" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="halo" cx="50%" cy="42%" r="55%">
          <stop offset="0%"   stopColor="#5fe5d3" stopOpacity="0.18" />
          <stop offset="55%"  stopColor="#bf5af2" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000"    stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sailL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#5fe5d3" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="sailR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#bf5af2" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2dc7b5" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1c1a36" />
          <stop offset="100%" stopColor="#08071a" />
        </linearGradient>
        <linearGradient id="hullG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2a2745" />
          <stop offset="100%" stopColor="#0a0918" />
        </linearGradient>
        <linearGradient id="waveG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1c1a36" />
          <stop offset="100%" stopColor="#08071a" />
        </linearGradient>
        <mask id="ringMask">
          <rect width="500" height="500" fill="white" />
          <circle cx="250" cy="220" r="153" fill="black" />
        </mask>
        <clipPath id="frame">
          <rect x="0" y="0" width="500" height="500" />
        </clipPath>
      </defs>

      {/* atmospheric halo */}
      <rect width="500" height="500" fill="url(#halo)" />

      <g clipPath="url(#frame)">

        {/* RING */}
        <g className="ring">
          <circle cx="250" cy="220" r="175" fill="url(#ringG)" mask="url(#ringMask)" />
          <circle cx="250" cy="220" r="175" fill="none" stroke="#5fe5d3" strokeWidth="0.6" strokeOpacity="0.55" />
          <circle cx="250" cy="220" r="153" fill="none" stroke="#bf5af2" strokeWidth="0.4" strokeOpacity="0.45" />
          <g stroke="rgba(95,229,211,0.28)" strokeWidth="0.5">
            <line x1="425" y1="220" x2="403" y2="220" />
            <line x1="402" y1="308" x2="383" y2="297" />
            <line x1="338" y1="372" x2="327" y2="353" />
            <line x1="250" y1="395" x2="250" y2="373" />
            <line x1="162" y1="372" x2="174" y2="353" />
            <line x1="98"  y1="308" x2="117" y2="297" />
            <line x1="75"  y1="220" x2="97"  y2="220" />
            <line x1="98"  y1="132" x2="117" y2="143" />
            <line x1="162" y1="68"  x2="174" y2="87" />
            <line x1="250" y1="45"  x2="250" y2="67" />
            <line x1="338" y1="68"  x2="327" y2="87" />
            <line x1="402" y1="132" x2="383" y2="143" />
          </g>
          <path d="M 250,45 L 338,68 L 327,87 L 250,67 Z" fill="rgba(95,229,211,0.07)" />
          <path d="M 338,68 L 402,132 L 383,143 L 327,87 Z" fill="rgba(95,229,211,0.05)" />
          <path d="M 98,308 L 162,372 L 174,353 L 117,297 Z" fill="rgba(191,90,242,0.07)" />
        </g>

        {/* BACK WAVE */}
        <g className="wave-back">
          <path
            d="M -200,318 L -150,298 L -100,320 L -50,295 L 0,320 L 50,298 L 100,322 L 150,300 L 200,320 L 250,298 L 300,320 L 350,295 L 400,322 L 450,300 L 500,320 L 550,298 L 600,320 L 650,300 L 700,320 L 700,500 L -200,500 Z"
            fill="url(#waveG)" stroke="#5fe5d3" strokeWidth="0.55" strokeOpacity="0.4"
          />
        </g>

        {/* SAILBOAT */}
        <g className="boat">
          <line x1="250" y1="72" x2="250" y2="290" stroke="#3a3358" strokeWidth="2" />
          {/* back sail */}
          <path d="M 250,72 L 350,278 L 250,278 Z" fill="url(#sailR)" stroke="#bf5af2" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="250" y1="160" x2="320" y2="278" stroke="#5fe5d3" strokeWidth="0.4" strokeOpacity="0.55" />
          <line x1="250" y1="220" x2="290" y2="278" stroke="#bf5af2" strokeWidth="0.4" strokeOpacity="0.45" />
          {/* front sail */}
          <path d="M 250,72 L 162,278 L 250,278 Z" fill="url(#sailL)" stroke="#5fe5d3" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="250" y1="180" x2="190" y2="278" stroke="#bf5af2" strokeWidth="0.4" strokeOpacity="0.55" />
          <line x1="250" y1="230" x2="218" y2="278" stroke="#5fe5d3" strokeWidth="0.4" strokeOpacity="0.45" />
          {/* hull */}
          <path d="M 140,278 L 360,278 L 335,302 L 165,302 Z" fill="url(#hullG)" stroke="#5fe5d3" strokeWidth="0.5" strokeOpacity="0.55" />
          <path d="M 165,302 L 335,302 L 305,322 L 195,322 Z" fill="#0a0918" stroke="#bf5af2" strokeWidth="0.5" strokeOpacity="0.45" />
          <line x1="220" y1="278" x2="240" y2="322" stroke="#5fe5d3" strokeWidth="0.4" strokeOpacity="0.35" />
          <line x1="280" y1="278" x2="260" y2="322" stroke="#bf5af2" strokeWidth="0.4" strokeOpacity="0.35" />
        </g>

        {/* MID WAVE */}
        <g className="wave-mid">
          <path
            d="M -200,378 L -150,358 L -100,382 L -50,358 L 0,382 L 50,360 L 100,382 L 150,360 L 200,382 L 250,358 L 300,382 L 350,360 L 400,382 L 450,358 L 500,382 L 550,360 L 600,382 L 650,358 L 700,382 L 700,500 L -200,500 Z"
            fill="rgba(15,13,29,0.88)" stroke="#5fe5d3" strokeWidth="0.65" strokeOpacity="0.5"
          />
        </g>

        {/* FRONT WAVE */}
        <g className="wave-front">
          <path
            d="M -200,432 L -150,408 L -100,432 L -50,406 L 0,434 L 50,408 L 100,432 L 150,408 L 200,434 L 250,408 L 300,432 L 350,406 L 400,434 L 450,408 L 500,432 L 550,408 L 600,432 L 650,408 L 700,434 L 700,500 L -200,500 Z"
            fill="#06051a" stroke="#bf5af2" strokeWidth="0.75" strokeOpacity="0.6"
          />
        </g>

      </g>
    </svg>
  )
}
