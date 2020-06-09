const express=require('express');
const router=express.Router();
const {check, validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profiles = require('../../models/Profiles');
const User = require('../../models/User');


//@route  POST api/posts
//@desc   Create a post
//@access private
router.post('/',
[
  auth,
  [
  check('text', 'Text is required')
  .not()
  .isEmpty()
  ]
],
  async (req,res) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      })

      const post = await newPost.save();
      res.json(post);

    } catch (err) {

      console.error(err.message);
      res.status(500).send("server error");
    }


});

//@route  GET api/posts
//@desc   Get all posts
//@access private
router.get('/', auth, async (req, res) =>{
  try {
    const posts = await Post.find().sort({date: -1})
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
})

//@route  GET api/posts/:id
//@desc   Get post by id
//@access private
router.get('/:id', auth, async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id)
    if(!post){
      return res.status(404).json({msg: "post not found"});
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({msg: "post not found"});
    }
    res.status(500).send("server error");
  }
});

//@route  Delete api/posts/:id
//@desc   Delete a post by id
//@access private
router.delete('/:id', auth, async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json({msg: "post not found"});
    }

    //Check user
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({msg: "User not authorized"})
    }
    else{
      await post.remove();
      res.json({msg: "post removed"});
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({msg: "post not found"});
    }
    res.status(500).send("server error");
  }
});

//@route  Put api/posts/like/:id
//@desc   Put a post like by id
//@access private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has been liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ){
        return res.status(400).json({msg: "Post already liked"});
    }
    post.likes.unshift({user: req.user.id});
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server error");
  }
})

//@route  Put api/posts/unlike/:id
//@desc   Put a post unlike by id
//@access private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has been liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ){
        return res.status(400).json({msg: "Post has not yet been liked"});
    }

  //get remove index
  const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));

  post.likes.splice(removeIndex,1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server error");
  }
})

//@route  POST api/posts/comment/:id
//@desc   Add a comment
//@access private
router.post('/comment/:id',
[
  auth,
  [
  check('text', 'Text is required')
  .not()
  .isEmpty()
  ]
],
  async (req,res) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);


      await newPost.save();
      res.json(post);

    } catch (err) {

      console.error(err.message);
      res.status(500).send("server error");
    }
});

//@route  DELETE api/posts/comment/:id/:comment_id
//@desc   delete a comment
//@access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    //make sure comment exists
    if(!comment){
      return res.status(404).json({msg: "Comment does not exist"});
    }

    //check user
    if(comment.user.toString() !== req.user.id){
      return res.status(401).json({msg: "User not authorized"});
    }

    //get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id));

    post.comments.splice(removeIndex,1);
      await post.save();
      res.json(post.comments);


  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
})
module.exports=router;
