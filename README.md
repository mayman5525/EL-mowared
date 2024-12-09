# EL-mowared

this is EL-mowared back end structure that connects the customers with the row material suppliers all over egypt

# API Endpoints

## products endpoints

https://el-mowared.onrender.com/product

### GET /product

get all products

### POST /product

create new product
{
"name": { "en": "na2hcl", "ar": "ثاني هيدروكلورك الصوديوم" },
"description": { "en": "Description", "ar": "الوصف" },
"productFamily": "كلور",
"stockQuantity": 10,
"homeCountry": "egypt",
"size": "50 mg",
"productPhoto": "www.ofern.com",
"categoryId": 2,
"subcategoryId": 6,
"supplierId": 3
}

### GET /product/:id

get product by id

### PUT /product/:id

update product by id

### DELETE /product/:id

### GET /product/:id/stock

## suppliers endpoints

https://el-mowared.onrender.com/supplier

### GET /supplier

get all suppliers

### POST /supplier

create new supplier
{

}

## category end points

https://el-mowared.onrender.com/category

### GET /category

get all categories

### GET /category/:id

### POST /category

create new category
{
"name": {
"en": "chemicals",
"ar": "مواد كيميائية"
},
"Category_photo": "https://via.placeholder.com/150"
}

### PUT /category/:id

{
"name": "المواد الكيميائية",
"lang" : "ar",
"Category_photo": "https://via.placeholder.com/150"
}

### DELETE /category/:id

## subcategory end points

https://el-mowared.onrender.com/subcategories

### GET /subcategories

### POST /subcategories

{
"name":{
"en":"hcl",
"ar":"هيدروكلوريك"
},
"categoryId":"6",
"subcategory_photo":"www.iefownf.com"
}

### PUT /subcategories/:id

{
"name": {
"en": "subcategory name in English",
"ar": "subcategory name in Arabic"
},
"categoryId": 4,
"subcategory_photo": "http://example.com/photo.jpg"
}

### DELETE /subcategories/:id

GET /products/:id

Get a specific product by ID with related products and reviews.

Path Parameter:

id: Product ID to fetch details.

Example Request:
GET /products/1

POST /products

Create a new product.

Request Body:

{
"name": { "en": "Product Name", "ar": "اسم المنتج" },
"description": { "en": "Description", "ar": "الوصف" },
"productFamily": "Family Name",
"stockQuantity": 10,
"homeCountry": "Country",
"size": "Size",
"productPhoto": "Photo URL",
"categoryId": 1,
"subcategoryId": 2,
"supplierId": 3
}

Example Request:
POST /products

PUT /products/:id

Update an existing product.

Path Parameter:

id: Product ID to update.

Request Body:

{
"name": { "en": "Updated Name" },
"stockQuantity": 20
}

Example Request:
PUT /products/1

DELETE /products/:id

Delete a product.

Path Parameter:

id: Product ID to delete.

Example Request:
DELETE /products/1

POST /products/:productId/reviews

Create a review for a product.

Path Parameter:

productId: ID of the product to review.

Request Body:

{
"rating": 4,
"content": "Great product!"
}

Example Request:
POST /products/1/reviews
