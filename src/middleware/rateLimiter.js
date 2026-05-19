//防止用戶異常操作行為!!

const requestCounts = new Map();

function cleanupExpired(windowMs) {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.startTime > windowMs) requestCounts.delete(key);
  }
}

export function rateLimiter({
  windowMs = 60_000,
  max = 100,
  message = "請求過於頻繁，請稍後再試",
} = {}) {
  return (req, res, next) => {
    cleanupExpired(windowMs);

    const key = req.ip;
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now - record.startTime > windowMs) {
      requestCounts.set(key, { count: 1, startTime: now });
      return next();
    }

    record.count++;
    if (record.count > max) {
      return res.status(429).json({ success: false, message });
    }

    next();
  };
}

export const apiLimiter = rateLimiter({ windowMs: 60_000, max: 100 });
export const authLimiter = rateLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  message: "登入嘗試次數過多，請 15 分鐘後再試",
});
export const contactLimiter = rateLimiter({
  windowMs: 60 * 60_000,
  max: 10,
  message: "一小時內最多送出 10 則訊息",
});
