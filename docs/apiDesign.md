# API Design

## User Module

### Signup
**POST** `/auth/signup`

**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string",
  "username": "string",
  "phone": "string"
}
```

**Response Body:**
```json
{
  "message": "string",
  "userid": "string"
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Body:**
```json
{
  "message": "string",
  "userid": "string"
}
```

### Logout
**POST** `/auth/logout`

**Request Body:**
```json
{
  "userid": "string"
}
```

**Response Body:**
```json
{
  "message": "string"
}
```

## Book Module

### Add New Book (Admin Only)
**POST** `/books`

**Request Body:**
```json
{
  "isbn": "string",
  "title": "string",
  "author": "string",
  "publisher": "string",
  "year": "integer",
  "price": "number",
  "category": "string",
  "StockLevel": "integer",
  "Threshold": "integer"
}
```

**Response Body:**
```json
{
  "message": "string",
  "isbn": "string"
}
```

### Search Books (Customer and Admin)
**GET** `/books?isbn=123&title=abc&category=Science&author=xyz&publisher=pqr`

**Response Body:**
```json
{
  "message": "string",
  "books": [
    {
      "isbn": "string",
      "title": "string",
      "author": "string",
      "price": "number"
    }
  ]
}
```

### Modify Book (Admin Only)
**PUT** `/books/{isbn}`

**Request Body:**
```json
{
  "quantity": "integer"
}
```

**Response Body:**
```json
{
  "message": "string",
  "quantity": "integer"
}
```

## Operation Module

### Place Order (Admin Only)
**POST** `/orders/place`

**Request Body:**
```json
{
  "publishersid": "string",
  "isbn": "string",
  "quantity": "integer"
}
```

**Response Body:**
```json
{
  "message": "string",
  "orderid": "string"
}
```

### Confirm Order (Admin Only)
**POST** `/orders/confirm`

**Request Body:**
```json
{
  "orderid": "string",
  "publishersid": "string",
  "isbn": "string",
  "quantity": "integer"
}
```

**Response Body:**
```json
{
  "message": "string",
  "quantity": "integer"
}
```

### Add to Cart (Customer Only)
**POST** `/orders/addtocart`

**Request Body:**
```json
{
  "userid": "string",
  "isbn": "string",
  "quantity": "integer"
}
```

**Response Body:**
```json
{
  "message": "string",
  "quantity": "integer",
  "isbn": "string"
}
```

### Remove from Cart (Customer Only)
**POST** `/orders/removefromcart`

**Request Body:**
```json
{
  "userid": "string",
  "isbn": "string"
}
```

**Response Body:**
```json
{
  "message": "string",
  "quantity": "integer",
  "isbn": "string"
}
```

### View Past Orders (Customer Only)
**POST** `/orders/viewpastorders`

**Request Body:**
```json
{
  "userid": "string"
}
```

**Response Body:**
```json
{
  "message": "string",
  "orders": []
}
```

## Reports (Admin Only)

### Monthly Report
**GET** `/admin/reports/sales/monthly`

**Response Body:**
```json
{
  "message": "string",
  "total sales": "number"
}
```

### Daily Sales Report
**GET** `/admin/reports/sales/daily?date=YYYY-MM-DD`

**Response Body:**
```json
{
  "message": "string",
  "total sales": "number"
}
```

### Top 5 Customers
**GET** `/admin/reports/top-customers`

**Response Body:**
```json
{
  "message": "string",
  "customers": []
}
```

### Top 10 Selling Books
**GET** `/admin/reports/top-books`

**Response Body:**
```json
{
  "message": "string",
  "books": []
}
```
