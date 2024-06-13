import { Request, Response, NextFunction } from 'express';
import { Item } from '../models';

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body;
  const { id } = req.params;
  if (!name && !description)
    return res.status(400).json({
      success: false,
      message: 'neither namse or description are missed',
    });

  try {
    const item = await Item.findOneAndUpdate(
      { _id: id },
      { name, description },
      { new: true }
    );
    if (!item)
      return res
        .status(400)
        .json({ success: false, message: 'failed to finde item' });

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body === undefined)
    return res.status(400).json({ error: 'must have body!', success: false });
  const { name, description } = req.body;
  if (!name || !description)
    return res
      .status(400)
      .json({ error: 'check inputs and try again', success: false });

  try {
    const item = await Item.create({ name, description });
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await Item.find();
    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const item = await Item.findOne({
      _id: id,
    });
    if (!item)
      return res.status(400).json({
        success: false,
        message: 'invalid item id',
      });

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const item = await Item.findOneAndDelete({ _id: id });
    if (!item)
      return res
        .status(400)
        .json({ success: false, message: 'failed to finde item' });

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};
