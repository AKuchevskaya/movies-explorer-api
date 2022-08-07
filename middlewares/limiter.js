const rateLimit = require('express-rate-limit');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Ограничение каждого IP до 100 запросов на `окно` (здесь, за 15 минут )
  standardHeaders: true, // Возвращаем информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключаем заголовки `X-RateLimit-*`
  message: 'Превышено количество запросов',
});
