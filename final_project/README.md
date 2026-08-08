# Express Book Reviews

**Student ID:** hungnthe181007

Node.js and Express API for listing books, searching by ISBN/author/title,
registering and logging in users, and managing authenticated book reviews.

## Run the application

```bash
npm install
npm start
```

The server runs at `http://127.0.0.1:5000`.

## Main endpoints

- `GET /` — all books
- `GET /isbn/:isbn` — book by ISBN
- `GET /author/:author` — books by author
- `GET /title/:title` — books by title
- `GET /review/:isbn` — reviews for one book
- `POST /register` and `POST /customer/login`
- `PUT` / `DELETE /customer/auth/review/:isbn` — JWT-protected review actions
