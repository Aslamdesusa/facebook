
exports.up = function(knex, Promise) {
	return knex
	.schema
	.createTable('users', function(newUsersTable){
		//primary key
		newUsersTable.increments('id').primary();
		//data
		newUsersTable.string('name', 50).notNullable();
		newUsersTable.string('username', 50).notNullable();
		newUsersTable.string('email', 250).notNullable().unique();
		newUsersTable.string('password', 128).notNullable();
		newUsersTable.string('isAdmin').notNullable().defaultTo(false);
		//timestamp
		newUsersTable.timestamp( 'created_at' ).notNullable();
	})
	.createTable('images', function(imagesTable){
		//primary key
		imagesTable.increments('id').primary();
		imagesTable.integer( 'userId', 20).unsigned().references( 'id' ).inTable('users');
		//data
		imagesTable.string('picture_url', 250).notNullable();
		imagesTable.string('isPublic').notNullable().defaultTo(true);
		//timastampe
		imagesTable.timestamp( 'created_at' ).notNullable();	
	})
	.createTable('userComments', function(userComment){
		//primary key
		userComment.increments('id').primary();
		//foreignkey connection
		userComment.integer('commentId', 20).unsigned().references('id').inTable('images');
		//data
		userComment.string('commentText', 250).notNullable();
		// timestampe
		userComment.timestamp( 'created_at' ).notNullable();
	})
	.createTable('nestedComments', function(userNastedComment){
		// primary key
		userNastedComment.increments('id').primary();
		//foreignkey connection
		userNastedComment.integer('nestedCommentId', 20).unsigned().references('id').inTable('userComments');
		// data
		userNastedComment.string('nestedCommentText', 250).notNullable();
		// timestampe
		userNastedComment.timestamp( 'created_at' ).notNullable();
	})
	.createTable('massengerChates', function(massengerChate){
		// primary key
		massengerChate.increments('id').primary();
		//foreignkey connection
		massengerChate.integer('senderUserId', 20).unsigned().references('id').inTable('users');
		massengerChate.integer('receverUserId', 20).unsigned().references('id').inTable('users');
		//data
		massengerChate.string('messagetext', 10000).notNullable();
	})
  
};

exports.down = function(knex, Promise) {
	// We use `...ifExists` because we're not sure if the table's there. Honestly, this is just a safety measure. 
	return knex
	.schema
		dropTableIfExists('massengerChates')
		dropTableIfExists('nestedComments')
		dropTableIfExists('userComments')
		dropTableIfExists('images')
		dropTableIfExists('users');
};
