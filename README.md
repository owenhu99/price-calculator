# csc301-a1-web

This is the web-app part of assignment 1 of CSC301 - assignment pair 90.

## Getting Started



1. Clone this repository to your local machine.

2. Install the package's dependencies with `npm ci`

3. Start the app with `npm start`

4. Access the web page at http://localhost:3000

## Usage

You can add items by entering the UPC of stock items into the input form on the top left and clicking add. (View the 'Stock' section for a list of available items to add).

You can remove an item by clicking the cross on the 'Remove' column. This will take away one unit of the corresponding item.

The default tax rate is 13% and the default discount is 0%, but you can change them by clicking 'Tax Rate' or 'Discount' on the top right (or hitting the drop down menu icon on mobile) and entering a custom number from 1-100.

## Stock

|UPC             |Item Name                      |Unit Price                   |
|----------------|-------------------------------|-----------------------------|
|100001|Salted butter|2.99|
|100002|Whole white mushrooms|1.69|
|100003|Apple, Honeycrisp|0.6|
|100004|Soft white sliced bread|2.99|
|100005|Asparagus, bunch|2.11|
|100006|Stuffed turkey|22.84|
|100007|Dark maple syrup|6.99|
|100008|Fresh Atlantic Salmon Portion|3.99|
|100009|Organic banana|0.41|
|100010|Large eggs, 12 un.|2.89|
|100011|Orange Juice Without Pulp, Premium|5.49|
|100012|Instant coffee, Rich|7.99|
|100013|Roasted salted pistachios|5.99|

## Program Behavior

For testers, this is the how the program works.

When the application starts after `npm start`, `app.js` is run. This acts as the [Express.js](https://expressjs.com/) server and handles requests. The Express server listens on port 3000 by default and uses [Pug](https://pugjs.org/api/getting-started.html) as the default view engine.

Currently, the server only handles GET requests at root domain which renders the main checkout page and POST requests at `localhost:3000/search` to look up item data.

A root domain GET request results in the rendering of `index.pug` located in the `views` folder. `index.pug` uses the Bootstrap CSS and JS libraries, a full JQuery library. The navigation bar is taken from a Bootstrap 4 starter template called "[Bare](https://startbootstrap.com/templates/bare/)". All additional functionalities are implemented with JQuery in `script.js` under `public/javascripts`.

### Add Item

The main feature of the checkout menu or price calculator is the "Add" form on the top left of the page in the navigation bar. It takes a UPC string as input and upon hitting submit, an AJAX POST request is sent to `/search` with the UPC string assigned under `value` inside a JSON object. Any type of string is accepted, including an empty string.

`app.js` handles the POST request and looks for an item with that UPC in a previously cached JSON object that was read from `stock.json` under the `data` folder. If the item is found, the Express server sends back a JSON object containing the item's data, including the UPC, item name, unit price, and a `found` boolean flag. If the item is not found, the same JSON object is sent back but with `found` set to 0.

Upon success, the AJAX function takes the JSON object that was sent back and pass it through a helper function `onSuccess(data)` to add the item to the array of dictionary `items` that stores the added items and their quantity and renders the item to the table. We use a synchronous helper function here to avoid problem with the asynchronous AJAX call.

### Remove Item(s)

You can remove an added item by clicking the cross icon on the 'Delete' column of the table. It will remove one unit of the corresponding item on-click and the new price total will be automatically rendered. The removal also physically removes and changes the quantity of the item in the `items` array in `script.js`.

### Change Tax Rate and Discount Rate

You can also change the tax rate which is 13% by default and the discount rate which is 0% by default with the links on the top right corner of the web page also in the navigation bar.

Clicking them will bring up a pop-up window that is rendered with the Bootstrap class 'modal'. You can type in the a new percentage number and submit. This will store the new rates inside `script.js` and automatically update the new price total. 

## Report

Here is the report of the decisions made before and during the development of this application.

### Back End

When considering the back end architecture, I immediately chose Express.js because of two reasons. Firstly, I have a fair amount of experience developing applications with Javascript and nodeJS and using its package manager. Secondly, with Express.js and nodeJS, I will be able to build the entire stack using Javascript which makes getting started fast, but also avoids having to hire a large team of people with different expertise for future development.

Compared to other popular alternatives:

|    | Pros | Cons |
|----|------|------|
|Django| - Fully loaded with functionalities<br>- Currently popular language<br>- Very secure, hard to make security mistakes<br>- Scalable | - Requires knowledge of the whole system<br>- Not as fast compared to PHP<br>- Takes time to deploy due to all the functionalities, may not be suitable for small websites<br>- Too monolithic, so it evolves very slowly |
|PHP| - Old language<br>- Extensive documentation<br>- Flexibility<br> - Easy to set up|- Declining popularity means less new developers taking up the language<br>- Lack of libraries for modern needs<br>- Needs to learn a new language and all of its different frameworks<br>- Easy to have security flaws|
|Ruby on Rails| - Opinionated framework means it has conventions for best practices<br>- Ruby language is concise and expressive which allows fast development<br>- Good community support <br>- Also very secure| - Slow runtime <br> - Lack of flexibility <br> - Lower popularity <br> - Cost of a mistake is very high|

### Front End

When considering the front end architecture, I initially decided to use one of Angular, React or Vue. Here is a comparison:

|    | Pros | Cons |
|----|------|------|
|Angular| - Most popular framework with community support <br> - Data binding between Model and View, making development faster <br> - Dependency injection allows components to be decoupled and easier to manage and test | - Steep learning curve <br> - Low performance speed due to its dynamic nature <br> - No JQuery support |
|React| - Easier to create dynamic componenets with<br> - Reuseable components make development faster <br> - Faster compared to other dynamic frameworks because of virtual DOM <br> - Known to be SEO friendly| <br> - Poor documentation <br> - Needs to learn JSX syntax which can be confusing <br> - Narrow focus on UI |
|Vue| - Very lightweight <br> - Virtual DOM improves performance <br> - Components are reuseable <br> - Code readability <br> - Good for unit testing | <br> - Lack of comprehensive documentation <br> - Lack of experience developers for future expansion <br> - Language barrier with community discussion (many in Chinese)|

After careful consideration, I have decided to not go with any framework and instead use vanilla HTML + CSS + JS + JQUERY. The UI of the application is extremely simple, so minimum UI design is needed. I have recently used Bootstrap templates so I am quite comfortable developing the application from a simple Bootstrap template. The functionalitiy is also very minimum, so basic JQuery functions will more than suffice. Combined with the lack of development time, I decided to not learn any new framework.

### Database

When it comes to databases, there are three apparent choices:

|    | Pros | Cons |
|----|------|------|
|MySQL| - Straightforward relational data storage <br> - Quick and easy management <br> - Fast and reliable | - Reported stability issues <br> - Poor performance scaling <br> - Innovation speed is slow since it's owned by Oracle <br> - Limitations when implementing complex data types |
|PostgresQL| - Scalable <br> - Better with more complex datatyeps <br> - Robust and reliable <br> - Flexibility on different platforms | - Relatively slow performance <br> - Limitations when implementing complex data types <br> - Installations and configurations can be difficult for new users |
|MongoDB| - Fast Performance from storing data in RAM <br> - Simplicity in its syntax <br> - Scalable both horizontally and vertically <br> - Great documentation | - Does not support transactions which may be problematic in the future <br> - Slow performance without proper indexing <br> - Joined collections are slower than relational DBs <br> - Struggles with very large datasets

Similar to my decision with the front end architecture, I had decided to not use any database structure at the moment and simply use a JSON file to store the stock information. This allows me to test other components of the application very easily (without having to worry about testing database queries). I also only need one relational dataset (stock) and perhaps another one for transactions in the future, so mongoDB doesn't really fit the bill as the dataset can get extremely large. MySQL and PostgreSQL also aren't perfect because they take a lot of time to set up and maintain, so it isn't worth it at this stage of development. In the future, however, I will definitely be implementing a relational database to store the full datasets. 

### CI/CD

When looking into CI/CD tools, I immediately went with GitHub Actions due to the ease of use and no need for setting up. All I had to do was setup a GitHub Actions workflow to implement CI functionalities.

In terms of a CD workflow, I did not really have time to set up a hosting service to deploy my application to. Plus, the setup with NPM is quite simple, so using a deployment platform isn't quite worth the hassle in my opinion.