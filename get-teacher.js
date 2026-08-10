const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'weconnect'
});

client.connect()
  .then(() => client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
  .then(res => {
    console.log('Teacher Info:');
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });
