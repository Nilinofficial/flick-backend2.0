import { Request, Response } from 'express';

export const getProfile = async (req: Request<{}, {}, {}>, res: Response):Promise<any> => {
  const user = req.user;


  try {
    return res.status(200).json({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    } else {
      return 'An unexpected error occured';
    }
  }
};
