class Logger {
  log(...args) {
    console.log('[LOG]', ...args);
  }
  error(...args) {
    console.log('[ERROR]', ...args);
  }
  info(...args) {
    console.log('[INFO]', ...args);
  }
  warn(...args) {
    console.warn('[WARNING]', ...args);
  }
}

module.exports = new Logger();
