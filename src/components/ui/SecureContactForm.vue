<script setup lang="ts">
import { ref, computed } from 'vue';
import { submitContactForm, formatPhone, isValidName, isValidPhone } from '@/services/formSubmit';
import YandexCaptcha from './YandexCaptcha.vue';

interface Props {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  showNameField?: boolean;
  showMessageField?: boolean;
  source?: string;
  successMessage?: string;
  captchaSiteKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Оставить заявку',
  subtitle: 'Заполните форму, и мы свяжемся с вами',
  buttonText: 'Отправить',
  showNameField: true,
  showMessageField: false,
  source: '',
  successMessage: 'Спасибо! Мы вскоре свяжемся с вами',
  captchaSiteKey: 'ysc1_LhhY1dyA1z9p5ZaRelf8xY0KevySIwQLq0fzBZUA83ce523b',
});

const emit = defineEmits<{
  submit: [data: { name: string; phone: string; message?: string }];
  error: [error: string];
}>();

const formData = ref({
  name: '',
  phone: '',
  message: '',
  captchaToken: '',
});

const formState = ref({
  isSubmitting: false,
  isSubmitted: false,
  errors: {
    name: '',
    phone: '',
    captcha: '',
  },
});

const captchaRef = ref<InstanceType<typeof YandexCaptcha> | null>(null);

const isFormValid = computed(() => {
  const nameValid = !props.showNameField || isValidName(formData.value.name);
  const phoneValid = isValidPhone(formData.value.phone);
  const captchaValid = props.captchaSiteKey ? formData.value.captchaToken.length > 0 : true;
  return nameValid && phoneValid && captchaValid;
});

const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  
  // Сохраняем позицию курсора
  const cursorPos = target.selectionStart || 0;
  const rawLength = rawValue.length;
  
  // Форматируем
  formData.value.phone = formatPhone(rawValue);
  
  // Восстанавливаем позицию курсора с учётом изменений
  const formattedLength = formData.value.phone.length;
  const diff = formattedLength - rawLength;
  
  // Небольшая задержка для обновления DOM
  setTimeout(() => {
    const newPos = Math.min(cursorPos + diff, formData.value.phone.length);
    target.setSelectionRange(newPos, newPos);
  }, 0);
};

const validateName = () => {
  if (!props.showNameField) {
    formState.value.errors.name = '';
    return;
  }
  
  if (!formData.value.name.trim()) {
    formState.value.errors.name = 'Введите ваше имя';
  } else if (!isValidName(formData.value.name)) {
    formState.value.errors.name = 'Имя должно содержать только буквы';
  } else {
    formState.value.errors.name = '';
  }
};

const validatePhone = () => {
  if (!formData.value.phone.trim()) {
    formState.value.errors.phone = 'Введите телефон';
  } else if (!isValidPhone(formData.value.phone)) {
    formState.value.errors.phone = 'Введите корректный номер';
  } else {
    formState.value.errors.phone = '';
  }
};

const handleSubmit = async () => {
  // Валидация
  validateName();
  validatePhone();

  // Проверка капчи
  if (props.captchaSiteKey && !formData.value.captchaToken) {
    formState.value.errors.captcha = 'Пройдите проверку капчи';
    return;
  }

  if (!isFormValid.value) {
    return;
  }

  formState.value.isSubmitting = true;

  try {
    const result = await submitContactForm({
      name: formData.value.name,
      phone: formData.value.phone,
      source: props.source || window.location.href,
      message: props.showMessageField ? formData.value.message : undefined,
      captchaToken: formData.value.captchaToken,
    });

    if (result.success) {
      formState.value.isSubmitted = true;
      emit('submit', {
        name: formData.value.name,
        phone: formData.value.phone,
        message: props.showMessageField ? formData.value.message : undefined,
      });

      // Сброс капчи и формы через 3 секунды
      setTimeout(() => {
        if (captchaRef.value) {
          captchaRef.value.reset();
        }
        resetForm();
      }, 3000);
    } else {
      formState.value.errors.phone = result.error || 'Ошибка отправки';
      emit('error', result.error || 'Ошибка отправки');
      
      // Сброс капчи при ошибке
      if (captchaRef.value) {
        captchaRef.value.reset();
      }
    }
  } catch (error) {
    formState.value.errors.phone = 'Ошибка соединения';
    emit('error', 'Ошибка соединения');
  } finally {
    formState.value.isSubmitting = false;
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    phone: '',
    message: '',
    captchaToken: '',
  };
  formState.value = {
    isSubmitting: false,
    isSubmitted: false,
    errors: {
      name: '',
      phone: '',
      captcha: '',
    },
  };
};
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Заголовок -->
    <div v-if="title || subtitle" class="mb-6 text-center">
      <h3 v-if="title" class="text-xl font-bold text-zinc-900">{{ title }}</h3>
      <p v-if="subtitle" class="mt-1 text-sm text-zinc-600">{{ subtitle }}</p>
    </div>

    <!-- Сообщение об успехе -->
    <div
      v-if="formState.isSubmitted"
      class="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-center"
    >
      <svg class="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <p class="font-medium">{{ successMessage }}</p>
    </div>

    <!-- Форма -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Поле имени -->
      <div v-if="showNameField">
        <input
          v-model="formData.name"
          type="text"
          placeholder="Ваше имя"
          class="w-full rounded-lg px-4 py-3 text-sm bg-white border-2 transition-all duration-200 focus:outline-none"
          :class="[
            formState.errors.name
              ? 'border-red-300 focus:border-red-500'
              : 'border-zinc-200 focus:border-teal-500'
          ]"
          :disabled="formState.isSubmitting"
          @blur="validateName"
          autocomplete="name"
        />
        <p v-if="formState.errors.name" class="mt-1 text-xs text-red-600">{{ formState.errors.name }}</p>
      </div>

      <!-- Поле телефона -->
      <div>
        <input
          :value="formData.phone"
          @input="onPhoneInput"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          class="w-full rounded-lg px-4 py-3 text-sm bg-white border-2 transition-all duration-200 focus:outline-none"
          :class="[
            formState.errors.phone
              ? 'border-red-300 focus:border-red-500'
              : 'border-zinc-200 focus:border-teal-500'
          ]"
          :disabled="formState.isSubmitting"
          @blur="validatePhone"
          autocomplete="tel"
        />
        <p v-if="formState.errors.phone" class="mt-1 text-xs text-red-600">{{ formState.errors.phone }}</p>
      </div>

      <!-- Поле сообщения -->
      <div v-if="showMessageField">
        <textarea
          v-model="formData.message"
          placeholder="Ваше сообщение (необязательно)"
          rows="3"
          class="w-full rounded-lg px-4 py-3 text-sm bg-white border-2 border-zinc-200 transition-all duration-200 focus:outline-none focus:border-teal-500 resize-none"
          :disabled="formState.isSubmitting"
          autocomplete="off"
        />
      </div>

      <!-- Яндекс.Капча -->
      <div v-if="captchaSiteKey">
        <YandexCaptcha
          ref="captchaRef"
          :site-key="captchaSiteKey"
          @verify="formData.captchaToken = $event"
          @expire="formData.captchaToken = ''"
        />
        <p v-if="formState.errors.captcha" class="mt-1 text-xs text-red-600 text-center">{{ formState.errors.captcha }}</p>
      </div>

      <!-- Кнопка отправки -->
      <button
        type="submit"
        class="w-full py-3 rounded-lg px-4 font-semibold text-white bg-teal-600 border-2 border-teal-600 transition-all duration-300 hover:bg-teal-700 hover:border-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        :disabled="formState.isSubmitting || !isFormValid"
      >
        <span v-if="formState.isSubmitting" class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Отправка...
        </span>
        <span v-else>{{ buttonText }}</span>
      </button>

      <!-- Согласие на обработку -->
      <p class="text-xs text-zinc-500 text-center">
        Нажимая кнопку, вы соглашаетесь с 
        <a href="/privacy" class="text-teal-600 hover:underline">политикой конфиденциальности</a>
      </p>
    </form>
  </div>
</template>

<style scoped>
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

input:disabled,
textarea:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
