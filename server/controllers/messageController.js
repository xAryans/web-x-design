const { Message, Patient, Doctor } = require('../models');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, receiverModel, content } = req.body;
        const senderId = req.user.id;
        const senderModel = req.user.role === 'patient' ? 'Patient' : 'Doctor';

        const message = await Message.create({
            senderId,
            senderModel,
            receiverId,
            receiverModel,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { contactId } = req.params;
        const userId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: contactId },
                { senderId: contactId, receiverId: userId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find all unique users this user has messaged with
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });
        
        const contactIds = new Set();
        messages.forEach(m => {
            if (m.senderId.toString() !== userId) contactIds.add(m.senderId.toString());
            if (m.receiverId.toString() !== userId) contactIds.add(m.receiverId.toString());
        });

        const contactsList = Array.from(contactIds);
        
        let contacts = [];
        if (req.user.role === 'patient') {
            contacts = await Doctor.find({ _id: { $in: contactsList } }).select('name specialization');
        } else {
            contacts = await Patient.find({ _id: { $in: contactsList } }).select('name');
        }

        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
