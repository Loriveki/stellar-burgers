export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

/**
 * Устанавливает cookie.
 * name - Имя cookie.
 * value - Значение cookie.
 * props - Дополнительные параметры (время жизни, путь и т. д.).
 */
export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  // Устанавливаем путь по умолчанию
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    // Если передано время жизни в секундах, преобразуем в дату истечения
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    // Преобразуем дату истечения в строку UTC
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  // Добавляем все переданные свойства
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  // Устанавливаем cookie
  document.cookie = updatedCookie;
}

/**
 * Удаляет cookie по имени.
 */
export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}
