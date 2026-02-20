const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private
router.put(
    '/:id',
    auth,
    [
        check('name', 'Name is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { name } = req.body;

        try {
            let user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Ensure the authenticated user is updating their own profile
            if (user.id.toString() !== req.user.id) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }

            user.name = name;
            await user.save();

            res.json({ success: true, message: 'Profile updated successfully', data: { id: user.id, name: user.name, email: user.email } });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// @route   PUT api/users/change-password
// @desc    Change user password
// @access  Private
router.put(
    '/change-password',
    auth,
    [
        check('currentPassword', 'Current password is required').not().isEmpty(),
        check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { currentPassword, newPassword } = req.body;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Check current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }

            // Hash new password
            user.password = newPassword; // Pre-save hook will hash it
            await user.save();

            res.json({ success: true, message: 'Password changed successfully' });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// Add routes for settings or other user-specific data here.
// Example for settings update:
// @route   PUT api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
    const { timezone, dateFormat, emailNotifications, desktopNotifications } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Assuming user model has a 'settings' field or similar
        // For simplicity, directly update fields, in real app, might nest
        user.timezone = timezone || user.timezone;
        user.dateFormat = dateFormat || user.dateFormat;
        user.emailNotifications = emailNotifications !== undefined ? emailNotifications : user.emailNotifications;
        user.desktopNotifications = desktopNotifications !== undefined ? desktopNotifications : user.desktopNotifications;

        await user.save();
        res.json({ success: true, message: 'Settings updated successfully', data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;