exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role, // save role
    });

    await user.save();
    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
