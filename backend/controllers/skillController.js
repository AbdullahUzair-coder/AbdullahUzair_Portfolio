const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const { category, all } = req.query;
    
    let query = {};
    
    // If 'all' param is not set, only show active skills (for public)
    if (!all) {
      query.isActive = true;
    }
    
    if (category) {
      query.category = category;
    }

    const skills = await Skill.find(query)
      .sort({ priority: -1, proficiency: -1 });

    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: { skills }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { skill }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
exports.createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { skill }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
exports.updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { skill }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills grouped by category
// @route   GET /api/skills/grouped
// @access  Public
exports.getSkillsByCategory = async (req, res, next) => {
  try {
    const skills = await Skill.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          skills: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { skills }
    });
  } catch (error) {
    next(error);
  }
};
