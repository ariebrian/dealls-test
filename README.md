# Dating App Service
## Project Structure

```bash
.
├── Dockerfile
├── README
├── app.js
├── controllers
│   ├── AuthController.js
│   └── SwipeController.js
├── index.js
├── models
│   ├── Swipe.js
│   └── User.js
├── package-lock.json
├── package.json
├── repositories
│   ├── SwipeRepository.js
│   └── UserRepository.js
├── routes
│   ├── AuthRoutes.js
│   └── SwipeRoutes.js
├── services
│   ├── SwipeService.js
│   └── UserService.js
├── tests
│   ├── swipeService.test.js
│   └── userService.test.js
└── utils
    └── jwtUtil.js
```

## Running the services
1. Copy the ```.env.example``` file and fill the value

2. running service
    ```npm run start```

3. running service in development mode
    ```npm run dev```

3. running tests
    ```npm run test```
