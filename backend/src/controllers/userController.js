const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateToken(params = {}) {
    return jwt.sign(params, process.env.AUTH_SECRET, {
        expiresIn: '1h',
    });
};

module.exports = {
    async list(request, response) {
        const users = await User.find();

        return response.json(users);
    },

    async register(request, response) {
        const { email, username, password } = request.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                username,
                password,
            });

            user.password = undefined;

            const token = crypto.randomBytes(64).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    emailConfirmationToken: token,
                    emailConfirmationExpires: now,
                }
            }, { new: true, useFindAndModify: false });

            const link = `http://localhost:3333/verify-email?token=${token}`;

            const msg = {
                to: email,
                from: 'andrew8gmf@gmail.com',
                subject: 'Confirm your Wolfy account',
                html: `<p>Click here: ${link}</p>`,
            };

            try {
                await sgMail.send(msg);
                return response.send({ message: 'Email confirmation link has been successfully sent to your inbox' });
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        };

        return response.status(400).send({ error: 'Email is already in use' });
    },

    async verify(request, response) {
        const user = await User.findOneAndUpdate({ emailConfirmationToken: request.query.token, isVerified: true });

        if(!user) {
            return response.status(400).send({ error: 'Token invalid' });
        }

        return response.send({ message: 'Email verified!' });
    },

    async login(request, response) {
        const { email, password } = request.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        };

        if (!await bcrypt.compare(password, user.password)) {
            return response.status(400).send({ error: 'Invalid password' });
        };

        user.password = undefined;

        response.json({
            user,
            token: generateToken({ id: user.id }),
        });
    },

    async home(request, response) {
        response.send({ ok: true, user: request.userId });
    },

    async forgot(request, response) {
        const { email } = request.body;

        const user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        };

        const token = generateToken({ id: user.id });

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        }, { new: true, useFindAndModify: false });

        const link = `http://localhost:3333/reset_password/${token}`;

        const msg = {
            to: email,
            from: 'andrew8gmf@gmail.com',
            subject: 'Change your Wolfy account password',
            html: `<p>Click here: ${link}</p>`,
        };

        try {
            await sgMail.send(msg);
            return response.send({ message: 'Password reset link has been successfully sent to your inbox' });
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    },

    async reset(request, response) {
        const { password } = request.body;
        const { token } = request.params;
        const decoded = jwt.verify(token, process.env.AUTH_SECRET);

        const user = await User.findOne({ _id: decoded.id }).select('+passwordResetToken passwordResetExpires');

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        };

        if (token !== user.passwordResetToken) {
            return response.status(400).send({ error: 'Token invalid' });
        };

        const now = new Date();

        if (now > user.passwordResetExpires) {
            return response.status(400).send({ error: 'Token expired, generate a new one' });
        };

        user.password = password;

        await user.save();

        response.send({ message: 'Password changed' });
    },
};