Calories tracking WebApp

### Running locally:

Install local dependencies with 
`npm install`

To start the server, simply:
```
npm run server
# or
yarn server
```

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Api will run by default on `http://localhost:8081`, although the port can be changed in the `.env`

### API routes
Currently we have the following routes for authentication:

```
/users/login
/users/signup
/users/logout
/users/refreshToken
/users/info <- Return currently logged user data
```

It is yet to be implemented:
```
/products/:userId <- (GET, POST) on products for a user (regular user messes with his products, admin messes with anyone's) 
/products/:userId/:productId <- (PUT, DELETE) on a product for a user (same authentication logic as the one above)
/products/report <- admins only, get the reporting thingy information
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
