# MongoDB Setup Guide



## Step 1: Update MongoDB Connection String

1. **Open** `backend/.env` file
2. **Replace** `YOUR_PASSWORD_HERE` with your actual MongoDB password
3. **Ensure** the database name is correct (I set it to `lead_distribution`)

Your `.env` should look like:
```
PORT=5000
MONGO_URI=mongodb+srv://team:YOUR_ACTUAL_PASSWORD@cluster0.ipriv71.mongodb.net/lead_distribution?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRE=7d
```

## Step 2: Get Your MongoDB Password

If you don't have the password:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your Cluster0
3. Go to **Database Access** → Find the `team` user
4. Click **Edit** and reset the password
5. Update the `.env` file with the new password

## Step 3: Verify Network Access

1. In MongoDB Atlas, go to **Network Access**
2. Ensure your IP address is whitelisted
3. Add `0.0.0.0/0` for testing (not recommended for production)

## Step 4: Restart Backend

1. **Stop** the current backend server (Ctrl+C in terminal)
2. **Restart** with updated credentials:
   ```bash
   cd backend
   npm run dev
   ```

## Alternative: Use Local MongoDB

If MongoDB Atlas is problematic, you can use local MongoDB:

1. Install MongoDB locally
2. Update `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/lead_distribution
   ```

## Test Connection

Once updated, you should see:
```
Server running on port 5000
MongoDB connected
```

## Quick Debug Commands

```bash
# Check if MongoDB is accessible
mongosh "mongodb+srv://cluster0.ipriv71.mongodb.net/lead_distribution" --username team

# Test connection string
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected')).catch(err => console.log('Error:', err.message))"
```