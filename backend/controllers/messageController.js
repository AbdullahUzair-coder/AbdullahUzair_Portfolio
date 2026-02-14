const Message = require('../models/Message');

// @desc    Submit contact form message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email, and message'
      });
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be between 2 and 100 characters'
      });
    }

    // Validate message length
    if (message.trim().length < 10 || message.trim().length > 1000) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must be between 10 and 1000 characters'
      });
    }

    // Create message in database
    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        message: {
          id: newMessage._id,
          name: newMessage.name,
          email: newMessage.email,
          createdAt: newMessage.createdAt
        }
      }
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages[0] || 'Validation failed',
        errors: messages
      });
    }

    // Handle other errors
    console.error('Error creating message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message. Please try again later.'
    });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res, next) => {
  try {
    const { page, limit, sortBy } = req.query;

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };
    if (sortBy === 'name') sortOption = { name: 1 };

    // Get messages
    const messages = await Message.find()
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip);

    // Get total count
    const total = await Message.countDocuments();

    res.status(200).json({
      status: 'success',
      count: messages.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { messages }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages'
    });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private/Admin
exports.getMessage = async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID format'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { message }
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch message'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID format'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message'
    });
  }
};
