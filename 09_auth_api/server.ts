import app from './app';
import { config } from 'dotenv';

config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));