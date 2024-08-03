const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const User = require("../models/user");
const Session = require("../models/session");

const supabaseUrl = "https://vdmogitfhjqmnqicorrj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbW9naXRmaGpxbW5xaWNvcnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2MDE1MDksImV4cCI6MjAzODE3NzUwOX0.Tr5hvwh0xKEWStxcQc6rACcgv_gRMReI5bRZiipwX60";
const jwsToken =
  "https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const supabase = createClient(supabaseUrl, supabaseKey);

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
 if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
 
 try {
    const { data, error: supabaseError } = await supabase.auth.signUp({ email, password });
 if (supabaseError) {
      return res.status(400).json({ error: supabaseError.message });
    }
   const hashedPassword = await bcrypt.hash(password, 10);
   const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
  
 if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, jwsToken, { expiresIn: "1h" });
    await Session.create({
      userId: user._id,
      ipAddress: req.ip,
    });
    res.status(200).json({
      message: "Login successful",
      username: user.username,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  const { userId } = req.user;

  try {
    const updatedSession = await Session.findOneAndUpdate(
      { userId, logoutTime: { $exists: false } },
      { logoutTime: new Date() },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "No active session found" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: err.message });
  }
};

