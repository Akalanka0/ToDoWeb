const request = require('supertest');
const assert = require('assert');
const app = require('../server');

describe('basic routes', function () {
  it('GET / responds with 200 and HTML', async function () {
    const res = await request(app).get('/').expect(200);
    assert.match(res.text, /ToDo API Backend/);
  });

  it('GET /api/health responds with ok', async function () {
    const res = await request(app).get('/api/health').expect(200);
    assert.strictEqual(res.body.status, 'ok');
  });
});
