const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();

const leadRoutes = require('./routes/leadRoutes');
const agentRoutes = require('./routes/agentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const tagRoutes = require('./routes/tagRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// DB connection
mongoose.connect(process.env.MONGODB)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// ROUTES
app.use('/leads', leadRoutes);
app.use('/agents', agentRoutes);
app.use('/leads', commentRoutes); // comments nested under leads
app.use('/tags', tagRoutes);
app.use('/report', reportRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
