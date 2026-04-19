/** Cookie с токеном входа (см. модель `UserSession`). Не путать с `eq_session` для корзины/избранного. */
export const AUTH_COOKIE = "eq_auth";

export const AUTH_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 дней
