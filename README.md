# OldPhoneDeals_TuT10_G4

Overview

You will work in groups of 3 to 5 members (within the same tutorial group) to design and develop a fully functioning eCommerce web application named OldPhoneDeals. This project is your opportunity to demonstrate your ability to collaboratively build a three-tier web application using the MEAN stack (MongoDB, Express, Angular, Node.js).

You will be given two json files, containing some initial eCommerce data and user data. You will need to handle various data query handling at the server-side and present the results on the client-side/web page.
Project Structure

Your app will have two main components:

    User interface and functionality (frontend + backend)
    Admin interface and functionality (dedicated admin page)

Provided Resources

Download and extract: dataset_dev.zip

Download dataset_dev.zip

This contains:

    phonelisting.json: includes phone data (title, brand, image placeholder, stock, price, seller, reviews, etc.)
    userlist.json: includes user data with encrypted password field
    9 images for initial phone listings (e.g., Apple.jpeg for Apple-brand listings)

 

Beside the two json files as the dataset, this zip file contains 9 images to be used for the initial images. Each image will be used to replace each hardcoded “imageurl” in the phone listing dataset depending on the brand, e.g., use “Apple.jpeg” for all initial listing with brand Apple. Hint: you can run a mongodb command to update this field using MongoDB Compass.

The first dataset, “phonelisting.json”, contains a number of phone listing details in a JSON format that includes the reviews for each phone listing. The dataset was created by modifying a dataset provided at Kaggle.
Links to an external site. that consists of hundred thousand reviews of unlocked mobile phones sold at Amazon.com

Links to an external site.. The phone and review items are randomly selected and combined with generated user-related information. This first JSON file contains an array of many phone listing objects that consist of the following information:

    title: the title of the phone listing.
    brand: the brand name of the phone, only 9 brands are available: Samsung, Apple, HTC, Huawei, Nokia, LG, Motorola, Sony, BlackBerry.
    image: the URL to the image of this phone listing (only one).
    stock: the quantity of available item that can be sold.
    seller: the id of the user who created this phone listing.
    price: the price of each item.
    disabled: the presence of the field indicates that the phone listing is disabled and will not be shown.
    reviews: the list of reviews made by users regarding the phone listing, this is represented by an array of review with this structure:
        reviewer: the id of the user who posted the review/comment;
        rating: the rating of the phone or the phone listing.
        comment: the text or review of the phone listing.
        hidden: the presence of the field indicates that the comment is not shown to all users, except to the seller (the owner of the phone listing) and the reviewer (the owner of the comment).

Below are examples of two typical phone listing objects from this dataset:

[
    …
    {
        "title": "Galaxy s III mini SM-G730V Verizon Cell Phone BLUE",
        "brand": "Samsung",
        "image": "imageurl",
        "stock": 9,
        "seller": "5f5237a4c1beb1523fa3db73",
        "price": 56.0,
        "reviews": [
          {
            "reviewer": "5f5237a4c1beb1523fa3db1f",
            "rating": 3,
            "comment": "Got phone yesterday all ... the charger!",
            "hidden": ""
          },
          {
            "reviewer": "5f5237a4c1beb1523fa3db1f",
            "rating": 5,
            "comment": "The charging cable is ... phone was good!"
          }
        ]
    },
    …
    {
        "title": "Sony Ericsson TM506 Unlocked QUAD-Band 3G GSM CellPhone",
        "brand": "Sony",
        "image": "imageurl",
        "stock": 0,
        "seller": "5f5237a4c1beb1523fa3da68",
        "price": 173.0,
        "reviews": [],
        "disabled": ""
    },
…

The first example showed a phone listing with brand “Samsung” that has two reviews with rating 3 (hidden) and rating 5. Please notice that the image property has a hardcoded “imageurl” string for all object in the dataset. You will need to replace it with the correct URL to the image (the details will be described later). The second example illustrates a disabled phone listing indicated by the presence of “disabled” property in the object. Please note that disabled property may exist on phone listing with more than 0 stock and more than 0 review. The disabled phone listing will not be shown to the users except in the Profile page (described later).

The second dataset, userlist.json, contains an array of users for the initial website content. The following is the details about each property of the user objects:

    _id: the id of user which will be used for “seller” or “reviewer” property;
    firstname: the first name of the user.
    lastname: the last name of the user.
    email: the email address of the user.
    password: the password of the user which is hashed using at safe hashing algorithm (e.g. bcrypt). You may freely decide the parameters of your hash, i.e. whether to use salt or how many round of hashing to apply. The password must be a “strong password” by having a minimum of 8 characters including a capital letter, a lower-case letter, a number and a symbol. For demo purposes, please put the same hashed default password for all users by modifying the provided json file. Storing any user password in its plain text from is not acceptable.

Below are examples of two user objects from this dataset:

[
    …
    {
        "_id":{"$oid":"5f5237a4c1beb1523fa3da04"},
        "firstname":"Robert",
        "lastname":"Vasques",
        "email":"robert.vasques@piedpiper.com",
        "password":"<put the encrypted password here>"
    },
    {
        "_id":{"$oid":"5f5237a4c1beb1523fa3da05"},
        "firstname":"Jimmy",
        "lastname":"Sagedahl",
        "email":"jimmy.sagedahl@hooli.com",
        "password":"<put the encrypted password here>"
    },
…

Both datasets (phone listing and user list) have the above properties in our dataset for development and demo purpose, but you may modify or add other properties if it is necessary for you. However, we will provide the dataset for the demo with these formats thus you will need to pre-process the dataset yourself prior to the demo if you change the data structure.
Users vs Admin
User Features

    Search/filter phone listings
    Sorting and Pagination
    Notify customer when an order is marked as delivered
    Wishlist
    View listing details and reviews
    Add items to cart and checkout
    Write/hide/show comments
    Manage profile (edit info, change password, manage listings, view comments)
    Auth system: sign-up, email verification, login, password reset

Admin Features

Accessible via a dedicated admin page:

    View all users and listings
    Search, edit, disable, or delete users/items
    Alert admin when an order is placed
    View hidden fields (e.g. last login, registration date)
    Access logs (e.g. sales history)
    Super admin credentials (hardcoded)

You must separate the admin interface from the user UI for clarity and access control.
Pages and Functional Requirements
Users interface requirements:
1. Main Page

The main page should display key items about the web application that are always shown in the top bar, such as:

    the name of the website, OldPhoneDeals.
    a search bar to find phone (based on the title) with a search button.
    a checkout button.
    a sign-in button/two buttons instead if logged-in (profile and signout buttons)
    a drop-down selection to filter based on the brand (only shown in “Search state”, please refer to the next details).
    a range slider to filter the items based on maximum price (only shown in “Search state”, please refer to the next details).

Below the top bar, the page consists of a website content with three states:

    “Home” state, where the user has not searched anything or select any item. This state shows two sections:
        “Sold out soon”: five phone listings (image and price) that have the least quantity available (more than 0 quantity and not disabled).
        “Best sellers”: five phone listings (image and rating) that have the highest average rating (not disabled and at least two ratings given). Please note that the rating calculation still considers the hidden comments/ratings.
    “Search” state, where the users search something. This state shows all of items with titles that match the search word (case insensitive and partial).
    “Item” state, where the users click/select of the phone listing. The page shows the details of the selected phone listing that includes:
        The title of the selected phone.
        The brand of the selected phone.
        The image of the selected phone.
        The available stock of the selected phone.
        The seller's full name (concatenation of first name and last name).
        The price of the selected phone.
        The first 3 reviews with a button to show more (clicking it will show the next three. Each review consists of:
            Full name of reviewer
            Rating
            Comment which is limited to 200 characters
            Show more button for the comment if the comment is more than 200 characters, to show the rest of the comment.
            Hide/show button that will be only shown for the author of the comment (reviewer) and also the seller of the phone listing. If the comment is hidden, it will be presented in a different colour than the normal comment (e.g., using grey while the normal is black).
        A button to add the item to cart. Clicking add to cart button will pop-up/show a text field to ask for the quantity.
        A button to add the item to the wishlist.
        A box showing the current added quantity (show 0 if the item has not been added to cart). 
        A text input or textfield to accept comments from the users, rating selection, and a button to post the comment. When the comment is submitted, it will be stored in the database and it will be shown to other users.

The top bar will be only shown in this Main page and will be hidden when other pages are active.
2. Auth Pages

    Sign-up: Validate inputs, send email verification
    Sing-in: Login after verification
    Reset password via email

The user will be redirected to this page if the user tries to add an item to the cart without logging in first or if the user clicks the “sign in” button on the top bar in the Main Page. This page provides two options: Sign-up and Login.

All users must sign-up/sign-in before they can add any item to the cart and go to the Checkout Page. To create an account, the user must provide a first name, last name, email address (as username) and password. You need to do appropriate data validation to ensure valid data is entered before creating an account. The sign-up and login functions must be secure in terms of sign-up and login. Password hashing must be implemented so passwords must not be stored as plain texts in the database. Once all data is entered correctly, an account should be created and maintained in the database. Further, you need to implement email verification for the sign-up process to make sure that the email provided for sign-up is a valid email. Before the users validate their email address by clicking a certain link to activate their account, the users cannot sign-in using the provided email and password yet.

Once an account is created/logged in successfully, a user should be able to see the previously shown page if the user previously wants to add an item to the cart. Users should also be able to logout from your web application by clicking Sign-out button on the top bar of the Main Page. There should be a confirmation box before signing the user out. After the user is signed out, the user should see the Main Page with “Home” state active.

In the sign-in page, there is also a link to the reset password page. In the reset password page, the users are required to provide a valid/registered email address. If the email address provided is valid (in the database), the web application will send a link to reset the password via email. Upon clicking this link, it will redirect to the web application page where the user needs to provide a new password twice. The new password will be saved and the user can only sign-in using this password. 

 
3. Checkout Page

This page will be shown when the user clicks the checkout button on the top bar of the Main Page. This page will show these details:

    A back button to go back to the previous shown page.
    All of added items in the cart with these information
        The title of the phone listing.
        The price of each item.
        The quantity selected.
    A button and textbox to modify the quantity of the item (selecting 0 will remove the item.
    A button to remove an item.
    A text that shows the total price of selected items.
    A button to confirm the transaction.

After clicking the transaction confirmation button, you can assume that the items have been paid and they have been delivered. The quantity of the items now must reflect the actual quantity after this transaction. After completing the transaction, the user will be redirected to the Main Page with “Home” state active.
4 Profile Page

This page will be shown when the user has logged in and click the “profile” button in the top bar of the Main Page. This page has four tabs/modes:

    Edit profile: the page shows editable textboxes for first name, last name, email that are pre-filled with the current value. The page includes a button “Update profile” to update the data in the database. When the button is clicked, the user needs to fill in the correct password first.
    Change password: the page shows two textboxes where the first asking the current password and the second asking the new password. The page also includes a button to confirm this process. The web application will send an email to notify the user that the password has been changed.
    Manage listings: the page has a button to add a new listing that requires all details (e.g. title, price, etc.). This page also shows the list of phone listings created/associated to this user. The user should be able to enable/disable each listing and remove the listing item.
    View comments: the page shows a list of comments for each phone listing that is owned by the user. The user can only read the comments, but there is no delete button provided. All hidden comments will also be shown in this page with button(s) to hide/show the comments.

This page also has a Sign-out button regardless the tab/mode selected. After signing out, the user will be redirected to the Main Page with “Home” state active.
Admin interface requirements:
1. Admin Authentication

    Only accessible via a separate route (e.g., /admin)
    Require login using a hardcoded admin email and password (stored securely using password hashing)
    Admin session should expire after a period of inactivity

2. User Management

    View a list of all registered users with:
        Full name
        Email
        Last login date/time
    Search users by name or email
    Edit user details (name and email)
    Disable or delete user accounts
    View each user’s listings and reviews

3. Listing Management

    View all phone listings including disabled ones
    Search listings by title or brand
    Edit listing details (title, price, stock, etc.)
    Disable or delete listings
    View associated reviews and seller info

4. Review & Commnet Moderation

    View all reviews, including hidden comments
    Search comments by user, content, or listing
    Toggle visibility of any review (override user/seller settings)

5. Sales and Activity Logs

    View a log of all confirmed transactions with:
        Timestamp
        Buyer name
        Items purchased and quantities
        Total amount
    View notifications or a log when an order is placed
    Export sales history (CSV or JSON format optional)

6. Security and Integrity

    Ensure all admin operations are logged for audit purposes
    Prevent admins from editing/deleting the super admin account
    Confirm actions like deletion or disabling with pop-up dialogs

7. Admin UI Features

    Responsive, clean, and intuitive design
    Allow pagination, sorting, and filtering in all tables/lists
    Async operations with success/error messages

Design and Implementation Requirements

    SPA: Pages like home/search/item should load within the same view
    Use Node.js (backend) and MongoDB for the database
    Password hashing (bcrypt) and email validation
    Design your layout/UI (use MVC or MVVM pattern)
    All server requests must be asynchronous
    Avoid hardcoded logic that only works with the provided dataset

Your application should operate on a single page (following SPA principles) for the specific page described above (e.g. searching item will not reopen the page), with all communications between client and server need to be asynchronous. For simplicity, it is allowed to implement each page described in the previous part in a separate page.

You should design your own layout. You must use the MVC pattern or similar patterns (e.g., MVVM) to structure your application and interaction among components. The design and UI interfaces should be user-friendly and intuitive.

You should use JavaScript to implement both front and back end of the application. The back-end application should use Node.js framework. The back-end storage system must be MongoDB. You can use other popular JavaScript libraries not covered in this course.

Your application should show good performance when running any functionality. You should consider techniques for optimising application performance including communications among tiers and database design and implementation. Your design and implementation should not be specific for the provided dataset. You should consider a dynamic design and implementation that work properly and scale with any dataset.

You need to make sure that your web application follows the requirements clarified or specified in the Ed discussion.
GitHub Collaboration

To facilitate effective team collaboration and version control, your group must use GitHub within the USyd GitHub organization.

    Ensure your USyd GitHub account is activated. If not, activate it before starting the project.
    You will receive a GitHub invitation to join the project USyd GitHub organisation.
    Use your USyd email address for all commits to ensure proper contribution tracking.
    Create a dedicated repository for your project under the USYD GitHub organisation.
    All group members must:
        Regularly commit and push code changes throughout the development process.
        Avoid leaving all uploads to the end—your contributions will be assessed based on commit history.
    Each repository must include a clearly written README.md file containing:
        Setup instructions (e.g. installing dependencies, importing the dataset)
        Instructions for running the application locally

We have created an organisation on Sydney Github, which you can access via this link. You will also receive an email invitation to join this organisation. Github is a powerful and widely used tool for team collaboration, version control, and tracking code revisions.

All contributions will be assessed directly through your Github activity, so it is essential that you and your group members use the repository from the the beginning of the project - not just towards the deadline.

To ensure your contributions are tracked accurately:

    You must use your university email address when committing changes. Commits made using a personal GitHub account will not be recognised.
    You must use the repository created under the provided GitHub organization.

Failure to follow these instructions may result in your contribution being marked as 0%.

The project is a great opportunity to build familiarity with GitHub, as it is a standard tool used across the software development industry.

Each group must:

    Create a new repository within the organisation for your project.
    Use this repository exclusively to maintain your codebase.
    Ensure that only code you have personally written is committed under your name. It is unacceptable for a single team member to upload all code on behalf of the group.

Your repository must include a comprehensive README.md file with:

    Setup instructions (e.g. how to install dependencies and import the dataset)
    Steps to run the application
    Refer to this template 

    Links to an external site. as a good example of how your README should be structured.

For those new to GitHub, we recommend reviewing this guide

Links to an external site. to get started with the basics.
Application Demo

    A new dataset will be used during demo
    All team members must present part of the app
    Be ready to answer questions about the design and your code

 

Each group must demo their application during week 12. Note the demo will use another dataset that conforms to structure of the dataset included in this assignment. A demo set will be provided and all team members must prepare and participate in the demo. Each team member will be required to demo one part of the application, and they should be able to answer any question about the application design and implementation. In preparation for your demo:

    Expect to discuss edge cases.
    Adhere to good user design and user experience principles.
    Each member should have complete understanding of how the overall system works. i.e. someone worked delicately on the frontend must also be able to answer database questions. It is highly recommended to follow the bus factor.
    Following good software design principles is recommended.
    If you are using external libraries not discussed in the tutorials, discuss it with your tutor. Your tutor maybe unfamiliar with the library you're using. Expect to answer questions about the usage of the library in your assignment. e.g. reasons for using the library and alternative solutions.

Group Canvas Registration
Once you form your group, register the group members under one of the available groups under Canvas > People >  Project Groups page 
Group Member Contribution

If members of your group do not contribute sufficiently you should alert your tutor as soon as possible. The contributions of each group member will be checked from the project's GitHub repository. Failure to join and use the provided GitHub organization account (using your uni email) might result in 0% contribution. All group members must contribute effectively and equally to the project. The contributions will be evident by the GitHub repo. and logs related to each project.  The course instructor has the discretion to scale the group’s mark for each member as follows:

Level of Contribution
	

Proportion of final grade received

No contribution
	

0%

poor/partial contribution 
	

1% - 49%

Partial but not enough contribution
	

50%-99%

Major/full contribution
	

100%
Deliverables and Submission Guideline

Each team must submit their project through Canvas:

    Submit a zip file with all your project and JavaScript files and the group cover sheet 

    Download group cover sheet signed by all members.
        Please include all files necessary to run your project, with the below exception
        Do not include the Javascript files from "node_modules" or other dependencies/libraries.

General Marking Guide 
Application Design and Implementation

    Functional Requirements - 75% (requirements implemented correctly and works with different test cases as per the requirements described above)
        General Requirements (2%)
        Main page (30%)
        Sign-in / Sign-up page and feature (19%)
        Checkout page (Embedded in Main page section)
        User page (24%)
    Website design - 15%  
        Design and Implementation Requirements (8%)
        SPA principle and MVC pattern (4%)
        System's performance & security (3%)
    Group demonstration - 10%
        Full participation (2%)
        Complete understanding of system (2%)
        Quality of demo (2%)
        Answering follow-up questions (2%)
        Overall quality  (2%)

General guide for marks:

    Full marks: All functions are fully implemented AND work correctly.
    Partial marks: The function is only partially implemented OR errors may occur after repeated attempts.
    No marks: The function does not work OR is not implemented at all.

