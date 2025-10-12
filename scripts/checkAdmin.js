const { User } = require('../models/UserModel');
const { connection } = require('../config/config.db');

(async () => {
  try {
    await connection.authenticate();
    const u = await User.findOne({ where: { correo: 'admin@example.com' } });
    if (!u) {
      console.log('no admin');
      process.exit(0);
    }
    const j = u.toJSON();
    delete j['contraseña'];
    console.log(JSON.stringify(j, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('error', err);
    process.exit(1);
  }
})();
