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

const getStyle = results => {
  return results.reduce((obj, item) => {
    obj[item.id] = `
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: #f2f2f2;
      border-radius: 9px;
      margin-bottom: 10px;
      padding: 10px;
      color: black;
    `;
    return obj;
  }, {});
};

router.get('/items', async ctx => {
  try {
    const results = await parser();
    ctx.status = 200;
    ctx.body = `<div>loading...</div>`;
    if (results) {
      logger.log('Done');
      const styles = getStyle(results);
      ctx.body = `

        <div>
          <script>
            function onItemClickFunction(id) {
              const element = document.getElementById('item-' + id);
              const isSelected = element.style.backgroundColor === "black"
              console.log(id, isSelected)
              element.style.color = !isSelected ? "gray" : "black";
              element.style.backgroundColor = isSelected ? "#f2f2f2" : "black"
            }
          </script>
          <h2>Results: ${results.length}</h2>
          <ul style="list-style-type: none;padding: 0;margin: 0">${results
            .map(it => {
              const bodyEmail = getBodyEmail(it.title);

              return `
              <li onclick="onItemClickFunction(${it.id})" id="item-${it.id}" style="${
                styles[it.id]
              }" id="${it.id}">
                  <h4 style="padding: 0">${it.title}</h4>
                  <a href="mailto:${it.email}?subject=Hackathon Judging ${
                it.title
              }&body=${bodyEmail}">${it.email}</a>  
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
