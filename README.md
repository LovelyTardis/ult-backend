# ULT v1.1.1
This is the backend for the ULT project.\
IMPORTANT: All bodies and responses are JSON.

---
## Endpoints
### `/user`
- `GET /:username` and `GET /id/:id`
  - returns:
    ```javascript
    {
      code: 200,
      error: false,
      data: {
        name,
        username,
        email,
        profilePicture,
        ults,
        likedUlts,
        biography
      }
    }
    ```
---
- `POST /login`
  - needs:
    ```javascript
    // can receive either both bodies
    body: { username, password } |
          { email, password }
    ```
  - returns:
    ```javascript
    {
      code: 200,
      error: false,
      data: {
        token,
        uid,
        name,
        username,
        profilePicture,
        email,
        ults,
        likedUlts,
        biography
      }
    }
    ```
---
- `POST /autologin`
  - needs:
    ```javascript
    request.header: { "user-token": "stored JWT" }
    ```
  - returns:
    ```javascript
    {
      code: 200,
      error: false,
      data: {
        token,
        uid,
        name,
        username,
        profilePicture,
        email,
        ults,
        likedUlts,
        biography
      }
    }
    ```
---
- `POST /register`
  - needs:
    ```javascript
    body: {
      email,
      name,
      username,
      password // >= 6 characters
    }
    ```
  - returns:
    ```javascript
    {
      code: 201,
      error: false,
      data: { token }
    }
    ```
---
---
### `/ult`
- `GET /all`
  - returns:
    ```javascript
    {
      code: 200,
      error: false,
      data: {
        ults: allUlts,
        // this gets 5 ults by default*
      }
    }
    ```
    *see line 12 [findInDatabase.js](https://github.com/LovelyTardis/ult-backend/blob/main/database/helpers/findInDatabase.js)
---
- `GET /:ult`
  - returns:
    ```javascript
    {
      code: 200,
      error: false,
      data: {
        _id,
        message,
        datetime,
        user,
        ult,
        likes,
        comments
      }
    }
    ```
---
- `POST /create`
  - needs:
    ```javascript
    request.header: { "user-token": "stored JWT" };
    body: {
      message,
      ult // optional, can be null*
    }
    ```
    *see lines 30 and 47 [ult.controller.js](https://github.com/LovelyTardis/ult-backend/blob/main/controllers/ult.controller.js)
  - returns:
    ```javascript
    {
      code: 201,
      error: false,
      data: "Created - ult"
    }
    ```
---
---
## Custom errors
If any error occurs, the backend implements a custom error that returns:
```javascript
{
  code: 400 | 404 | 500,
  error: true,
  data: [errors] | "String with the error message"
  // The array of errors is done by the express-validator package*
}
```
*see lines 5 and 8 [validateFields.js](https://github.com/LovelyTardis/ult-backend/blob/main/middlewares/validators/validateFields.js)

---
---
## Used packages
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [path](https://www.npmjs.com/package/path)
---
This documentation was updated on March 30, 2023.