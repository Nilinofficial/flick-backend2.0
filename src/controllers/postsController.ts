import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary';
import fs from 'fs/promises';
import Post from '../models/postModel';
import { json } from 'stream/consumers';
import connectionRequestModel from '../models/connectionRequestModel';

export const addPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { caption } = req.body;
    const file = req.file;
    const userId = req.userId;

    console.log(caption);
    console.log(typeof caption);

    if (!file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: 'posts',
    });
    await fs.unlink(file.path);

    const newPost = await Post.create({
      userId,
      caption,
      postUrl: uploadResult.secure_url,
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      message: 'Failed to create post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllposts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const loggedInUserId = req.userId;
    const friends = await connectionRequestModel
      .find({ status: 'accepted' })
      .select('fromUserId toUserId')
      .lean();

    console.log(friends);

    const friendsId = friends
      .map((friend) => [friend.fromUserId, friend.toUserId])
      .flat()
      .filter((id) => id.toString() !== loggedInUserId?.toString());

    console.log(friendsId);

    const posts = await Post.find({ userId: { $in: friendsId } }).populate(
      'userId',
      ['firstName']
    );

    return res.status(200).json({
      message: 'successfully fetched posts',
      json: posts,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      message: 'Failed to create post',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
