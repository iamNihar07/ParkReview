# [Park-Review](https://parkreview-nihar.herokuapp.com/ "Visit the web app") (MEN Stack) 
#### A full stack Node.js web application for reviewing amusement parks, based on the concept of Yelp.com with RESTful Routing, MongoDB, ExpressJS and CRUD functionality
---
## Features
1. Authentication
   * New User Sign up with username and password
   * User login and logout
2. Authorization
   * Need to be logged in to add a new park or add a new comment
   * Can only edit and delete parks and comments made by yourself, and not others
3. CRUD
   * Create - Ability to create new amusement park, and comments on parks and add to database
   * Read- Lists all the parks in the database
   * Update - Can modify parks and comments which are already posted
   * Delete - Remove parks or comments from the database
4. Google Maps API
   * Takes a location as string value and displays the location on Google Maps with a pin marker
5. Flash messages 
   * Displayed according to user's activities on the web application
6. Responsive web design
   * Using Bootstrap 4
7. Timestamps
   * Uses MomentJS to display timestamps for parks and comments "x minutes ago" or "y days ago"
8. Fuzzy Search
   * Displays the parks that matches the search 
  
  ---
  ## Built with
  * Front-end
    * HTML5
    * CSS3
    * Bootstrap v4.5
    * FontAwesome 4.7
  * Back-end
    * NodeJS
    * Express
    * EJS
    * MongoDB
    * Mongoose
    * PassportJS
    * MomentJS
    * connect-flash
    * body-parser
    * method-override
    * node-geocoder
    * Google Maps API
  * Deployment
    * Heroku
 
   


