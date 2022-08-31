const Router = require('koa-router');
const { parser } = require('./parser');
const logger = require('./logger');
const { getBodyEmail } = require('./getBodyEmail');

const router = new Router({
  prefix: '/api/v1',
});

router.get('/health', async ctx => {
  ctx.status = 200;
  ctx.body = { success: true };
});

router.get('/items', async ctx => {
  try {
    const results = await parser();
    ctx.status = 200;
    ctx.body = `<div>loading...</div>`;
    if (results) {
      logger.log('Done');
      ctx.body = `
        <div>
          <h2>Results: ${results.length}</h2>
          <ul>${results
            .map(it => {
              const bodyEmail = getBodyEmail(it.title);
              return `
              <li id="${it.id}">
                  <h4>${it.title}</h4>
                  <a href="mailto:${it.email}?subject=Hackathon Judging ${it.title}&body=${bodyEmail}">${it.email}</a>  
              </li>
            `;
            })
            .join('')}
          </ul>
        </div>
    `;
    }
  } catch (error) {
    logger.error(error);
    ctx.status = 500;
    throw new Error('Parse Failed');
  }
});

module.exports = { router };
