import { RequestHandler } from "express";
import { z } from "zod";

type ValidateMiddleware = (schema: z.ZodObject<any>) => RequestHandler<any, any, any, any, any>;

export const validate: ValidateMiddleware = (schema) => (req, res, next) => {
  const { error, data } = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  if (error) {
    res.status(400).json({ error: error.errors });
    return;
  }

  req.body = data.body;
  req.params = data.params;
  req.query = data.query;

  next();
};
