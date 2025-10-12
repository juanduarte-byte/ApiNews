const { Profile } = require('../models/ProfileModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');
const { connection } = require('../config/config.db');
const bcrypt = require('bcryptjs');

(async () => {
    try {
        await connection.authenticate();
        console.log('DB connected, running seeds...');

        const profiles = [
            { id: 1, nombre: 'Administrador' },
            { id: 2, nombre: 'Contribuidor' },
        ];

        for (const p of profiles) {
            await Profile.upsert(p);
            console.log('Seeded profile', p);
        }

        const states = [
            { id: 1, nombre: 'Pendiente', abreviacion: 'PEN' },
            { id: 2, nombre: 'Aprobado', abreviacion: 'APR' },
            { id: 3, nombre: 'Rechazado', abreviacion: 'REJ' },
        ];

        for (const s of states) {
            // provide defaults for required fields
            const entry = Object.assign({ activo: true, UserAlta: 'seed', FechaAlta: new Date() }, s);
            await State.upsert(entry);
            console.log('Seeded state', s);
        }

        // Seed an admin user if not exists
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
        const adminRawPass = process.env.SEED_ADMIN_PASS || 'admin123';
        const existingAdmin = await User.findOne({ where: { correo: adminEmail } });
        if (!existingAdmin) {
            const hashed = await bcrypt.hash(adminRawPass, 10);
            const adminData = {
                perfil_id: 1,
                nombre: 'Admin',
                apellidos: 'User',
                nick: 'admin',
                correo: adminEmail,
                activo: true,
                UserAlta: 'seed',
                FechaAlta: new Date(),
            };
            // use bracket notation for the password field name that contains non-ascii char
            adminData['contraseña'] = hashed;
            await User.create(adminData);
            console.log('Seeded admin user', adminEmail);
        } else {
            console.log('Admin user already exists:', adminEmail);
        }

        console.log('Seeding finished.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error', err);
        process.exit(1);
    }
})();
