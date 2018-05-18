const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const restRouter = new Router(app);
const staticRouter = new Router(app); // szi...

console.info('Loading config...');

let config;
try {
	config = JSON.parse(fs.readFileSync('config.json'));
}
catch (error) {
	if (error.code = 'ENOENT') {
		console.error('config.json not found. Defaulting to config.default.json');
		config = JSON.parse(fs.readFileSync('config.default.json'));
	}
	else {
		console.error('Unknown error occurred');
		throw error;
	}
}

staticRouter.get('/', async (ctx, next) => {
	ctx.body = 'Hello world';
	await next();
});

restRouter.get('/json/ruok', async (ctx, next) => {
	ctx.response.body = 'imok';
	await next();
});

app.use(async (ctx, next) => {
	if (config['debug']) {
		console.log(`${ctx.method}: ${ctx.url}`);
	}
	await next();
});

app
	.use(restRouter.routes())
	.use(staticRouter.routes());

app.listen(3000);
console.info('Listening (Press CTRL+C to exit)...');