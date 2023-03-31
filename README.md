# ULT v1.1.2
This is the backend for the ULT project.\
Important: all bodies and responses are JSON.

This documentation was updated on March 31, 2023 (sad day, Priconne has announced EOS).
# Usage
First of all, download the repository and execute `npm install`.

Then, create a `.env` file in the root following the `.env.example` with your variables (mongo database connection, used port, secret key for JWT).

To run the app you can use `npm start` if you are running it normally, or `npm run dev` if you are running it for development.

An example:
```properties
npm install
npm start
```
# Endpoints
## `/user`
GET `/:username` and GET `/id/:id`
  ```javascript
  // returns
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
POST `/login`
  ```javascript
  // needs
  body: { username, password } |
        { email, password }
        // can receive either both bodies*
  ```
  *see lines 14 to 24 [validateLoginCredentials.js](https://github.com/LovelyTardis/ult-backend/blob/main/middlewares/validators/validateLoginCredentials.js#L14-L24)
  ```javascript
  // returns
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
POST `/autologin`
  ```javascript
  // needs
  request.header: { "user-token": "stored JWT" }
  ```
  ```javascript
  // returns
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
POST `/register`
  ```javascript
  // needs
  body: {
    email,
    name,
    username,
    password // >= 6 characters
  }
  ```
  ```javascript
  // returns
  {
    code: 201,
    error: false,
    data: { token }
  }
  ```
## `/ult`
GET `/all`
  ```javascript
  // returns
  {
    code: 200,
    error: false,
    data: {
      ults: allUlts,
      // this gets an array of 5 ults by default*
    }
  }
  ```
  *see line 12 [findInDatabase.js](https://github.com/LovelyTardis/ult-backend/blob/main/database/helpers/findInDatabase.js#L12)

GET `/:ult`
  ```javascript
  // returns
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
POST `/create`
  ```javascript
  // needs
  request.header: { "user-token": "stored JWT" };
  body: {
    message,
    ult // optional, can be null*
  }
  ```
  *see lines 30 and 47 [ult.controller.js](https://github.com/LovelyTardis/ult-backend/blob/main/controllers/ult.controller.js#L30)

  ```javascript
  // returns
  {
    code: 201,
    error: false,
    data: "Created - ult"
  }
  ```
# Custom errors
If any error occurs, the backend implements a custom error that returns:
```javascript
{
  code: 400 | 404 | 500,
  error: true,
  data: [errors] | "String with the error message"
  // The array of errors is done by the express-validator package*
}
```
*see lines 5 and 8 [validateFields.js](https://github.com/LovelyTardis/ult-backend/blob/main/middlewares/validators/validateFields.js#L5)

# Used packages
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [path](https://www.npmjs.com/package/path)