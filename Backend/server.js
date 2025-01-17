require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {spawn} = require('child_process');
const { BigQuery } = require('@google-cloud/bigquery');

const app = express();
const port = 5001;

const BQ_SERVICE_ACCOUNT = process.env.BQ_SERVICE_ACCOUNT;
const BQ_PROJECT = process.env.BQ_PROJECT;

const METADATA_DATASET = process.env.METADATA_DATASET;
const QUEUE_TABLE = process.env.QUEUE_TABLE;

const FILM_TABLES_DATASET = process.env.FILM_TABLES_DATASET;
const WHICH_TABLE_FILM = process.env.WHICH_TABLE_FILM;

const MUSIC_TABLES_DATASET = process.env.MUSIC_TABLES_DATASET;
const WHICH_TABLE_MUSIC = process.env.WHICH_TABLE_MUSIC;

const SHOW_TABLES_DATASET = process.env.SHOW_TABLES_DATASET;
const WHICH_TABLE_SHOW = process.env.WHICH_TABLE_SHOW;

const BOOK_TABLES_DATASET = process.env.BOOK_TABLES_DATASET;
const WHICH_TABLE_BOOK = process.env.WHICH_TABLE_BOOK;

const PYTHON_PACKAGE = process.env.PYTHON_PACKAGE;
const PIPELINE_FILE_PATH = process.env.PIPELINE_FILE_PATH;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); 
    next();
});

const bigquery = new BigQuery({
    keyFilename: BQ_SERVICE_ACCOUNT,
});

// Run metadata pipeline

app.post('/api/pipeline', async (req, res) => {

    console.log(`${PYTHON_PACKAGE}`)

    const python = spawn(`${PYTHON_PACKAGE}`, [`${PIPELINE_FILE_PATH}`]);

    python.stdout.on('data', (data) => {
        console.log('Python output:', data.toString());
        res.send(data.toString());
    })

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    })

    python.stderr.on('data', (data) => {
        console.error('Error from Python:', data.toString());
        res.status(500).send(`Error running Python script: ${data.toString()}`);
      });
})

// Add to queue table

app.post('/api/addAlbumToQueue/:album', async (req, res) => {
    const album = req.params.album;

    const query = `
        INSERT INTO \`${BQ_PROJECT}.${METADATA_DATASET}.${QUEUE_TABLE}\`
        (title, id, type) VALUES (@album, GENERATE_UUID(), 'album')
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { album },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Table not found');
        }

        res.status(200).send({ message: 'Album added successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
})

app.post('/api/addBookToQueue/:book', async (req, res) => {
    const book = req.params.book;

    const query = `
        INSERT INTO \`${BQ_PROJECT}.${METADATA_DATASET}.${QUEUE_TABLE}\`
        (title, id, type) VALUES (@book, GENERATE_UUID(), 'book')
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { book },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Table not found');
        }

        res.status(200).send({ message: 'Book added successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
})

app.post('/api/addFilmToQueue/:film', async (req, res) => {
    const film = req.params.film;

    const query = `
        INSERT INTO \`${BQ_PROJECT}.${METADATA_DATASET}.${QUEUE_TABLE}\`
        (title, id, type) VALUES (@film, GENERATE_UUID(), 'film')
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { film },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Table not found');
        }

        res.status(200).send({ message: 'Film added successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
})

app.post('/api/addShowToQueue/:show', async (req, res) => {
    const show = req.params.show;

    const query = `
        INSERT INTO \`${BQ_PROJECT}.${METADATA_DATASET}.${QUEUE_TABLE}\`
        (title, id, type) VALUES (@show, GENERATE_UUID(), 'show')
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { show },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Table not found');
        }

        res.status(200).send({ message: 'Show added successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
})

// whichTable

app.get('/api/whichFilmTable', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.${WHICH_TABLE_FILM} order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/whichMusicTable', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.${WHICH_TABLE_MUSIC} order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/whichShowTable', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${SHOW_TABLES_DATASET}.${WHICH_TABLE_SHOW} order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/whichBookTable', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${BOOK_TABLES_DATASET}.${WHICH_TABLE_BOOK} order by rand() limit 1`
    
    console.log(sqlQuery)

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Album tables

app.get('/api/album_allgenres', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_allgenres order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_bedroomAOR', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_bedroomAOR order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_brokentransmission', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_brokentransmission order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/artist_classicalComposer', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.artist_classicalComposer order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_createdbyrejection', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_createdbyrejection order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_emo', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_emo order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_emoautumn', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_emoautumn order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_greatscene', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_greatscene order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_guysfavemoalbums', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_guysfavemoalbums order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_hopelessrecords', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_hopelessrecords order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_incirculation', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_inCirculation order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_indiepop', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_indiepop order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_magicsheet', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_magicsheet order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_moenieandkitchie', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_moenieandkitchie order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_popalbums', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_popalbums order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_risecore', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_risecore order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
app.get('/api/album_rymrecs', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_rymrecs order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_soundsofspotify', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_soundsofspotify order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_tolisten', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_tolisten order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_vaporwave', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_vaporwave order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/album_waterloggedEars', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_waterloggedEars order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/addToCirculation/:album/:table', async (req, res) => {
    const album = req.params.album;
    const table = req.params.table;

    const query = `
        INSERT INTO \`${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_inCirculation\`
        (title, id, original_table, in_circulation) VALUES (@album, GENERATE_UUID(), @table, 'true')
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { album, table },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Table not found');
        }

        res.status(200).send({ message: 'Album added successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
})

// album deletion non-inCirculation

app.delete('/api/albums/:id/:whichTable', async (req, res) => {
    const id = req.params.id;
    const whichTable = req.params.whichTable;

    console.log(`Received DELETE request for id: ${id} from table: ${whichTable}`);


    // Construct the query to delete the row
    const query = `
        DELETE FROM \`${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.${whichTable}\`
        WHERE id  = @id
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { id },
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

app.delete('/api/albums/:id/:album/:original_table', async (req, res) => {
    const id = req.params.id;
    const originalTable = req.params.original_table;
    const album = req.params.album;

    console.log(`Received DELETE request for album: ${album} from table: ${originalTable} and album_inCirculation`);


    // Query to delete from album_inCirculation
    const query1 = `
    DELETE FROM \`${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.album_inCirculation\`
    WHERE id = @id
    `;

    // Query to delete from the original table
    const query2 = `
        DELETE FROM \`${BQ_PROJECT}.${MUSIC_TABLES_DATASET}.${originalTable}\`
        WHERE title = @album
    `;

    try {
        // Execute the first query
        const options1 = {
            query: query1,
            params: { id },
        };
        const [job1] = await bigquery.createQueryJob(options1);
        console.log(`Job ${job1.id} started.`);
        await job1.getQueryResults();

        // Execute the second query
        const options2 = {
            query: query2,
            params: { album },
        };
        const [job2] = await bigquery.createQueryJob(options2);
        console.log(`Job ${job2.id} started.`);
        await job2.getQueryResults();

        res.status(200).send({ message: 'Album deleted successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({ error: 'Server Error' });
    }
});

// film

app.get('/api/film_criterion', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_criterion order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/film_visualhypnagogia', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_visualhypnagogia order by rand() limit 1`

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
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_ebert order by rand() limit 1`

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
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_imdb250 order by rand() limit 1`

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
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_towatch order by rand() limit 1`

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
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.filmrecs order by rand() limit 1`

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
    const sqlQuery = `select * from ${BQ_PROJECT}.${FILM_TABLES_DATASET}.film_rymtop1500 order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/api/film/:id/:whichTable', async (req, res) => {
    const id = parseInt(req.params.id);
    const whichTable = req.params.whichTable;

    console.log(`Received DELETE request for id: ${id} from table: ${whichTable}`);


    // Construct the query to delete the row
    const query = `
        DELETE FROM \`${BQ_PROJECT}.${FILM_TABLES_DATASET}.${whichTable}\`
        WHERE id  = @id
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { id },
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
    const sqlQuery = `select * from ${BQ_PROJECT}.${SHOW_TABLES_DATASET}.shows order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.get('/api/anime_classic', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${SHOW_TABLES_DATASET}.anime_classic order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.get('/api/anime_other', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${SHOW_TABLES_DATASET}.anime_other order by rand() limit 1`

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
    const id = req.params.id;
    const whichTable = req.params.whichTable;

    console.log(`Received DELETE request for id: ${id} from table: ${whichTable}`);


    // Construct the query to delete the row
    const query = `
        DELETE FROM \`${BQ_PROJECT}.${SHOW_TABLES_DATASET}.${whichTable}\`
        WHERE id  = @id
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { id },
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

// books

app.get('/api/book_toread', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${BOOK_TABLES_DATASET}.book_toread order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.get('/api/penguin_classics', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${BOOK_TABLES_DATASET}.penguin_classics order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.get('/api/penguin_modern', async (req, res) => {
    const sqlQuery = `select * from ${BQ_PROJECT}.${BOOK_TABLES_DATASET}.penguin_modern order by rand() limit 1`

    try {
        const [rows] = await bigquery.query({ query: sqlQuery });
        res.json(rows)
        console.log(rows)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.delete('/api/books/:id/:whichTable', async (req, res) => {
    const id = parseInt(req.params.id);
    const whichTable = req.params.whichTable;

    console.log(`Received DELETE request for id: ${id} from table: ${whichTable}`);


    // Construct the query to delete the row
    const query = `
        DELETE FROM \`${BQ_PROJECT}.${BOOK_TABLES_DATASET}.${whichTable}\`
        WHERE id  = @id
    `;

    try {
        // Run the query
        const options = {
            query,
            params: { id },
        };
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();
        console.log('Rows affected:', rows);

        if (rows.length === 0) {
            return res.status(404).send('Film not found');
        }

        res.status(200).send({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// server listening function

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});