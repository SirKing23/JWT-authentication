# Full-Stack Authentication App with Supabase & OpenAI

A production-ready authentication application with Supabase backend, JWT authentication, and OpenAI integration. Built with vanilla HTML/CSS/JavaScript frontend and FastAPI backend.

## 🚀 Features

- **Secure Authentication**: Login and sign-up using Supabase with email/password
- **JWT Token Verification**: Production-ready JWT verification with Supabase JWT secret
- **Protected API Endpoints**: Chat endpoint secured with JWT authentication
- **OpenAI Integration**: Interactive chat interface powered by OpenAI GPT-3.5
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Environment Variables**: All sensitive credentials stored securely in .env files
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 📁 Project Structure

```
authentication/
├── frontend/
│   ├── index.html              # Main HTML file with login, signup, and chat UI
│   ├── app.js                  # JavaScript logic for auth and chat
│   ├── styles.css              # Styling for the application
│   ├── config.js               # Configuration file (created from config.example.js)
│   ├── config.example.js       # Template for frontend configuration
│   └── .gitignore              # Protects sensitive config files
└── backend/
    ├── main.py                 # FastAPI server with JWT verification
    ├── requirements.txt        # Python dependencies
    ├── .env                    # Environment variables (create from .env.example)
    ├── .env.example            # Template for environment variables
    └── .gitignore              # Protects sensitive .env file
```

## 🔐 How JWT Authentication Works

1. **User Login**: User submits email/password to Supabase
2. **Token Generation**: Supabase generates a JWT token and returns it
3. **Token Storage**: Frontend stores the token in session
4. **Protected Requests**: Frontend sends token in `Authorization: Bearer <token>` header
5. **Token Verification**: Backend verifies JWT signature using Supabase JWT secret
6. **Access Granted**: If valid, user can access chat endpoint

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Supabase account (free tier available)
- OpenAI API key (requires account with credits)
- Web browser with HTTP server capability

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```
   
   Then edit `.env` and add your credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   SUPABASE_JWT_SECRET=your-supabase-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
   ```

6. **Get Supabase Credentials**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project → Settings → API
   - Copy `Project URL` → Use as `SUPABASE_URL`
   - Copy `anon public` key → Use as `SUPABASE_KEY`
   - Copy `JWT Secret` → Use as `SUPABASE_JWT_SECRET`

7. **Get OpenAI API Key**:
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create new secret key → Use as `OPENAI_API_KEY`

8. **Enable Email Authentication in Supabase**:
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates if needed

9. **Run the backend server**:
   ```bash
   python main.py
   ```
   Server will start at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Configure frontend**:
   ```bash
   # Copy the example config file
   cp config.example.js config.js
   ```
   
   Then edit `config.js` and add your credentials:
   ```javascript
   const CONFIG = {
       SUPABASE_URL: 'https://your-project.supabase.co',
       SUPABASE_KEY: 'your-supabase-anon-key',
       BACKEND_URL: 'http://localhost:8000'
   };
   ```

3. **Start a local HTTP server**:
   - Using Python:
     ```bash
     python -m http.server 3000
     ```
   - Or using Node.js:
     ```bash
     npx http-server -p 3000
     ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

## 🔌 API Endpoints

### POST /chat
Send a message to get a response from OpenAI GPT-3.5.

**Authentication**: Required (JWT Bearer token)

**Request**:
```json
{
  "message": "What is the capital of France?"
}
```

**Headers**:
```
Authorization: Bearer <supabase-jwt-token>
Content-Type: application/json
```

**Response**:
```json
{
  "reply": "The capital of France is Paris."
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `400 Bad Request`: Empty message
- `429 Too Many Requests`: OpenAI rate limit exceeded
- `500 Internal Server Error`: Server or OpenAI API error

### GET /
Root endpoint with API information.

**Response**:
```json
{
  "message": "Authentication API is running",
  "endpoints": {
    "chat": "POST /chat"
  }
}
```

### GET /health
Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "service": "authentication-api"
}
```

## 🎯 User Flow

1. **Sign Up**: User creates account with email and password
2. **Login**: User logs in with credentials
3. **JWT Token**: Supabase generates and returns JWT token
4. **Dashboard**: User sees chat interface
5. **Chat**: User sends message → Frontend sends request with JWT token → Backend verifies JWT → OpenAI processes message → Response displayed
6. **Logout**: User logs out, token is cleared

## 🔒 Security Features

### JWT Verification
- ✅ Full JWT signature verification using Supabase JWT secret
- ✅ Token expiration checking
- ✅ Audience validation
- ✅ User ID extraction from token payload

### Environment Variables
- ✅ All sensitive credentials in .env files
- ✅ .gitignore protects .env from version control
- ✅ Example templates provided for easy setup

### CORS Configuration
- ✅ Configurable allowed origins
- ✅ Credentials support
- ✅ Production-ready CORS settings

### Error Handling
- ✅ Comprehensive error messages
- ✅ Proper HTTP status codes
- ✅ User-friendly error display
- ✅ OpenAI API error handling

## 🚨 Important Security Notes

### For Production Deployment:

1. **Update CORS Origins**:
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **Use HTTPS**: Always use HTTPS in production
   - Update `BACKEND_URL` in frontend config.js
   - Configure SSL certificate for your domain

3. **Secure Environment Variables**:
   - Never commit .env files to version control
   - Use secure secret management in production
   - Rotate secrets regularly

4. **Rate Limiting**: Add rate limiting to prevent abuse
   ```python
   # Add to main.py
   from slowapi import Limiter
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   ```

5. **Input Validation**: Already implemented with Pydantic models

6. **Monitor API Usage**: Track OpenAI API usage to avoid unexpected costs

## 📝 Frontend Components

### Login Form
- Email and password authentication
- Form validation
- Error message display
- Toggle to sign-up form

### Sign Up Form
- Email and password registration
- Password confirmation
- Form validation
- Automatic login after signup

### Chat Interface
- Real-time message display
- User and AI message differentiation
- Auto-scroll to latest message
- Error handling for failed requests

### User Dashboard
- Displays logged-in user email
- Logout functionality
- Protected chat access

## 🐛 Troubleshooting

### Backend Issues

**Error: "SUPABASE_JWT_SECRET must be set"**
- Solution: Add `SUPABASE_JWT_SECRET` to your `.env` file
- Get it from: Supabase Dashboard → Settings → API → JWT Secret

**Error: "Invalid token"**
- Solution: Ensure SUPABASE_JWT_SECRET matches your Supabase project
- Check token is being sent correctly from frontend

**Error: "OpenAI API authentication failed"**
- Solution: Verify OPENAI_API_KEY in .env
- Check your OpenAI account has available credits

### Frontend Issues

**Error: "CONFIG is not defined"**
- Solution: Ensure `config.js` exists and is loaded before `app.js`
- Check `<script src="config.js"></script>` is in index.html

**CORS Error**
- Solution: Ensure backend is running
- Check ALLOWED_ORIGINS in backend .env includes your frontend URL
- Verify frontend is using correct BACKEND_URL

**Session expired error**
- Solution: Log out and log back in
- Check Supabase session is valid
- Clear browser localStorage if issues persist

### Common Setup Mistakes

1. **Missing JWT Secret**: Most common issue - JWT Secret is required!
2. **Wrong Supabase Key**: Make sure you use the "anon public" key, not the service role key
3. **Backend not running**: Frontend needs backend at http://localhost:8000
4. **Email auth not enabled**: Enable in Supabase Dashboard → Authentication → Providers

## 📚 Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **PyJWT**: JWT token verification
- **OpenAI**: GPT-3.5 Turbo integration
- **Python-dotenv**: Environment variable management
- **Uvicorn**: ASGI server

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **Supabase JS Client**: Authentication and session management
- **HTML5/CSS3**: Modern, responsive design

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [JWT.io](https://jwt.io) - JWT debugging tool

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This is a production-ready template. Make sure to follow all security best practices when deploying to production.