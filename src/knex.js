export default require('knex')({
	client: 'mysql',
	connection:{
		host:'localhost',
		user:'root',
		password:'aslam@desusa',
		database:'us_facebook',
		charset: 'utf8',
	}
});