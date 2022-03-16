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
    // return 'hey';
    return new Song(rows[0]);
  }

  static async updateSong(id, attributes) {
    const existingSong = await Song.getSong(id);
    const updateAttributes = { ...existingSong, ...attributes };
    console.log('updateAttributes', updateAttributes);
    const { artist, songName, yearReleased } = updateAttributes;
    console.log(artist);
    const { rows } = await pool.query(`
    UPDATE
      songs
      SET
      artist=$1,
      song_name=$2,
      year_released=$3
      WHERE
      id=$4
      RETURNING *
      `,
      [artist, songName, yearReleased, id]
      );

      console.log('what we getting from db', rows[0]);
      return new Song(rows[0]);
  }

  static async deleteSong(id) {
    const { rows } = await pool.query(`
    DELETE FROM
    songs
    WHERE
    id=$1
    RETURNING
    *`, [id]);

    return new Song(rows[0]);
  }
}