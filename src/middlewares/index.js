const logger = require('../logger');
const { parser } = require("../parser");

module.exports = {
  getEntriesMiddleware: async (ctx, next) => {
    try {
      ctx.entries = await parser();
      await next();
    } catch (error) {
      logger.error(error);
    }
  },
};
