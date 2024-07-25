import dotenv from 'dotenv';

const envfile = process.env.NODE_ENV === 'devolps' ? '.env.devolps' : '.env.deploy';

dotenv.config({ path: envfile });

const port = process.env.PORT || 3000;

// app.listen(port);

console.log(`Running in ${process.env.NODE_ENV} mode`);