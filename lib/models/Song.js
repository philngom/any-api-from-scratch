const pool = require('../utils/pool');

module.exports = class Song {
  id;
  artist;
  songName;
  yearReleased;

  constructor(row) {
    this.id = row.id;
    this.artist = row.artist;
    this.songName = row.song_name;
    this.yearReleased = row.year_released;
  }

  static async insert({ artist, songName, yearReleased }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
      songs (artist, song_name, year_released)
      VALUES
      ($1, $2, $3)
      RETURNING
      *
      `,
      [artist, songName, yearReleased]
    );

    return new Song(rows[0]);
  }

  static async getAllSongs() {
    const { rows } = await pool.query(
      `SELECT
      *
      FROM
      songs`
    )

    return rows.map((row) => new Song(row));
  }

  static async getSong(id) {
    console.log('id', id);
    const { rows } = await pool.query(
      `SELECT
      *
      FROM
      songs
      WHERE
      id=$1`,
      [id]
    );
    if(!rows[0]) return null;
    console.log('what we getting from db', rows[0]);
      // return 'hey';
    return new Song(rows[0]);
  }
}