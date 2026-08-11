const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const PORT = 4000;
const app = express();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());





/************************************************************************************************************************************
                                        Functionality Related to the Database and Tables Creation 

************************************************************************************************************************************/


let defaultUsers = [
    ['john_doe', 'john.doe@gmail.com', 'password123', 'John Doe', 'Software Engineer', 'JavaScript, Node.js, React', '/Group301.png', 5, 120, 'Advanced'],
    ['mary_smith', 'mary.smith@gmail.com', 'password123', 'Mary Smith', 'UI/UX Designer', 'Figma, Sketch, Adobe XD', '/Group302.png', 3, 80, 'Intermediate'],
    ['david_johnson', 'david.johnson@gmail.com', 'password123', 'David Johnson', 'Data Scientist', 'Python, Machine Learning, SQL', '/Group303.png', 8, 200, 'Expert'],
    ['lisa_williams', 'lisa.williams@gmail.com', 'password123', 'Lisa Williams', 'Product Manager', 'Agile, Scrum, Roadmaps', '/Group304.png', 4, 90, 'Intermediate'],
    ['chris_brown', 'chris.brown@gmail.com', 'password123', 'Chris Brown', 'Frontend Developer', 'HTML, CSS, JavaScript', '/Group306.png', 10, 150, 'Advanced'],
    ['jennifer_davis', 'jennifer.davis@gmail.com', 'password123', 'Jennifer Davis', 'Marketing Strategist', 'SEO, Content Marketing, Social Media', '/Group305.png', 2, 70, 'Intermediate'],
    ['michael_martinez', 'michael.martinez@gmail.com', 'password123', 'Michael Martinez', 'Backend Developer', 'Java, Spring Boot, Docker', '/Group306.png', 7, 130, 'Advanced'],
    ['emily_taylor', 'emily.taylor@gmail.com', 'password123', 'Emily Taylor', 'Content Writer', 'Blogging, Copywriting, SEO', '/Group302.png', 6, 60, 'Beginner'],
    ['daniel_jackson', 'daniel.jackson@gmail.com', 'password123', 'Daniel Jackson', 'QA Engineer', 'Automation Testing, Selenium', '/Group303.png', 4, 110, 'Intermediate'],
    ['olivia_wilson', 'olivia.wilson@gmail.com', 'password123', 'Olivia Wilson', 'HR Manager', 'Recruiting, Employee Relations', '/Group305.png', 3, 50, 'Beginner']

];


let defaultMedia = [
    [11, 1, 'insta.com/johndoe', '1.png'],
    [11, 3, 'linkedin.com/in/johndoe', '3.png'],
    [2, 2, 'fb.com/marysmith', '2.png'],
    [2, 4, 'snap.com/mary_smith', '4.png'],
    [3, 1, 'insta.com/davidjohnson', '1.png'],
    [3, 5, 'reddit.com/user/davidjohnson', '5.png'],
    [4, 2, 'fb.com/lisawilliams', '2.png'],
    [4, 3, 'linkedin.com/in/lisawilliams', '3.png'],
    [5, 4, 'snap.com/chris_brown', '4.png'],
    [5, 1, 'insta.com/chrisbrown', '1.png'],
    [6, 3, 'linkedin.com/in/jenniferdavis', '3.png'],
    [6, 5, 'reddit.com/user/jenniferdavis', '5.png'],
    [7, 1, 'insta.com/michaelmartinez', '1.png'],
    [7, 2, 'fb.com/michaelmartinez', '2.png'],
    [8, 4, 'snap.com/emily_taylor', '4.png'],
    [8, 5, 'reddit.com/user/emilytaylor', '5.png'],
    [9, 2, 'fb.com/danieljackson', '2.png'],
    [9, 3, 'linkedin.com/in/danieljackson', '3.png'],
    [10, 1, 'insta.com/oliviawilson', '1.png'],
    [10, 4, 'snap.com/olivia_wilson', '4.png']
];


let defaultChannels = [
    ['Machine Learning & AI'],
    ['Software Engineering'],
    ['Data Science & Analytics'],
    ['Web Development'],
    ['Cybersecurity']
];



let defaultPosts = [
    [11, 4, 0, 'What is your favorite programming language?', 'Let\'s discuss the strengths and weaknesses of different programming languages.', 0, 0, 0],
    [2, 1, 0, 'JavaScript vs Python', 'Which language do you prefer for web development - JavaScript or Python?', 0, 3, 0],
    [3, 1, 0, 'Best language for Machine Learning?', 'Do you think Python is the best language for ML, or are there other options?', 0, 5, 0],
    [4, 1, 0, 'How to start with Machine Learning?', 'Any suggestions on resources and courses to start learning ML from scratch?', 0, 10, 1],
    [5, 3, 0, 'Deep Learning Frameworks', 'What are the best frameworks for deep learning, such as TensorFlow and PyTorch?', 0, 8, 0],
    [6, 3, 0, 'AI Ethics', 'How do we ensure the ethical use of AI in society?', 2, 7, 2],
    [7, 4, 0, 'Best practices for code quality', 'What are some best practices to maintain high code quality in large projects?', 0, 6, 1],
    [8, 2, 0, 'Agile vs Waterfall', 'Which development methodology works best for you - Agile or Waterfall?', 0, 4, 0],
    [9, 3, 0, 'Introduction to Data Science', 'What skills do you need to become a data scientist? Let’s discuss the learning path.', 0, 5, 0],
    [10, 4, 0, 'Data Cleaning Tips', 'Data cleaning can be a tedious task. Any tips or tools that make it easier?', 0, 3, 1],
    [11, 2, 0, 'Frontend vs Backend Development', 'Which is better: frontend or backend development? Let’s discuss the pros and cons of each.',0, 4, 0],
    [2, 4, 0, 'Best Frameworks for Web Development', 'What are the best frontend and backend frameworks for building modern web applications?', 0, 6, 1]
    [11, 5, 0, 'Importance of Multi-Factor Authentication', 'MFA adds an extra layer of security by requiring more than just a password. It’s essential for protecting your accounts.', 0, 15, 2],

];









// Create connection with MYSQL server 
var db = mysql.createPool({
    host: 'mysql-image',
    user: 'root',
    password: 'zxcvbnm'
});


// Create database postForum
// Create user, channel, post, media, file, message tables 
db.getConnection((err,connection)=>{
    if (err){
        console.log("Error connecting to mysql: ",err);
        process.exit(1);
    }
    else{
        console.log("Connected Successfully to MYSQL");
    }

    connection.query(`CREATE DATABASE IF NOT EXISTS postForum`, error=>{
        if(error){
            console.log("Error while creating database postForum: ", error);
        }
        else{
            console.log("Successfully created postForum database");
        }
    });

    connection.query(`USE postForum`, error=>{
        if(error){
            console.log("Error while using database postForum: ", error);
        }
        else{
            console.log("Successfully accessed postForum database");
            connection.query(`CREATE TABLE IF NOT EXISTS userTable
                    ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(50) NOT NULL,
                      email VARCHAR(50) NOT NULL,
                      password VARCHAR(50) NOT NULL,
                      name VARCHAR(100) NOT NULL,
                      profession VARCHAR(50) NOT NULL,
                      skills TEXT NOT NULL,
                      avatar VARCHAR(100) NOT NULL,
                      totalPosts INT NOT NULL,
                      connections INT NOT NULL,
                      expertise VARCHAR(50) NOT NULL
                    )`,error=>{
                        if(error){
                            console.log("Error occured while creating user table : ", error);
                            return;
                        }
                        else{
                            connection.query(`INSERT INTO postForum.userTable(
                                              username,
                                              email,
                                              password,
                                              name,
                                              profession,
                                              skills,
                                              avatar,
                                              totalPosts,
                                              connections,
                                              expertise)
                                              VALUES 
                                              (?,?,?,?,?,?,?,?,?,?)`,
                                              ["admin",
                                               "admin@gmail.com",
                                                "zxcvbnm",
                                                "Prajakta Sutar",
                                                "Student",
                                                "full-stack development,machine learning",
                                                "/Group302.png",
                                                0,
                                                0,
                                                "Expert"], (error, result)=>{
                                                    if(error){
                                                        console.log("Error occured while creating user table : ", error);
                                                        return;
                                                    }
                                                    else{
                                                        console.log("Successfully added admin to user table");
                                                        console.log("Successfully created user table");
                                                        defaultUsers.forEach(user=>{
                                                             connection.query(`INSERT INTO userTable(
                                                                                username, 
                                                                                email, 
                                                                                password, 
                                                                                name, 
                                                                                profession, 
                                                                                skills, 
                                                                                avatar, 
                                                                                totalPosts, 
                                                                                connections, 
                                                                                expertise) 
                                                                                VALUES
                                                                                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                                                user, (error, result)=>{
                                                                                    if (error) {
                                                                                        console.log("Error inserting user: ", error);
                                                                                    }
                                                                                });
                                                        })
                                                    }
                                                })
                        }
            });


            connection.query(`CREATE TABLE IF NOT EXISTS mediaTable
                            ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            userId INT NOT NULL,
                            type TEXT NOT NULL,
                            link TEXT NOT NULL,
                            image VARCHAR(100) NOT NULL
                            )`,error=>{
                                if(error){
                                    console.log("Error occured while creating media table : ", error);
                                    return;
                                }
                                else{
                                    console.log("Successfully created media table");
                                    defaultMedia.forEach((media)=>{
                                        connection.query(`INSERT INTO mediaTable(
                                                        userId ,
                                                        type ,
                                                        link ,
                                                        image)
                                                        VALUES
                                                        (?,?,?,?)`,
                                                        media,(error, result)=>{
                                                            if (error) {
                                                                console.log("Error inserting media: ", error);
                                                            }
                                                        })
                                    })
                                }
            });

            connection.query(`CREATE TABLE IF NOT EXISTS channelTable
                            ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            totalPosts INT
                            )`,error=>{
                                if(error){
                                    console.log("Error occured while creating channel table : ", error);
                                    return;
                                }
                                else{
                                    console.log("Successfully created channel table");
                                    defaultChannels.forEach((channel)=>{
                                        connection.query(`INSERT INTO channelTable (name) VALUES (?)`,channel,(error, result)=>{
                                            if (error) {
                                                console.log("Error inserting channel: ", error);
                                            }
                                        })
                                    })
                                }
            });

            connection.query(`CREATE TABLE IF NOT EXISTS postTable
                            ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            userId INT NOT NULL,
                            channelId INT NOT NULL,
                            replyTo INT NOT NULL,
                            topic VARCHAR(500) NOT NULL,
                            data VARCHAR(2000) NOT NULL,
                            datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            level INT, 
                            likes INT,
                            dislikes INT                  
                            )`,error=>{
                                if(error){
                                    console.log("Error occured while creating post table : ", error);
                                    return;
                                }
                                else{
                                    console.log("Successfully created post table");
                                    defaultPosts.forEach((post)=>{
                                        connection.query(`INSERT INTO postTable(
                                                            userId ,
                                                            channelId ,
                                                            replyTo,
                                                            topic ,
                                                            data ,
                                                            level , 
                                                            likes ,
                                                            dislikes) VALUES (?,?,?,?,?,?,?,?)`, post,(error, result)=>{
                                                                if (error) {
                                                                    console.log("Error inserting post: ", error);
                                                                }
                                                            })
                                    })
                                }
            });

            connection.query(`CREATE TABLE IF NOT EXISTS fileTable
                            ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            postId INT,
                            messageId INT,
                            fileName TEXT NOT NULL,
                            fileType TEXT NOT NULL,
                            file LONGBLOB NOT NULL
                            )`,error=>{
                                if(error){
                                    console.log("Error occured while creating file table : ", error);
                                    return;
                                }
                                else{
                                    console.log("Successfully created file table");
                                }
            });

            connection.query(`CREATE TABLE IF NOT EXISTS messageTable
                            ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            senderId INT NOT NULL,
                            receiverId INT NOT NULL,
                            message TEXT NOT NULL,
                            datetime DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
                            )`,error=>{
                                if(error){
                                    console.log("Error occured while creating message table : ", error);
                                    return;
                                }
                                else{
                                    console.log("Successfully created message table");
                                }
            });
        }
    });
});








/************************************************************************************************************************************
                                        Functionality Related to homepage 

************************************************************************************************************************************/


// Sign up functionality 
app.post('/signup', (request,response)=>{
    db.query(`SELECT * FROM postForum.userTable WHERE email=?`,[request.body.signEmail],(error, emailResult)=>{
        if(error){
            console.error("Error during email query:", error);
            response.status(500).send("Server error during retriving user info  associated with email for sign up");
            return;
        }
        if(emailResult.length != 0){
            response.status(401).send("Provided email is already associate with other account");
            return;
        }
        db.query(`SELECT * FROM postForum.userTable WHERE username=?`,[request.body.signUsername],(error, usernameResult)=>{
            if(error){
                response.status(500).send("Server error during retriving user info  associated with username for sign up");
                return;
            }
            if(usernameResult.length != 0){
                response.status(401).send("Provided username is already associate with other account");
                return;
            }
            db.query(`INSERT INTO postForum.userTable
                    ( username,
                      email,
                      password,
                      name,
                      profession,
                      skills,
                      avatar,
                      totalPosts,
                      connections,
                      expertise
                      )
                      VALUES (?,?,?,?,?,?,?,?,?,?)`,
                    [ request.body.signUsername,
                      request.body.signEmail,
                      request.body.signPassword,
                      request.body.signName,
                      request.body.signProfession,
                      request.body.signSkills,
                      request.body.signAvatar,
                      0,
                      0,
                      "Beginner"
                    ],error=>{
                        if(error){
                            response.status(500).send("Server error during adding new user to user table");
                            return;
                        }
                        response.status(200).send("Successfully signed up");
                    })    
        })
    }) 
})


// Log in functionality 
app.post('/login', (request,response)=>{
    db.query(`SELECT * FROM postForum.userTable WHERE email=? AND username=? AND password=?`,
        [request.body.logEmail, request.body.logUsername, request.body.logPassword],(error, result)=>{
            if(error){
                response.status(500).send("Server error during retriving user info  associated with email for log in");
                return;
            }
            if(result.length == 0){
                response.status(401).send("Provided email is already not associate with any account");
                return;
            }
            response.status(200).send("Successfully Logged in");
    })    
})





/************************************************************************************************************************************
                                        Functionality Related to channels page 

************************************************************************************************************************************/

// Add new channe;
app.post('/addChannel',(request,response)=>{
    db.query(`SELECT * FROM postForum.channelTable WHERE name=?`,[request.body.name],(error, channelResult)=>{
        if(error){
            response.status(500).send("Server error during retrieving channel details while adding new channel");
            return;
        }
        if(channelResult.length != 0){
            response.status(401).send("Channel with given name already exists");
            return;
        }
        db.query(`INSERT INTO postForum.channelTable (name) VALUES (?)`,[request.body.channelName], error =>{
            if(error){
                response.status(500).send("Server error while adding new channel");
                return;
            }
            response.status(200).send("Successdully added channel to the table");
        })
    })
})


// Retrieve all channel details
app.get('/getAllChannels',(request,response)=>{
    db.query(`SELECT * FROM postForum.channelTable`,(error, result)=>{
        if(error){
            response.status(500).send("Server error during retriving all channel's name");
            return;
        }
        response.status(200).json(result);
    })
})


// Retrive connected users
app.get('/getConnectedUsers',(request,response)=>{
    const user = request.query.userId;
    db.query(`SELECT DISTINCT
              CASE WHEN m.senderId=? THEN u_receiver.username
                   WHEN m.receiverId=? THEN u_sender.username
              END AS username,
              CASE WHEN m.senderId=? THEN u_receiver.name
                   WHEN m.receiverId=? THEN u_sender.name
              END AS name,
              CASE WHEN m.senderId=? THEN u_receiver.avatar
                   WHEN m.receiverId=? THEN u_sender.avatar
              END AS avatar
              FROM postForum.messageTable as m
              JOIN postForum.userTable u_receiver ON m.receiverId = u_receiver.id
              JOIN postForum.userTable u_sender ON m.senderId = u_sender.id
              `,[user,user,user,user,user,user]
            ,(error, result)=>{
            if(error){
                console.log(error);
                response.status(500).send("Server error during retriving all connected users");
                return;
            }
            response.status(200).json(result);
    })
})


// upload files for post or message
app.post('/uploadFiles',upload.array('allFiles'),(request, response)=>{
    const filePromise = request.files.map((file)=>{
        return new Promise((resolve,reject)=>{
            db.query(`INSERT INTO postForum.fileTable(
                      postId,
                      messageId,
                      fileName,
                      fileType,
                      file
                    )VALUES(?,?,?,?,?)`,
                    [
                      request.body.postId,
                      request.body.messageId,
                      file.originalname,
                      file.mimetype,
                      file.buffer
                    ],
                    (error,result)=>{
                        if(error){

                            console.log(error);
                            reject(error);
                        }
                        else{
                            resolve(result);
                        }
                    })
        })
    })

    Promise.all(filePromise).then(()=>{
        response.status(200).send("New files added successfully!");
    })
    .catch((error)=>{
        console.log(error);
        response.status(500).send('Server error while saving files');
    })
    
})

// Update usetable and channel table after adding post 
function afterPostUpload(user,channel){
    db.query(` UPDATE postForum.channelTable SET totalPosts = IFNULL(totalposts, 0) + 1 WHERE id = ?`,[channel],error=>{
        if(error){
            console.error("Server error during updating total posts in postForum.channelTable");
            return;
        }
        console.log("Successfully updated total posts in channelstable");
    });

   
    db.query(`SELECT MAX(totalPosts) AS Score, totalPosts AS userScore from postForum.userTable WHERE id = ?`,[user] ,(error,result)=>{
        if(error){
            response.status(500).send("Server error during retriving max post number");
            return;
        }
        const highScore = result[0].Score;
        const currScore = result[0].userScore;
        const ratio = (currScore/highScore) * 100;
        let expertise = "";
        if(ratio <= 30){
            expertise = "Beginner";
        }
        else if(ratio > 30 && ratio <=60){
            expertise = "Proficient";
        }
        else{
            expertise = "Expert";
        }
        db.query(` UPDATE postForum.userTable SET totalPosts = IFNULL(totalPosts, 0) + 1, expertise =? WHERE id = ?`,[expertise,user],error=>{
            if(error){
                console.error("Server error during updating total posts and expertise in postForum.userTable");
                return;
            }
            console.log("Successfully updated total posts and expertise in postForum.userTable");
        });
    })
}

// Get all post for given channel
app.get('/getChannelPosts',(request, response)=>{
    const channelId = request.query.channel;
    db.query(`WITH RECURSIVE postTree AS (
        SELECT 
            p.id,
            p.replyTo,
            u.username,
            u.name,
            u.avatar,
            p.datetime,
            p.topic,
            p.data,
            p.level,
            p.likes,
            p.dislikes,
            p.id AS root_id,
            p.datetime AS root_datetime,
            CAST(LPAD(p.id, 10, '0') AS CHAR(255)) AS path
        FROM postForum.postTable p
        JOIN postForum.userTable u ON p.userId = u.id
        WHERE p.replyTo = 0 AND p.channelId = ?
        
        UNION ALL
        
        SELECT 
            p.id,
            p.replyTo,
            u.username,
            u.name,
            u.avatar,
            p.datetime,
            p.topic,
            p.data,
            pT.level + 1 AS level,
            p.likes,
            p.dislikes,
            pT.root_id AS root_id,
            pT.root_datetime AS root_datetime,
            CONCAT(pT.path, '-', LPAD(p.id, 10, '0')) AS path
        FROM postForum.postTable p
        JOIN postForum.userTable u ON p.userId = u.id
        INNER JOIN postTree pT ON p.replyTo = pT.id
        WHERE p.channelId = ?
    )
    SELECT 
        id,
        replyTo,
        username,
        name,
        avatar,
        datetime,
        topic,
        data,
        level,
        likes,
        dislikes
    FROM postTree
    ORDER BY path ASC`,[channelId,channelId],(error, postResult)=>{
        if (error){
            console.log(error);
            response.status(500).send("Server error during retrieving postTree");
            return;
        }

            const postPromises = postResult.map((post) => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT fileName, fileType, file FROM postForum.fileTable WHERE postId=?`, [post.id], (error, fileResult) => {
                        if (error) {
                            reject("Server error during retrieving files");
                        } else {
                            resolve({ ...post, files: fileResult.length > 0 ? fileResult : [] });
                        }
                    });
                });
            });
            Promise.all(postPromises)
            .then(allPostsWithFiles => {
                response.status(200).json(allPostsWithFiles);
            })
            .catch((error) => {
                console.log(error);
                response.status(500).send(error);
            });
            
        })

})



app.post('/addPost',(request, response)=>{
    let parentLevel = -1;
    if(request.body.replyTo != 0){
        db.query(`SELECT level FROM postForum.postTable WHERE id =?`,[request.body.replyTo],(error, levelResult)=>{
            if(error){
                response.status(500).send("Server error during retriving parent post level while adding new post");
                return;
            }
            parentLevel = levelResult[0].level;
        })
    }
    db.query(`INSERT INTO postForum.postTable(
              userId,
              channelId,
              replyTo,
              topic,
              data,
              level
              )
              VALUES (?,?,?,?,?,?)`,
            [ request.body.userId,
              request.body.channelId,
              request.body.replyTo,
              request.body.topic,
              request.body.data,
              (parentLevel + 1)
            ], 
            (error, result)=>{
                if(error){
                    console.log(error);
                    response.status(500).send("Server error while adding new post");
                    return;
                }
                afterPostUpload( request.body.userId, request.body.channelId);
                response.status(200).json({ postId: result.insertId });
               
            })
})





// Functionality to increase likes for  post 
app.post('/likePost',(request,response)=>{
    db.query(`UPDATE postForum.postTable SET likes =  IFNULL(likes, 0) + 1 WHERE id = ?`,
            [request.body.postId], (error,result)=>{
                if(error){
                    response.status(500).send("Server error during increasing likes");
                    return;
                }
                db.query(`SELECT c.name AS name , c.id AS id 
                          FROM  postForum.channelTable c
                          JOIN postForum.postTable p
                          ON c.id = p.channelId
                          WHERE p.id = ?`,
                    [request.body.postId], (error,channelResult)=>{
                        if(error){
                            response.status(500).send("Server error during increasing likes");
                            return;
                        }
                        response.status(200).json({channelId: channelResult[0].id, channelName: channelResult[0].name });
                    })
            })
})


// Functionality to increase dislikes for  post 
app.post('/dislikePost',(request,response)=>{
    db.query(`UPDATE postForum.postTable SET dislikes =  IFNULL(dislikes, 0) + 1 WHERE id = ?`,
            [request.body.postId], (error,result)=>{
                if(error){
                    response.status(500).send("Server error during increasing dislikes");
                    return;
                }
                db.query(`SELECT c.name AS name , c.id AS id 
                          FROM  postForum.channelTable c
                          JOIN postForum.postTable p
                          ON c.id = p.channelId
                          WHERE p.id = ?`,
                    [request.body.postId], (error,channelResult)=>{
                        if(error){
                            response.status(500).send("Server error during increasing likes");
                            return;
                        }
                        response.status(200).json({channelId: channelResult[0].id, channelName: channelResult[0].name });
                    })
            })
})




/************************************************************************************************************************************
                                        Functionality Related to navlink page 

************************************************************************************************************************************/

// functionality to search given channel
app.get('/searchChannel',(request, response)=>{
    db.query(` SELECT * FROM postForum.channelTable WHERE name LIKE ?`,
            [ `%${request.query.channel}%`],(error, result)=>{
                if(error){
                    console.log(error);
                    response.status(500).send("Server error during searching channel");
                    return;
                }
                response.status(200).json(result);
            })
})


// functionality to search given post
app.post('/searchPost',(request, response)=>{
    db.query(` SELECT p.*, c.name AS channel 
                FROM postForum.postTable p
                JOIN postForum.channelTable c
                ON c.id = p.channelId
                WHERE p.topic LIKE ? OR p.data LIKE ?`,
            [ `%${request.body.post}%`, `%${request.body.post}%`],(error, result)=>{
                if(error){
                    console.log(error);
                    response.status(500).send("Server error during searching post");
                    return;
                }
                response.status(200).json(result);
            })
})


// functionality to search given person
app.get('/searchPerson',(request, response)=>{
    db.query(` SELECT * FROM postForum.userTable WHERE name LIKE ? OR username LIKE ?`,
            [`%${request.query.person}%`, `%${request.query.person}%`],(error, result)=>{
                if(error){
                    console.log(error);
                    response.status(500).send("Server error during searching people");
                    return;
                }
                response.status(200).json(result);
            })
})



/************************************************************************************************************************************
                                        Functionality Related to messages page 

************************************************************************************************************************************/


// Retrive messages between current login user and selected user
app.get('/getAllMessages',(request,response)=>{
    db.query(`SELECT id FROM postForum.userTable WHERE username = ? ` ,[request.query.currUser],(error, result)=>{
        if(error){
            console.log("error1" ,error);
            response.status(500).send("Server error during retriving id of current user for getting all messages");
            return;
        }
        db.query(`SELECT * FROM postForum.messageTable
              WHERE senderId=? AND receiverId=? 
              OR senderId=? AND receiverId=? 
              ORDER BY datetime`,
              [result[0].id, request.query.otherUser, request.query.otherUser,result[0].id],
              (error, messageResult)=>{
                if(error){
                    console.log("error2" ,error);
                    response.status(500).send("Server error during retriving all messages");
                    return;
                }
                const messagesPromise =  messageResult.map(message=>{
                    return new Promise((resolve, reject)=>{
                        db.query(`SELECT * FROM postForum.fileTable WHERE messageId=?`,[message.id],(error, fileResult)=>{
                            if(error){
                                reject("Server error during retriving all files related to current message");
                            }
                            else{
                                resolve({...message,files:fileResult.length> 0? fileResult:[]})
                            }
                        })
                    })
                })
                Promise.all(messagesPromise)
                .then(messagesWithFiles=>{
                    response.status(200).json(messagesWithFiles);
                })
                .catch(error=>{
                    console.log("error3" ,error);
                    response.status(500).send("Server error during retriving all messages with their files");
                })
            })
    })
    
})


// Add new message
app.post('/addMessage',(request, response)=>{
    db.query(`INSERT INTO postForum.messageTable(
        senderId,
        receiverId,
        message
        )
        VALUES (?,?,?)`,
      [ request.body.senderId,
        request.body.receiverId,
        request.body.message
      ],
      (error, result)=>{
          if(error){
            console.log(error);
              response.status(500).send("Server error while adding new message");
              return;
          }
          afterMsgUpload(request.body.senderId, request.body.receiverId);
          response.status(200).json({ messageId: result.insertId });
      })
})


// functionality to update usertable after message store 
function afterMsgUpload(sender, receiver){
    db.query(`SELECT * FROM postForum.messageTable 
              WHERE (senderId=? AND receiverId=?)
              OR
              (senderId=? AND receiverId=?)`,
            [ sender, receiver, receiver,sender],
            (error, result)=>{
                if(error){
                    response.status(500).send("Server error while checking whether new connection or not");
                    return;
                } 
                if(result.length == 0){
                    db.query(` UPDATE postForum.userTable SET connections = IFNULL(connections, 0) + 1 WHERE id = ? OR id =?`,[sender, receiver],error=>{
                        if(error){
                            console.error("Server error during updating connections in postForum.userTable");
                            return;
                        }
                        console.log("Successfully updated connections in postForum.userTable");
                    });
                }
            })
}



/************************************************************************************************************************************
                                        Functionality Related to profile page

************************************************************************************************************************************/

// Retrieve most active users 
app.get('/activeUsers', (request, response)=>{
    db.query(`SELECT * from postForum.userTable WHERE username !=? ORDER BY totalPosts DESC LIMIT 5`,
            [ request.query.currUser],(error, result)=>{
                if(error){
                    response.status(500).send("Server error during retriving active users");
                    return;
                }
                response.status(200).json(result);
            })
})


// Retrieve most active channels 
app.get('/activeChannels', (request, response)=>{
    db.query(`SELECT * from postForum.channelTable ORDER BY totalPosts DESC LIMIT 7`,(error, result)=>{
        if(error){
            response.status(500).send("Server error during retriving active chahnels");
            return;
        }    
        response.status(200).json(result);
    })
})


// Retrieve all users 
app.get('/allUsers', (request, response)=>{
    db.query(`SELECT * from postForum.userTable WHERE username !=? `,
            [ request.query.currUser],(error, result)=>{
                if(error){
                    response.status(500).send("Server error during retriving active users");
                    return;
                }
                response.status(200).json(result);
            })
})


// Functioanlity to store profile changes  
app.post('/saveChanges',(request, response)=>{
    db.query(`UPDATE postForum.userTable 
              SET 
              name= ?, username=?, skills=?,avatar=?, profession=?
              WHERE id=?`,
            [ request.body.name,
              request.body.username,
              request.body.skills,
              request.body.avatar,
              request.body.profession,
              request.body.id,
            ],error=>{
                if(error){
                    console.log(error);
                    response.status(500).send("Server error during saving changes for profile");
                    return;
                }
                response.status(200).send("Successfully saved changes for profile");
            })
})


// Functionality to add new media account to user's profile 
app.post('/addMedia',(request, response)=>{
    db.query(`INSERT INTO postForum.mediaTable(
              userId,
              type,
              link,
              image
            ) VALUES (?,?,?,?)`,
            [ request.body.userId,
              request.body.type,
              request.body.link,
              request.body.image
            ],error=>{
                if(error){
                    response.status(500).send("Server error during adding new media");
                    return;
                }
                response.status(200).send("Successfully added new media");
            })
})


// Functionality to remove media account from user's profile 
app.post('/removeMedia',(request, response)=>{
    db.query(`DELETE FROM postForum.mediaTable WHERE userId=? AND id=?`,
            [ request.body.userId, request.body.mediaId ],error=>{
                if(error){
                    console.log(error);
                    response.status(500).send("Server error during deleting media");
                    return;
                }
                response.status(200).send("Successfully deleted media");
            })
})



/************************************************************************************************************************************
                                        Functionality common to all page 

************************************************************************************************************************************/

// Get all details associated with given user
app.post('/getUserDetails',(request,response)=>{
    db.query(`SELECT * FROM postForum.userTable WHERE username=?`,[request.body.username],(error, userResult)=>{
        if(error){
            response.status(500).send("Server error during retriving user details");
            return;
        }
        db.query(`SELECT * FROM postForum.mediaTable WHERE userId=?`,[userResult[0].id],(error, mediaResult)=>{
            if(error){
                response.status(500).send("Server error during retriving media info for user details");
                return;
            }
            db.query(`SELECT p.*, c.name AS channel 
                      FROM postForum.postTable p
                      JOIN postForum.channelTable c 
                      ON p.channelId = c.id 
                      WHERE userId=?`,[userResult[0].id],(error, postResult)=>{
                if(error){
                    response.status(500).send("Server error during retriving media info for user details");
                    return;
                }
                response.status(200).json({'userInfo': userResult[0], 'media':mediaResult, 'post':postResult}) 
            })
        })
    })
})


// Remove given channel from website. Admin functionality 
app.post('/deleteChannel',(request,response)=>{
    db.query(`DELETE FROM postForum.postTable WHERE channelId = ?`,[request.body.channel],(error,result)=>{
        if(error){
            console.log(error);
            response.status(500).send("Server error during deleting post for given channel");
            return;
        }
        db.query(`DELETE FROM postForum.channelTable WHERE id = ?`,[request.body.channel],(error,channelResult)=>{
            if(error){
                console.log(error);
                response.status(500).send("Server error during deleting channel");
                return;
            }
            response.status(200).send("Successfully deleted channel");
        })
    })
})


// Remove given post and its nested replies from website. Admin functionality 
app.post('/deletePost',(request,response)=>{
    db.query(`WITH RECURSIVE deleteTree AS (
        SELECT 
            p.id
        FROM postForum.postTable p
        WHERE p.id = ?
        UNION ALL  
        SELECT 
            p.id
        FROM postForum.postTable p
        INNER JOIN deleteTree pT ON p.replyTo = pT.id
    )
    DELETE FROM postForum.postTable WHERE id IN (SELECT id FROM deleteTree)`,
    [request.body.postId],(error, postResult)=>{
        if (error){
            console.log(error);
            response.status(500).send("Server error during deleting  post");
            return;
        }
        response.status(200).send("Successfully deleted post");
    })
})


// Remove given user from website. Admin functionality 
app.post('/deleteUser',(request,response)=>{
    db.query(`SELECT id FROM postForum.postTable WHERE userId = ?`,[request.body.userId],async(error,result)=>{
        if (error){
            console.log(error);
            response.status(500).send("Server error during getting postids while deleting  post");
            return;
        }
        if(result.length > 0){
            const deletionPromise =  result.map((postId)=>{
                return new Promise((resolve, reject)=>{
                    db.query(`WITH RECURSIVE deleteTree AS (
                        SELECT 
                            p.id
                        FROM postForum.postTable p
                        WHERE p.id = ?
                        UNION ALL  
                        SELECT 
                            p.id
                        FROM postForum.postTable p
                        INNER JOIN deleteTree pT ON p.replyTo = pT.id
                    )
                    DELETE FROM postForum.postTable WHERE id IN (SELECT id FROM deleteTree)`,[postId.id],(error, fileResult)=>{
                        if(error){
                            reject("Server error during deleting post for selected user");
                        }
                        resolve(fileResult); 
                    })
                })
            })
            await Promise.all(deletionPromise)
            .then(()=>{
                db.query(`DELETE FROM postForum.userTable WHERE id=?`,[request.body.userId],(error,userResult)=>{
                    if (error){
                        console.log(error);
                        response.status(500).send("Server error during deleting user profile");
                        return;
                    }
                    response.status(200).send("Successfully deleted profile");
                })  
            }
            )
            .catch(error=>{
                console.log("error3" ,error);
                response.status(500).send("Server error while deleting post for selected user");
            })
        }
        else{
            db.query(`DELETE FROM postForum.userTable WHERE id=?`,[request.body.userId],(error,userResult)=>{
                if (error){
                    console.log(error);
                    response.status(500).send("Server error during deleting user profile");
                    return;
                }
                response.status(200).send("Successfully deleted profile");
            }) 
        }
    })
})


app.listen(PORT,()=>{
    console.log("Server is listening on port ",PORT);
})
