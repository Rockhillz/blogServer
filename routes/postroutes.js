const express = require('express');
const Post = require('../models/Post'); // Import the Post model
// const { route } = require('./postroutes');
const router = express.Router(); // Create a new router instance
const nodemailer = require("nodemailer");


// First route: Get all posts endpoint
router.get('/posts', async (req, res) => {
    try {
        // Fetch all posts from the database using the Post model
        const posts = await Post.find();
        
        // Respond with the fetched posts
        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
});


// Second Route: For Creating new post endpoint
router.post('/create-post', async (req, res) => {

    // Destructuring. Coming from client side
    const { title, content, category, tags, postImageUrl } = req.body;
    // create a new post.
   try{
        const newPost = new Post({
            title,
            body: content,
            category,
            tags,
            postImg: postImageUrl  // Store the image URL instead of a file
        })
        console.log(req.body.postIm)

        //saving and storing to database
        const savedPost = await newPost.save();
        res.status(201).json({ success: true, data: savedPost});

    } catch(error) {
        res.json({ message: error})
    }

})


//Third route: for getting single post
router.get('/post/:postID', async (req, res) => {
    //extract post ID using destruction
    const { postID } = req.params;

    //fetch single post
    try {
        const singlePost = await Post.findById( postID )
        
        if (!singlePost) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        res.status(200).json({ success: true, data: singlePost})
    } catch (error) {
       res.json({ message: error}) 
    }
})


// Fourth route: For update existing post
router.patch('/update-post/:postID', async (req, res) => {
    const { postID } = req.params;
    const { title, content, category, tags, postImg } = req.body;
    //FInd by ID and Update.
    try {
        const updatedPost = await Post.findByIdAndUpdate(postID, {
            title,
            postImg,
            body: content,
            category,
            tags,
        }, { new: true });

        if (!updatedPost) {
            res.status(400).json({ success: false, msg: `No post with the ID ${updatedPost}`})
        }
        console.log(req.body.postImg)
        res.status(200).json({ success: true, data: updatedPost})
    } catch (error) {
        res.status(500).json({message: error})
    }

});

// Fifth route: Delete post
router.delete('/delete-post/:postID', async (req, res) => {
    const { postID } = req.params;

    //Find the post by ID and delete
    try {
        const deletePost = await Post.findByIdAndDelete( postID )
        
        if (!deletePost) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully!!'})
    } catch (error) {
       res.json({ message: error}) 
    }
})

// sixth route: filter by category
router.get('/post/category/:categoryName', async (req, res) => {
    //extract post ID using destruction
    const { categoryName } = req.params;

    //fetch all post with the category name
    try {
        const postInCategory = await Post.find({ category: categoryName })
        
        if (!postInCategory) {
            return res.status(404).json({success: false, message: 'Post not found'});
        }
        res.status(200).json({ success: true, data: postInCategory})
    } catch (error) {
        res.status(500).json({ message: error}) 
    }
    
})


// Seventh route: contact form
router.post('/contact', (req, res) => {
    const { fullname, phonenumber, email, subject, message } = req.body;

    const messageData = `
    Full Name: ${fullname},
    Phone Number: ${phonenumber},
    Email: ${email},
    message: ${message}
    `
    // Nodemail for sending emails to contacts

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'izuchi.alaneme@gmail.com',
            pass: 'fjzp fspn cprx wwqu'
        }
    });

    const mailOptions = {
        from: 'izuchi.alaneme@gmail.com',
        to: 'izuchukwualaneme@gmail.com, husseinimudiking@gmail.com, belloayoola20@gmail.com',
        subject: `${subject}`,
        text: `${messageData}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
});
})


// Export the router to use it in the main server file
module.exports = router;