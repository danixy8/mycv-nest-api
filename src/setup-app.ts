import * as session from 'express-session';

export const setupApp = (app: any) => {
  app.use(
    session({
      secret: 'lalalalau',
      resave: false,
      saveUninitialized: false,
    }),
  );
};
