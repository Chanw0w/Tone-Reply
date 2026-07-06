# PRD: Expert Communication Assistant (MVP)

An Expo + FastAPI mobile application that acts as an expert communication assistant and coach, helping users write better text responses and understand conversational dynamics.

## Component Hierarchy & Flow

```
+-------------------------------------------------------------+
|                        App Entry (_layout)                  |
|                                 |                           |
|       +-------------------------+-------------------------+ |
|       |                                                   | |
|  [Guest Flow]                                       [Auth Flow]
|  - LoginScreen                                      - Tab Navigation (Bottom Tabs)
|  - RegisterScreen                                       |
|                                                         +-- Home / Generate Replies Tab
|                                                         |   - Goal Select, Style Select, Length Select
|                                                         |   - Side-by-side Response Comparison
|                                                         |   - Favorites integration
|                                                         +-- Rewrite Tab
|                                                         |   - Rewrite single message into 9 styles
|                                                         +-- Explain / Coach Tab
|                                                         |   - Paste convo -> AI analysis & balance meter
|                                                         +-- Presets Tab
|                                                         |   - Create, list, delete custom style presets
|                                                         +-- History / Profile Tab
|                                                             - Past conversions, logged out toggle
+-------------------------------------------------------------+
```

## API Endpoints

### Auth Endpoints
- `POST /api/auth/register`
  - Body: `{ "email": "...", "password": "..." }`
  - Response: `{ "token": "...", "user": { "id": "...", "email": "..." } }`
- `POST /api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Response: `{ "token": "...", "user": { "id": "...", "email": "..." } }`
- `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "id": "...", "email": "..." }`

### Chat & Generation Endpoints
- `POST /api/chat/analyze`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "conversation_text": "..." }`
  - Response:
    ```json
    {
      "id": "...",
      "conversation_text": "...",
      "analysis": {
        "summary": "...",
        "emotional_tone": "...",
        "misunderstandings": "...",
        "answered_questions": "...",
        "conversation_balance": "...",
        "potential_ambiguity": "..."
      },
      "coaching_tips": ["...", "..."]
    }
    ```
- `POST /api/chat/generate`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "conversation_text": "...", "goal": "...", "length": "...", "custom_style": "..." }`
  - Response:
    ```json
    {
      "options": [
        { "style": "❤️ Loving", "text": "..." },
        { "style": "😎 Confident", "text": "..." },
        { "style": "😂 Funny", "text": "..." },
        { "style": "❄️ Cold", "text": "..." },
        { "style": "💼 Professional", "text": "..." }
      ]
    }
    ```
- `POST /api/chat/rewrite`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "text": "..." }`
  - Response:
    ```json
    {
      "rewrites": {
        "confident": "...",
        "romantic": "...",
        "flirty": "...",
        "less_needy": "...",
        "respectful": "...",
        "mysterious": "...",
        "masculine": "...",
        "feminine": "...",
        "professional": "..."
      }
    }
    ```

### Favorites & Presets
- `POST /api/chat/favorite`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "original_conversation": "...", "reply_text": "...", "style_label": "..." }`
  - Response: `{ "id": "...", "saved": true }`
- `GET /api/chat/favorites`
  - Headers: `Authorization: Bearer <token>`
  - Response: `[{ "id": "...", "original_conversation": "...", "reply_text": "...", "style_label": "..." }]`
- `POST /api/chat/preset`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "...", "goal": "...", "style": "...", "length": "..." }`
- `GET /api/chat/presets`
  - Response: `[{ "id": "...", "name": "...", "goal": "...", "style": "...", "length": "..." }]`
- `DELETE /api/chat/preset/{id}`
  - Response: `{ "success": true }`

## UI/UX Responsive Constraints
- Target mobile standard layouts (360px to 420px width)
- Minimum 48px touch targets for buttons
- Integrated `KeyboardAvoidingView` for all forms
- Proper Safe Area layouts with standard custom headers
