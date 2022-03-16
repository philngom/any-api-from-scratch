const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Song = require('../lib/models/Song');

describe('any-api-from-scratch routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should add a song to the db', async () => {
    const res = await request(app)
    .post('/api/v1/songs')
    .send({ artist: 'Burna Boy', songName: 'Way too big', yearReleased: 2020 });

    expect(res.body).toEqual({
      id: expect.any(String),
      artist: 'Burna Boy',
      songName: 'Way too big',
      yearReleased: 2020
    })
  });

  it('should get all songs from db', async () => {
    const expected = await Song.getAllSongs();
    const res = await request(app)
    .get('/api/v1/songs');

    expect(res.body).toEqual(expected);
  });

  it('get a song by id', async () => {
    const expected = await Song.insert(({ artist: 'Burna Boy', songName: 'Way too big', yearReleased: 2020 }));
    const res = await request(app).get(`/api/v1/songs/${expected.id}`);

    expect(res.body).toEqual({...expected});
  });

  it('should update a song by id', async () => {
    const song = await Song.insert(({ artist: 'Burna Boy', songName: 'Way too big', yearReleased: 2020 }));
    const res = await request(app).patch(`/api/v1/songs/${song.id}`).send({ songName: 'Real Life', yearReleased: 2020});

    const expected = { artist: 'Burna Boy', songName: 'Real Life', yearReleased: 2020 }
    expect(res.body).toEqual(expected);
  })
});
