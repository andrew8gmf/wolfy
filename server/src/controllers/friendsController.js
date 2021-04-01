const User = require('../models/user');
const Friends = require('../models/friends');

require('dotenv').config();

module.exports = {
    async add(request, response) {
        const { UserA, UserB } = request.body;

        const docA = await Friends.findOneAndUpdate(
            { requester: UserA, recipient: UserB },
            { $set: { status: 1 }},
            { upsert: true, new: true }
        )
        const docB = await Friends.findOneAndUpdate(
            { recipient: UserA, requester: UserB },
            { $set: { status: 2 }},
            { upsert: true, new: true }
        )
        const updateUserA = await User.findOneAndUpdate(
            { _id: UserA },
            { $push: { friends: docA._id }}
        )
        const updateUserB = await User.findOneAndUpdate(
            { _id: UserB },
            { $push: { friends: docB._id }}
        )

        return response.send({ message: 'added' });
    },

    async accept(request, response) {
        const { UserA, UserB } = request.body;

        const updateUserA = await Friends.findOneAndUpdate(
            { requester: UserA, recipient: UserB },
            { $set: { status: 3 }}
        )
        const updateUserB = await Friends.findOneAndUpdate(
            { recipient: UserA, requester: UserB },
            { $set: { status: 3 }}
        )

        return response.send({ message: 'accepted' });
    },

    async remove(request, response) {
        const { UserA, UserB } = request.body;

        const docA = await Friends.findOneAndRemove(
            { requester: UserA, recipient: UserB }
        )
        const docB = await Friends.findOneAndRemove(
            { recipient: UserA, requester: UserB }
        )
        const updateUserA = await User.findOneAndUpdate(
            { _id: UserA },
            { $pull: { friends: docA._id }}
        )
        const updateUserB = await User.findOneAndUpdate(
            { _id: UserB },
            { $pull: { friends: docB._id }}
        )

        return response.send({ message: 'removed' });
    },
};