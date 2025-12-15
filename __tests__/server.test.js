// __tests__/api.test.js
const request = require('supertest');
const app = require('../server'); // We'll modify server.js slightly for testing

describe('GET /api/users', () => {
  it('should return all users with success status', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      count: expect.any(Number),
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
        }),
      ]),
    });

    expect(response.body.count).toBe(response.body.data.length);
    expect(response.body.data.length).toBeGreaterThan(0); // at least initial users
  });
});

describe('GET /health', () => {
  it('should return health check status', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      status: 'OK',
      message: 'API is running!',
    });
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/non-existent-route')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      message: 'Route not found',
    });
  });
});