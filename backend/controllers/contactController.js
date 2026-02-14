const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    const contact = await Contact.create({
      name,
      email,
      message,
      ipAddress
    });

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully! We will get back to you soon.',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const { status, isRead } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: contacts.length,
      data: { contacts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact message not found'
      });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to contact message
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
exports.replyContact = async (req, res, next) => {
  try {
    const { reply } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact message not found'
      });
    }

    contact.reply = reply;
    contact.status = 'replied';
    contact.repliedAt = Date.now();
    await contact.save();

    res.status(200).json({
      status: 'success',
      message: 'Reply sent successfully',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
