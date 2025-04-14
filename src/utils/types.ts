/**
 * Тип данных ингредиента.
 */
export type TIngredient = {
  _id: string; // Уникальный идентификатор
  name: string; // Название ингредиента
  type: string; // Тип
  proteins: number; // Количество белков
  fat: number; // Количество жиров
  carbohydrates: number; // Количество углеводов
  calories: number; // Калорийность
  price: number; // Цена
  image: string; // Ссылка на изображение
  image_large: string; // Ссылка на большое изображение
  image_mobile: string; // Ссылка на мобильное изображение
};

export interface TConstructorIngredient extends TIngredient {
  uniqueId: string;
}

/**
 * Тип данных заказа.
 */
export type TOrder = {
  _id: string; // Уникальный идентификатор заказа
  status: string; // Статус заказа
  name: string; // Название заказа
  createdAt: string; // Дата создания
  updatedAt: string; // Дата обновления
  number: number; // Номер заказа
  ingredients: string[]; // Массив идентификаторов ингредиентов в заказе
};

/**
 * Тип данных всех заказов.
 */
export type TOrdersData = {
  orders: TOrder[]; // Массив заказов
  total: number; // Общее количество заказов за всё время
  totalToday: number; // Количество заказов за сегодня
};

/**
 * Тип данных пользователя.
 */
export type TUser = {
  email: string; // Электронная почта пользователя
  name: string; // Имя пользователя
};

/**
 * Тип вкладок в конструкторе бургеров.
 */
export type TTabMode = 'bun' | 'sauce' | 'main';
