$(document).ready(onReady);

function onReady() {
    getMusicData();
    $('#add').on('click', postMusicData);
}

// get artist data from the server
function getMusicData() {
    $("#musicTableBody").empty();
    $.ajax({
        type: 'GET',
        url: '/musicLibrary'
    }).then(function (response) {
        console.log("skjfhsd", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $('#musicTableBody').append(`
                <tr data-id="${response[i].id}">
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                    <td><button class="deleteThis">Delete</button></td>
                    <td><button class="rank">+</button><button class="rank">-</button></td>
                </tr>
            `);
        }
        $( '.deleteThis' ).on( 'click', deleteBtn );
        $( '.rank' ).on( 'click', updateRank );
    });
}

function updateRank() {
    let songId = $(this).parent().parent().data('id');
    let direction = $(this).text()
    console.log( 'click ', direction);
    $.ajax({
        type: 'PUT',
        url: `/musicLibrary/rank/${songId}`,
        data: {
            direction: direction
        } // end data
    }).then(function( response ){
        console.log(response);
        getMusicData();
    }).catch( function( error ){
        alert( 'error on changing rank', error);
    })
} // end updateRank

function deleteBtn() {
    let songId = $(this).parent().parent().data('id');
    console.log( 'click button', songId );

    $.ajax({
        type: 'delete',
        url: `/musicLibrary/${songId}`,
    }).then(function( response ){
        console.log( response );
        getMusicData();
    }).catch( function( err){
        alert( 'Error on delete line 49', err );
    })
}

function postMusicData() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/musicLibrary',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getMusicData();
    });
}

