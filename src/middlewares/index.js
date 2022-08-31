const { readFile, writeFile } = require('fs/promises');
const logger = require('../logger');
const { parser } = require("../parser");

module.exports = {
  readFileMiddleware: async (ctx, next) => {
    try {
      const filePath = './files/sentEmails.json';
      const fileData = await readFile(filePath, 'utf8');
      ctx.filePath = filePath;
      ctx.fileData = JSON.parse(fileData);
      await next();
    } catch (error) {
      logger.error(error);
    }
  },
  getEntriesMiddleware: async (ctx, next) => {
    try {
      ctx.entries = await parser();
      await next();
    } catch (error) {
      logger.error(error);
    }
  },
};
