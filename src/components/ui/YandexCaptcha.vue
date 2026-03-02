<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  siteKey: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  verify: [token: string];
  expire: [];
  error: [error: string];
}>();

const captchaContainer = ref<HTMLElement | null>(null);
const isLoaded = ref(false);
const isValid = ref(false);
const validationError = ref<string | null>(null);
const scriptLoaded = ref(false);

// Глобальная функция обратного вызова для SmartCaptcha
declare global {
  interface Window {
    smartCaptchaOnLoad?: () => void;
    onSmartCaptchaVerify?: (token: string) => void;
    onSmartCaptchaExpire?: () => void;
    onSmartCaptchaError?: (error: string) => void;
  }
}

/**
 * Загрузка скрипта Яндекс.Капчи
 */
const loadCaptchaScript = () => {
  if (document.querySelector('script[src*="smartcaptcha.yandexcloud.net/captcha.js"]')) {
    scriptLoaded.value = true;
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://smartcaptcha.yandexcloud.net/captcha.js';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    scriptLoaded.value = true;
    initCaptcha();
  };
  script.onerror = () => {
    validationError.value = 'Не удалось загрузить скрипт капчи';
  };
  document.head.appendChild(script);
};

/**
 * Инициализация виджета капчи
 */
const initCaptcha = () => {
  if (!captchaContainer.value || !scriptLoaded.value) return;

  try {
    // Настраиваем контейнер
    captchaContainer.value.style.height = '100px';
    captchaContainer.value.className = 'smart-captcha';
    captchaContainer.value.setAttribute('data-sitekey', props.siteKey);
    
    // Глобальные обработчики
    window.onSmartCaptchaVerify = handleCallback;
    window.onSmartCaptchaExpire = handleExpire;
    window.onSmartCaptchaError = handleError;
    
    isLoaded.value = true;
  } catch (error) {
    console.error('Ошибка инициализации капчи:', error);
    validationError.value = 'Не удалось инициализировать капчу';
  }
};

/**
 * Обработка успешного прохождения капчи
 */
const handleCallback = (token: string) => {
  isValid.value = true;
  validationError.value = null;
  emit('verify', token);
};

/**
 * Обработка ошибки капчи
 */
const handleError = (error: string) => {
  console.error('SmartCaptcha error:', error);
  validationError.value = 'Ошибка капчи. Попробуйте ещё раз.';
  isValid.value = false;
  emit('error', error);
};

/**
 * Обработка истечения срока действия токена
 */
const handleExpire = () => {
  isValid.value = false;
  emit('expire');
};

/**
 * Получение токена капчи
 */
const getToken = (): string | null => {
  const tokenElement = captchaContainer.value?.querySelector('textarea[name="smart-token"]');
  if (tokenElement) {
    return tokenElement.getAttribute('value');
  }
  return null;
};

/**
 * Сброс капчи
 */
const reset = () => {
  if (captchaContainer.value && window.smartCaptchaOnLoad) {
    // Перезагружаем виджет
    captchaContainer.value.innerHTML = '';
    setTimeout(() => {
      initCaptcha();
    }, 100);
  }
  isValid.value = false;
  validationError.value = null;
};

// Экспортируем методы для родительского компонента
defineExpose({
  getToken,
  reset,
  isValid: () => isValid.value,
});

onMounted(() => {
  loadCaptchaScript();
});

onUnmounted(() => {
  // Очистка при уничтожении компонента
  window.onSmartCaptchaVerify = undefined;
  window.onSmartCaptchaExpire = undefined;
  window.onSmartCaptchaError = undefined;
});
</script>

<template>
  <div class="captcha-wrapper">
    <div
      ref="captchaContainer"
      id="captcha-container"
      class="captcha-container"
      :class="{ 'captcha-error': validationError }"
    />
    
    <!-- Сообщение об ошибке -->
    <p v-if="validationError" class="captcha-error-message">
      {{ validationError }}
    </p>
    
    <!-- Статус загрузки -->
    <p v-if="!isLoaded && !validationError" class="captcha-loading">
      Загрузка капчи...
    </p>
  </div>
</template>

<style scoped>
.captcha-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 100px;
}

.captcha-container {
  width: 100%;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-container.captcha-error {
  opacity: 0.7;
}

.captcha-loading {
  font-size: 12px;
  color: #71717a;
  text-align: center;
}

.captcha-error-message {
  font-size: 12px;
  color: #dc2626;
  text-align: center;
  margin: 0;
}

/* Адаптив для мобильных */
@media (max-width: 640px) {
  .captcha-container {
    transform: scale(0.9);
    transform-origin: center;
  }
}
</style>
