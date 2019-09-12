const express = require('express');
const router = express.Router();
const pool = require( '../modules/pool')

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "songs" ORDER BY "id";`;
    pool.query( queryText ).then((result) => {
        res.send( result.rows );
    })
    .catch(( err ) => {
        console.log("error making query", err);
        res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
    console.log("HELLO FROM THE POST", req.body);
    const newSong = req.body;
    const queryText = `INSERT INTO "songs" ("artist", "track", "rank", "published")
    VALUES ($1, $2, $3, $4);`

    pool.query( queryText, [ newSong.artist, newSong.track, newSong.rank, newSong.published ])
    .then(( result ) => {
        console.log( "POST RESULTSSSSS", result);
        res.sendStatus(201);
    })
    .catch((err) => {
        console.log(`error making query ${queryText}`, err);
        res.sendStatus(500);
    })
})

router.delete( '/:id', ( req, res ) => {
    console.log( req.params.id );

    let queryText = `DELETE FROM "songs" WHERE "id" = $1;`;
    pool.query( queryText, [ req.params.id ] ).then((result) => {
        res.sendStatus(200)    
    })
    .catch(( err ) => {
        console.log("error making query", err);
        res.sendStatus(500);
    })
})

router.put( '/rank/:id', ( req, res ) => {
    console.log( req.params.id, req.body.direction );
    let songId = req.params.id;
    let direction = req.body.direction
    let queryText = '';

    if( direction == '+'){
        queryText = `UPDATE "songs" SET "rank" = "rank" + 1 WHERE "id" = $1;`;
    } else if ( direction == '-'){
        queryText = `UPDATE "songs" SET "rank" = "rank" - 1 WHERE "id" = $1;`;;
    } else {
        res.sendStatus(500);
        return;
    }
    pool.query( queryText , [ songId ] )
    .then(() => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log( 'error making put request', error);
        res.sendStatus(500);
    })
});

module.exports = router;