require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { BigQuery } = require('@google-cloud/bigquery');


const app = express();
const port = 5001;

const BQ_API = process.env.BQ_API;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // Logs the method and URL
    next();
});

const bigquery = new BigQuery({
    keyFilename: BQ_API,
});

// PostgreSQL connection
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'root',
//     port: 5432,
// });

// whichTable

app.get('/api/whichMusicTable', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.whichTableMusic order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/whichFilmTable', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.whichTableFilm order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Album/artist tables

app.get('/api/musicTable1', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.musicTable1 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/musicTable2', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.musicTable2 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/musicTable3', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.musicTable3 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/musicTable4', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.musicTable4 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/musicTable5', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.musicTable5 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/wantToListen', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.music_tables.wantToListen order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/albums/:id/:whichTable', async (req, res) => {
    const albumID = parseInt(req.params.id);
    const whichTable = req.params.whichTable;

    console.log(`Received DELETE request for id: ${albumID} from table: ${whichTable}`);


    // Construct the query to delete the row
    const query = `
        DELETE FROM \`musiccataloginghelper.music_tables.${whichTable}\`
        WHERE int64_field_1 = @albumID
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { albumID },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Album not found');
        }

        res.status(200).send({ message: 'Album deleted successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// film

app.get('/api/film_visualhypnagogia', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.film_visualhypnagogia order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/film_ebert', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.film_ebert order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/film_imdb250', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.film_imdb250 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/film_towatch', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.film_towatch order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/filmrecs', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.filmrecs order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/film_rymtop1500', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.film_tables.film_rymtop1500 order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/films/:id/:whichTable', async (req, res) => {
    const filmID = parseInt(req.params.id);
    const whichTable = req.params.whichTable;

    console.log(`Received DELETE request for id: ${filmID} from table: ${whichTable}`);

    // Construct the query to delete the row
    const query = `
        DELETE FROM \`musiccataloginghelper.film_tables.${whichTable}\`
        WHERE int64_field_1 = @filmID
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { filmID },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Film not found');
        }

        res.status(200).send({ message: 'Film deleted successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// shows

app.get('/api/shows', async (req, res) => {
    const sqlQuery = 'select * from musiccataloginghelper.show_tables.shows order by rand() limit 1'

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.delete('/api/shows/:id', async (req, res) => {
    const showID = parseInt(req.params.id);

    console.log(`Received DELETE request for id: ${showID}.`);


    // Construct the query to delete the row
    const query = `
        DELETE FROM \`musiccataloginghelper.show_tables.shows\`
        WHERE int64_field_1 = @showID
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { showID },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Show not found');
        }

        res.status(200).send({ message: 'Show deleted successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// server listening function

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});