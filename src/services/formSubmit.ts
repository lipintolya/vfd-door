/**
 * Сервис отправки форм через API
 *
 * Защищённый API с валидацией и rate limiting
 */

export interface ContactFormData {
  name: string;
  phone: string;
  source?: string;
  message?: string;
  captchaToken?: string;
}

export interface SubmitResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Отправка контактной формы через API
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<SubmitResult> {
  const apiUrl = '/submit-contact.php';
  const formToken = import.meta.env.VITE_FORM_SECRET_TOKEN;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-form-token': formToken || '',
        'x-captcha-token': data.captchaToken || '',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        phone: data.phone.trim(),
        source: data.source || window.location.href,
        message: data.message?.trim(),
      }),
      credentials: 'same-origin',
    });

    const result = await response.json();

    if (!response.ok) {
      // Обработка rate limiting
      if (response.status === 429) {
        return {
          success: false,
          error: 'Слишком много запросов. Попробуйте через минуту.',
        };
      }

      // Обработка ошибок валидации
      if (response.status === 400) {
        return {
          success: false,
          error: result.error || 'Проверьте корректность данных',
        };
      }

      // Обработка ошибок авторизации
      if (response.status === 403) {
        return {
          success: false,
          error: 'Ошибка авторизации',
        };
      }

      // Обработка ошибок сервера
      if (response.status >= 500) {
        console.error('Server error:', result);
        return {
          success: false,
          error: 'Сервис временно недоступен. Попробуйте позже.',
        };
      }

      return {
        success: false,
        error: result.error || 'Ошибка при отправке',
      };
    }

    // Отправка события в Яндекс.Метрику
    // Номер счётчика из index.html: 106993554
    if (window.ym) {
      window.ym(106993554, 'reachGoal', 'form_submit');
    }

    return {
      success: true,
      message: result.message || 'Заявка успешно отправлена',
    };
  } catch (error) {
    console.error('Network error:', error);
    return {
      success: false,
      error: 'Ошибка соединения. Проверьте интернет и попробуйте снова.',
    };
  }
}

/**
 * Валидация имени
 */
export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return (
    trimmed.length >= 2 &&
    trimmed.length <= 50 &&
    /^[\p{L}\s'-]+$/u.test(trimmed)
  );
}

/**
 * Валидация российского телефона
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[78][-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Форматирование телефона в реальном времени
 */
export function formatPhone(value: string): string {
  // Удаляем всё кроме цифр и +
  let cleaned = value.replace(/[^\d+]/g, '');
  
  // Заменяем 8 на +7 в начале
  if (cleaned.startsWith('8')) {
    cleaned = '+7' + cleaned.slice(1);
  }
  
  // Добавляем +7 если нет префикса
  if (cleaned.startsWith('7') && !cleaned.startsWith('+')) {
    cleaned = '+7' + cleaned.slice(1);
  }
  
  // Если не начинается с +7, добавляем
  if (!cleaned.startsWith('+7') && cleaned.length > 0) {
    cleaned = '+7' + cleaned.replace(/\D/g, '').slice(1);
  }
  
  // Ограничиваем длину
  if (cleaned.length > 12) {
    cleaned = cleaned.slice(0, 12);
  }
  
  // Форматируем: +7 (XXX) XXX-XX-XX
  if (cleaned.length <= 2) {
    return cleaned;
  }
  
  const digits = cleaned.replace(/\D/g, '').slice(1); // без +7
  let formatted = '+7';
  
  if (digits.length > 0) {
    formatted += ' (' + digits.slice(0, 3);
  }
  if (digits.length > 3) {
    formatted += ') ' + digits.slice(3, 6);
  }
  if (digits.length > 6) {
    formatted += '-' + digits.slice(6, 8);
  }
  if (digits.length > 8) {
    formatted += '-' + digits.slice(8, 10);
  }
  
  return formatted;
}

/**
 * Расширение окна Yandex Metrika
 */
declare global {
  interface Window {
    ym?: (counterId: number, command: string, ...args: any[]) => void;
  }
}
