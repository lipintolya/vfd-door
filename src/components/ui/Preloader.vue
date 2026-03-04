<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible  = ref(true)
const progress = ref(0)
const done     = ref(false)

// Слова — не буквы: нет проблем с пробелами и переносами
const words = ['Владимирская', 'фабрика', 'дверей']

let ticker:   ReturnType<typeof setInterval> | null = null
let fallback: ReturnType<typeof setTimeout>  | null = null

const finish = () => {
  if (ticker) { clearInterval(ticker); ticker = null }
  progress.value = 100
  setTimeout(() => {
    done.value = true
    setTimeout(() => { visible.value = false }, 700)
  }, 300)
}

onMounted(() => {
  ticker = setInterval(() => {
    const rem = 92 - progress.value
    progress.value = Math.min(progress.value + rem * 0.07 + 1.0, 92)
  }, 100)

  window.addEventListener('load', finish, { once: true })
  fallback = setTimeout(finish, 3500)
})

onBeforeUnmount(() => {
  if (ticker)   clearInterval(ticker)
  if (fallback) clearTimeout(fallback)
  window.removeEventListener('load', finish)
})
</script>

<template>
  <Transition name="pl">
    <div
      v-if="visible"
      class="pl"
      :class="{ 'pl--done': done }"
      aria-hidden="true"
    >
      <div class="pl__body">

        <!-- Логотип -->
        <div class="pl__logo-wrap">
          <svg
            class="pl__svg"
            viewBox="0 0 2000 2000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#pl-clip)">
              <circle cx="1000" cy="1000" r="1000" fill="#161615" />
              <path
                d="M401.545 1234L296.245 779H404.795L496.445 1182.65H428.195L684.295 779H793.495L505.545 1234H401.545ZM954.106 983.75H1172.51V1068.25H954.106V983.75ZM961.906 1234H856.606V779H1200.46V863.5H961.906V1234ZM1271.74 1234V779H1478.44C1527.84 779 1571.39 788.533 1609.09 807.6C1646.79 826.233 1676.26 852.45 1697.49 886.25C1718.73 920.05 1729.34 960.133 1729.34 1006.5C1729.34 1052.43 1718.73 1092.52 1697.49 1126.75C1676.26 1160.55 1646.79 1186.98 1609.09 1206.05C1571.39 1224.68 1527.84 1234 1478.44 1234H1271.74ZM1377.04 1147.55H1473.24C1503.58 1147.55 1529.79 1141.92 1551.89 1130.65C1574.43 1118.95 1591.76 1102.48 1603.89 1081.25C1616.46 1060.02 1622.74 1035.1 1622.74 1006.5C1622.74 977.467 1616.46 952.55 1603.89 931.75C1591.76 910.517 1574.43 894.267 1551.89 883C1529.79 871.3 1503.58 865.45 1473.24 865.45H1377.04V1147.55Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="pl-clip">
                <rect width="2000" height="2000" rx="1000" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <!-- Подпись: слова появляются по очереди снизу вверх.
             flex-wrap гарантирует корректный перенос на любом экране. -->
        <p class="pl__subtitle" aria-label="Владимирская фабрика дверей">
          <span
            v-for="(word, i) in words"
            :key="i"
            class="pl__word"
            :style="{ '--d': `${0.65 + i * 0.14}s` }"
          >{{ word }}</span>
        </p>

        <!-- Прогресс-трек -->
        <div class="pl__track-wrap">
          <div class="pl__track">
            <div
              class="pl__fill"
              :style="{ transform: `scaleX(${progress / 100})` }"
            />
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ─── Корень ─────────────────────────────────────────── */
.pl {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  /* safe-area для iPhone с чёлкой/динамическим островом */
  padding: env(safe-area-inset-top)
           env(safe-area-inset-right)
           env(safe-area-inset-bottom)
           env(safe-area-inset-left);
  background: #fafafa;
}

/* ─── Центральная колонка ────────────────────────────── */
.pl__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  /*
    Не задаём фиксированную ширину — контент сам определяет размер.
    Ограничиваем только максимум чтобы не растягивалось на широких экранах.
  */
  max-width: min(280px, 78vw);
  width: 100%;
}

/* ─── Логотип ────────────────────────────────────────── */
.pl__logo-wrap {
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(10px) scale(0.9);
  animation: pl-rise 0.58s cubic-bezier(0.34, 1.3, 0.64, 1) 0.1s forwards;
}

.pl__svg {
  display: block;
  /*
    Фиксированный px размер — не зависит от vw.
    На мобильных 60px оптимально, на десктопе 68px.
  */
  width: 60px;
  height: 60px;
}

@media (min-width: 640px) {
  .pl__svg {
    width: 68px;
    height: 68px;
  }
}

/* Дыхание пока грузится */
.pl__logo-wrap {
  animation:
    pl-rise 0.58s cubic-bezier(0.34, 1.3, 0.64, 1) 0.1s forwards;
}

/* После pl-rise завершается — запускаем breathe отдельно на svg */
.pl__svg {
  animation: pl-breathe 3s ease-in-out 0.9s infinite;
}

/* При завершении отменяем breathe и запускаем pop */
.pl--done .pl__svg {
  animation: pl-pop 0.4s cubic-bezier(0.34, 1.5, 0.64, 1) forwards;
}

/* ─── Подпись ────────────────────────────────────────── */
.pl__subtitle {
  /*
    flex-wrap: wrap + justify-content: center — слова красиво
    переносятся на маленьких экранах без overflow.
    Никакого white-space: nowrap.
  */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.35em;
  margin: 0 0 22px;
  /*
    Фиксированный px, не clamp с vw — предсказуемо на всех экранах.
    9px = идеально читается, не мелко, не громко.
  */
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #a1a1aa;
  line-height: 1.6;
  /* Резервируем высоту под 1-2 строки чтобы не было прыжка */
  min-height: calc(1.6em * 2);
}

.pl__word {
  display: inline-block;
  opacity: 0;
  transform: translateY(6px);
  animation: pl-word 0.45s cubic-bezier(0.34, 1.2, 0.64, 1) var(--d, 0s) forwards;
  /* Слова не переносятся сами по себе — только между словами */
  white-space: nowrap;
}

/* ─── Прогресс ───────────────────────────────────────── */
.pl__track-wrap {
  width: 100%;
  /*
    Появляется плавно через 1.2s — после логотипа и начала слов.
    Не резко, не pop — чистый fade-in за 0.8s.
  */
  opacity: 0;
  animation: pl-fadein 0.8s ease 1.2s forwards;
}

.pl__track {
  position: relative;
  height: 1.5px;
  background: #e4e4e7;
  border-radius: 2px;
  overflow: hidden;
}

.pl__fill {
  position: absolute;
  inset: 0;
  background: #14b8a6;
  border-radius: 2px;
  transform-origin: left;
  transform: scaleX(0);
  /*
    0.28s — достаточно плавно чтобы не рябило,
    достаточно быстро чтобы ощущалось живым.
  */
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(20, 184, 166, 0.4);
}

/* Трек уходит при завершении */
.pl--done .pl__track-wrap {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* ─── Keyframes ──────────────────────────────────────── */
@keyframes pl-rise {
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pl-breathe {
  0%, 100% { opacity: 1;    transform: scale(1); }
  50%       { opacity: 0.68; transform: scale(0.96); }
}

@keyframes pl-pop {
  to { opacity: 1; transform: scale(1.08); }
}

@keyframes pl-word {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pl-fadein {
  to { opacity: 1; }
}

/* ─── Уход прелоадера ────────────────────────────────── */
.pl-leave-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.pl-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* ─── Доступность ────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .pl__logo-wrap,
  .pl__word,
  .pl__track-wrap {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .pl__svg {
    animation: none !important;
  }
  .pl-leave-active {
    transition: opacity 0.2s ease;
  }
  .pl-leave-to {
    transform: none;
  }
}
</style>