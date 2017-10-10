import knex from './knex';
import jwt from 'jsonwebtoken';
const Joi = require('joi');

// The idea here is simple: export an array which can be then iterated over and each route can be attached. 
const routes = [
    // for authenticate and get token for a particular user
    {
        method: 'POST',
        path: '/auth',
        handler: ( request, reply) =>{

            const { username, password } = request.payload;

            const getOperation = knex('users').where({
                username,
            }).select('password', 'id').then( ( [user] ) =>{

                if( !user ) {
                    reply( {
                        error: true,
                        errMessage: 'the specified user was not found',
                    } );

                    return;
                }

                if ( user.password == password ){
                    const token = jwt.sign({
                        username,
                        userid:user.id,

                    },'vZiYpmTzqXMp8PpYXKwqc9ShQ1UhyAfy', {
                        algorithm: 'HS256',
                        expiresIn: '1h',
                    });

                     reply( {

                        token,
                        userid: user.id,
                    } );
                } else {
                    reply('incorrect password');
                }

            }).catch((err) =>{
                reply('server side error');

            });

        }
    },

    // create new user
    {
        path:'/createuser',
        method:'POST',
        handler: ( request, reply ) =>{
            const insertOperation = knex('users').insert({
                name:request.payload.name,
                username:request.payload.username,
                email:request.payload.email,
                password:request.payload.password,
                isAdmin:request.payload.isAdmin,
            }).then((res) => {
                reply({
                    data:res,
                    message: "successfully inserted !"
                });
            }).catch((err) => {
                reply("server-side error!");
            });
        }
    },
    // get particular data and not include user password 
    {
        method: 'GET',
        path: '/getuserDetails/{id}',
        handler: function(request, reply) {
            const { id } = request.params
            const getOperation = knex('users').where({
                id:id
            }).select('name', 'email', 'created_at').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no user details has found',
                    });
                }
                reply({
                    data:result,
                });

            }).catch((err) => {
                console.log(err);
                reply('server-side error');
            });
        }
    },

    // update the details of users
    {
      path:'/updateuser/{userid}',
      method:'PUT',
      config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {userid} = request.params;
                        // console.log(userid);
                        const getOperation = knex('users').where({
                            id:userid,
                        }).select('name').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the user with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
      handler: (request, reply) =>{
        const {userid} = request.params;
        // console.log(userid);
        // console.log(request.params);
        // console.log(request.payload);

        const insertOperation = knex('users').where({
            
                id:userid,
            
            }).update({

                name:request.payload.name,
                username:request.payload.username,
                email:request.payload.email,
                password:request.payload.password,
                isAdmin:request.payload.isAdmin,
            
            }).then((res) => {
            
                reply({
                    data:request.payload,
                    message:"successfully updated bird!"
                });
            
            }).catch((err) =>{
                reply("server side error!");
            });
      }  
    },
    // delete a user
    {
        method: 'DELETE',
        path: '/deleteuser/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        // console.log(userid);
                        const getOperation = knex('users').where({
                            id:id,
                        }).select('name').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the user with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
      
        handler: function (request, reply) {
            const {id}=request.params;

            const deleteOperation = knex('users').where({
                
                    id:id,
                
                }).delete({
                    id:id
                     
                }).then((res) => {
                
                    reply({
                        message:"successfully deleted user!"
                    });
                
                }).catch((err) =>{
                    reply("server side error!");
                });

        }
    },
    // user upload image
     {
        path:'/postimage',
        method:'POST',
        handler: ( request, reply ) =>{
            const insertOperation = knex('images').insert({
                userId:request.payload.userId,
                picture_url:request.payload.picture_url,
            }).then((res) => {
                reply({
                    data:res,
                    message: "successfully inserted !"
                });
            }).catch((err) => {
                reply("server-side error!");
            });
        }
    },
   // user get image url
    {
        method: 'GET',
        path: '/getImageUrl/{id}',
        handler: function(request, reply) {
            const { id } = request.params
            const getOperation = knex('images').where({
                id:id
            }).select('userId', 'picture_url', 'created_at').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no user images_url has found',
                    });
                }
                reply({
                    data:result,
                });

            }).catch((err) => {
                console.log(err);
                reply('server-side error');
            });
        }
    },
    {
      path:'/updateuserimageUrl/{userid}',
      method:'PUT',
      config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {userid} = request.params;
                        // console.log(userid);
                        const getOperation = knex('images').where({
                            id:userid,
                        }).select('userId').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the user with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
      handler: (request, reply) =>{
        const {userid} = request.params;
        // console.log(userid);
        // console.log(request.params);
        // console.log(request.payload);

        const insertOperation = knex('images').where({
            
                id:userid,
            
            }).update({

                userId:request.payload.userId,
                picture_url:request.payload.picture_url,
            
            }).then((res) => {
            
                reply({
                    data:request.payload,
                    message:"successfully updated images_url!"
                });
            
            }).catch((err) =>{
                console.log(err);
                reply("server side error!");
            });
      }  
    },
    // delete a user image
    {
        method: 'DELETE',
        path: '/deleteuserImages_url/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        // console.log(userid);
                        const getOperation = knex('images').where({
                            id:id,
                        }).select('userId').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: `the user with id ${id} was not found`
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
      
        handler: function (request, reply) {
            const {id}=request.params;

            const deleteOperation = knex('images').where({
                
                    id:id,
                
                }).delete({
                    id:id
                     
                }).then((res) => {
                
                    reply({
                        message:"successfully deleted user images_url!"
                    });
                
                }).catch((err) =>{
                    reply("server side error!");
                });

        }
    },
     //  kisi bhi imgages ke uper comment ko create karne ke liye 
    {
        method: 'POST',
        path: '/createCommentOnImages/{userid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre:[
            {
                method: ( request, reply ) =>{
                    const { userid } = request.params
                    const getOperation = knex('images').where({
                        userid,
                    }).select('userid').then((result) =>{
                        if (!result) {
                            reply({
                                error: true,
                                errMessage: 'there is no found any images_url'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: function( request, reply ){
            const {userid} = request.params;
            console.log(request.params.userid);
            const getOperation = knex('images').where({
                id:userid,
            }).select('userid').then((result) =>{
                if(!result || result.length === 0){
                    reply({
                        errMessage: 'there has no any user images',
                    })
                }
                const insertOperation = knex('userComments').insert({
                    commentId:request.params.userid,
                    commentText: request.payload.commentText,
                }).then((res) =>{
                    reply({
                        data: res,
                        message: 'inserted comment successfully'
                    });
                }).catch((err) =>{
                    console.log(err);
                    reply('server-side error');
                });
            });
        }   
    },
    {
        method: 'GET',
        path: '/getusercomment/{id}',
        handler: function(request, reply) {
            const { id } = request.params
            const getOperation = knex('userComments').where({
                commentId:id
            }).select('commentId', 'commentText', 'created_at').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no comment has found',
                    });
                }
                reply({
                    data:result,
                });

            }).catch((err) => {
                console.log(err);
                reply('server-side error');
            });
        }
    },
    {
        method: 'PUT',
        path: '/updateComment/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
            {
                method: ( request, reply ) =>{
                    const {id} = request.params;
                    const getOperation = knex('userComments').where({
                        id:id,
                    }).select('commentText').then((result) =>{
                        if(!result) {
                            reply({
                                error: true,
                                errMessage: 'the task comment with id was not found'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: ( request, reply ) =>{
            const insertOperation = knex('userComments').where({
                id: request.params.id,
            }).update({
                commentText: request.payload.commentText,
            }).then((res) =>{
                reply({
                    data: request.payload,
                    message: ('apka comment update ho gaya hai')
                });
    
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        } 
    },
    // >>>>>>>>>>>>>>>>> user ke comment ko delete karne ke liye task id se
    {
        method: 'DELETE',
        path: '/deleteUserComment/{commentid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {commentid} = request.params;
                        const getOperation = knex('userComments').where({
                            id:commentid,
                        }).select('commentText').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: 'yaha is id se koi bhi comment nahi hai'
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: (request, reply) =>{
            const {commentid} = request.params;
            const deleteOperation = knex('userComments').where({
                id:commentid,
            }).delete({
                id:commentid
            }).then((res) =>{
                reply({
                    message: "apka comment delete ho gaya hai!"
                });
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        }
    },
    // >>>>>>>>> comment ke uper comment karne ke liye yah code likah hai

    {
        method: 'POST',
        path: '/createNestedCommentOnComment/{commentid}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre:[
            {
                method: ( request, reply ) =>{
                    const { commentid } = request.params
                    const getOperation = knex('userComments').where({
                        id:commentid,
                    }).select('commentText').then((result) =>{
                        if (!result) {
                            reply({
                                error: true,
                                errMessage: 'there is no found any text'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: function( request, reply ){
            const {commentid} = request.params;
            const getOperation = knex('userComments').where({
                id:commentid,
            }).select('commentid').then((result) =>{
                if(!result || result.length === 0){
                    reply({
                        errMessage: 'there has no any comment text',
                    })
                }
                const insertOperation = knex('nestedComments').insert({
                    nestedCommentId:request.params.commentid,
                    nestedCommentText: request.payload.nestedCommentText,
                }).then((res) =>{
                    reply({
                        data: res,
                        message: 'inserted nestedcomment successfully'
                    });
                }).catch((err) =>{
                    console.log(err);
                    reply('server-side error');
                });
            });
        }   
    },
    // >>>>>>>>>>>>>>>>>>>>>>> task id se user ke comment ko get karne ke liye
    {
        method: 'GET',
        path: '/getuserNestedcomment/{id}',
        handler: function(request, reply) {
            const { id } = request.params
            const getOperation = knex('nestedComments').where({
                nestedCommentId:id
            }).select('nestedCommentId', 'nestedCommentText', 'created_at').then((result) => {
                if (!result || result.length === 0) {
                    reply({
                        error: true,
                        errMessage: 'no nestedComment has found',
                    });
                }
                reply({
                    data:result,
                });

            }).catch((err) => {
                console.log(err);
                reply('server-side error');
            });
        }
    },
     // >>>>>>>>>>>>>>>>>>>>>> yah nested comment ko update karne ke liye hai 
    {
        method: 'PUT',
        path: '/updateNestedComment/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
            {
                method: ( request, reply ) =>{
                    const {id} = request.params
                    const getOperation = knex('nestedComments').where({
                        id:id,
                    }).select('nestedCommentText').then((result) =>{
                        if(!result) {
                            reply({
                                error: true,
                                errMessage: 'the task nested comment with id was not found'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: ( request, reply ) =>{
            console.log(request.params.id);
            const insertOperation = knex('nestedComments').where({
                id:request.params.id,
            }).update({
                nestedCommentText: request.payload.nestedCommentText,
            }).then((res) =>{
                reply({
                    data: request.payload,
                    message: ('apka nested comment update ho gaya hai')
                });
    
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        } 
    },
        // user k nested comment ko delete karne k liye ye code likha hia
    {
        method: 'DELETE',
        path: '/deleteUserNestedComment/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        const getOperation = knex('nestedComments').where({
                            id:id,
                        }).select('nestedCommentText').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: 'yaha is id se koi bhi nestedcomment nahi hai'
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: (request, reply) =>{
            const {id} = request.params;
            const deleteOperation = knex('nestedComments').where({
                id:id,
            }).delete({
                id:id
            }).then((res) =>{
                reply({
                    message: "apka nestedcomment delete ho gaya hai!"
                });
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        }
    },
    {
        method:'POST',
        path:'/postmsgto/othersusers/{id}',
        config: {
            auth:{
                strategy: 'token',
            },
            validate: {
                params: {
                    id: Joi.number()
                }
            }
        },       
        handler: function(request, reply){
            console.log(request.auth.credentials.userid);
            // for check assigned user in database
            const getOperation = knex('users').where({
                id:request.params.id,
            }).select('id').then((result) => {
                if (!result || result.length === 0) {
                    reply({result});
                }
                // for insert data in database
                const insertOperation = knex('massengerChates').insert({
                    senderUserId:request.auth.credentials.userid,
                    receverUserId:result[0].id,
                    messagetext:request.payload.messagetext
                }).then((res) =>{
                    reply({
                        data:res,
                        message:"inserted successfully!"
                    });
                }).catch((err) =>{
                    console.log(err);
                    reply("server side error");
                });

            });
        }
    },
    {
        method: 'GET',
        path: '/getMassegText/{id}',
        handler: function(request, reply) {
            const {id} = request.params
            const getOperation = knex('massengerChates').where({
                senderUserId:id
            }).select('senderUserId', 'receverUserId', 'messagetext').then((result) =>{
                if(!result || result.length === 0){
                    reply({
                        error: true,
                        errMessage: 'no messagetext has found with this id',
                    });
                }
                reply({
                    data:result,
                });
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        }
    },
    {
        method: 'PUT',
        path: '/updateTextmessage/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
            {
                method: ( request, reply ) =>{
                    const {id} = request.params
                    const getOperation = knex('massengerChates').where({
                        id:id,
                    }).select('messagetext').then((result) =>{
                        if(!result) {
                            reply({
                                error: true,
                                errMessage: 'the task messagetext with id was not found'
                            }).takeover();
                        }
                        return reply.continue();
                    });
                }
            }
            ],
        },
        handler: ( request, reply ) =>{
            console.log(request.params.id);
            const insertOperation = knex('massengerChates').where({
                id:request.params.id,
            }).update({
                messagetext: request.payload.messagetext,
            }).then((res) =>{
                reply({
                    data: request.payload,
                    message: ('apka messagetext update ho gaya hai')
                });
    
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        } 
    },
    {
        method: 'DELETE',
        path: '/deleteUserTextMassege/{id}',
        config: {
            auth: {
                strategy: 'token',
            },
            pre: [
                {
                    method: (request, reply) => {
                        const {id} = request.params;
                        const getOperation = knex('massengerChates').where({
                            id:id,
                        }).select('messagetext').then(([result]) =>{
                            if (!result) {
                                reply({
                                    error: true,
                                    errMessage: 'yaha is id se koi bhi messagetext nahi hai'
                                }).takeover();
                            }
                            return reply.continue();
                        });
                    }
                }
            ],
        },
        handler: (request, reply) =>{
            const {id} = request.params;
            const deleteOperation = knex('massengerChates').where({
                id:id,
            }).delete({
                id:id
            }).then((res) =>{
                reply({
                    message: "apka messagetext delete ho gaya hai!"
                });
            }).catch((err) =>{
                console.log(err);
                reply('server-side error');
            });
        }
    },
]
export default routes;
