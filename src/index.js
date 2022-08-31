const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { router } = require('./router');

const app = new Koa();

app.use(cors());
app.use(router.routes());
app.use(bodyParser());
app.listen(3000);