/** Контакты витрины — блок «Связь» на главной. */
export const siteContact = {
  title: "Контакты",
  lead: "Заказ, самовывоз и вопросы по ассортименту — напишите или позвоните, мы ответим в рабочее время.",
  addressLines: [
    "Ставропольский край, г. Пятигорск",
    "ул. Рынок 21 Век 18, поселок Горячеводский",
  ],
  phone: "+7 928 288-75-32",
  phoneHref: "tel:+79282887532",
  /** Контакт по телефону (отображается рядом с номером). */
  phoneContactName: "Эльдар",
  email: "equilibriumkanz@gmail.com",
  hours: "Ежедневно, кроме среды, 8:00–16:00",
  /**
   * Виджет Яндекс.Карт (тот же um, что в конструкторе).
   * @see https://yandex.ru/map-constructor/
   */
  yandexMapIframeSrc:
    "https://yandex.ru/map-widget/v1/?um=constructor%3A5ab6ffac26267d603a8d15e3f051ff8f7d4eb0601e5493aee1d1d2fc500cc421&source=constructor&lang=ru_RU&scroll=true",
} as const;
