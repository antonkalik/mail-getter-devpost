const Router = require('koa-router');
const logger = require('./logger');
const { readFile, writeFile } = require('fs/promises');
const { getBodyEmail } = require('./getBodyEmail');

const styles = `
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

const router = new Router({
  prefix: '/api/v1',
});

router.get('/health', async ctx => {
  ctx.status = 200;
  ctx.body = { success: true };
});

router.get('/items', async ctx => {
  try {
    ctx.status = 200;
    const results = ctx.entries;
    const filePath = './files/sentEmails.json';
    const fileData = await readFile(filePath, 'utf8');
    ctx.body = `<div>loading...</div>`;
    if (results) {
      logger.log('Done');
      const renderItems = Object.values(results)
        .map(it => {
          const bodyEmail = getBodyEmail(it.title);
          if (!JSON.parse(fileData)[it.id]) {
            return `
              <li onclick="onItemClickFunction(${it.id})" id="item-${it.id}" style="${styles}">
                  <h4 style="padding: 0">${it.title}</h4>
                  <div>
                    <input type="text" value="${it.email}" id="email-input">
                  </div>
                  <a href="mailto:${it.email}?subject=Hackathon Judging ${it.title}&body=${bodyEmail}">${it.email}</a> 
              </li>
            `;
          } else {
            return false;
          }
        })
        .filter(Boolean)
        .join('');
      ctx.body = `
        <div>
          <script>
            function onItemClickFunction(id) {
              const element = document.getElementById('item-' + id);
              const isSelected = element.style.backgroundColor === "black"
              element.style.color = !isSelected ? "gray" : "black";
              element.style.backgroundColor = isSelected ? "#f2f2f2" : "black"
            }
          </script>
          <h2>Results: ${Object.values(results).length}</h2>
          <ul style="list-style-type: none;padding: 0;margin: 0">${
            renderItems.length > 0 ? renderItems : `<div>No new hackathons</div>`
          }
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

router.get('/write/:id', async ctx => {
  const entries = ctx.entries || {};
  const chosenItem = entries[ctx.params.id];
  if (chosenItem) {
    const filePath = './files/sentEmails.json';
    const fileData = await readFile(filePath, 'utf8');
    const dataObj = JSON.parse(fileData) || {};
    dataObj[chosenItem.id] = chosenItem;
    await writeFile(filePath, JSON.stringify(dataObj));
    ctx.status = 200;
  }
});

module.exports = { router };
