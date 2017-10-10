exports.seed = function seed( knex, Promise ) {

    var tableName = 'users';

    var rows = [

        // You are free to add as many rows as you feel like in this array. Make sure that they're an object containing the following fields:
        {
            name: 'Aslam',
            username: 'Aslamdesusa',
            password: 'password',
            email: 'aslam17@navgurukul.org',
            isAdmin: 'false',
        },
        {
            name: 'shivam',
            username: 'shvamraj',
            password: 'shivam239017',
            email: 'shivam16@navgurukul.org',
            isAdmin: 'false',
        },
    ];

    return knex( 'users' )
        // Empty the table (DELETE)
        .del()
        .then( function() {
            return knex.insert( rows ).into( 'users' );
        });

};