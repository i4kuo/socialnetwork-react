# Social Network (React JS)

## Website
https://wasabian-social-network.herokuapp.com/

## Overview

Social Network - Fullstack project, using React.js, where user can create an account, informations about theirselves, make friends, send message and chat with other users.

## Details


<p>Working on this project helped me to consolidate my knowledge about databases queries (using PostgreSQL database), server side routes (using Node JS), middleware as "body parser" or "multer", and I learnt a lot about React JS.</p>

<p>This is a 10 days project, focusing on the basis of a social network : creating an account, adding friend, and creating a chat.  I like this project, and I had a pretty good feeling with React JS, that's why I would love to keep working with React JS in the future. I made severals gifs to show you the different steps and parts of this project.</p>



<p>When you get on the website, you can register or sign in.  I worked on alert messages popping up when something goes wrong with your registration. You will find some others on the sign in page.</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040447-2386e632-65c6-11e7-8cc7-b0302a3edc2f.gif"  width="800"/>
</p>


<p>Then you can set your profile, by uploading a profile picture, and writing a bio. I used an Amazon S3 bucket to store all the images online.</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28041263-0ce311d2-65c9-11e7-83a4-318e59e9f7ce.gif"  width="800"/>
</p>


After that step, you can search you future friends! I made the MVP about the search feature, but it's working!
<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040453-23a9af96-65c6-11e7-86e6-8146c3666f60.gif"/>
</p>



This is how the friending features works... This gif is a bit tricky to understand : every time I set a new friendship status, I refresh the pages to see the new status.I invite you to create to account to test it for real !
<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040449-2388ba20-65c6-11e7-8932-290f84cd6eb1.gif"  width="800"/>
</p>





The "friend" page looks like this. Here you can see that you won't need to refresh the page to see the changes. I  cancelled a friend request I made, I accepted an other I received.

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040448-23873466-65c6-11e7-8d8d-81bc3783e7c3.gif"  width="800"/>
</p>



I was really proud to work on the next two features : the online page and the chat room. I used the <b>socket.io</b> technology to listen, on the server side, to every connection or disconnection on the website, and to make a reactive and efficient chat room. This is the online page

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040450-2389698e-65c6-11e7-84d0-8a50d90de01a.gif"  width="800"/>
</p>



 And this is the chat room : on the left, a mobile screen, on the right, a laptop screen, communicating with two different sessions.

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040445-235527f0-65c6-11e7-8294-c077235644fb.gif"  width="800"/>
</p>



Finally I worked to make this website responsive. For example, I spent lot of time working on the menu, to create a nice user experience.

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040451-238ce2f8-65c6-11e7-8251-f2a5cdc6ed35.gif"/>
</p>



Another gif showing how responsive is this website.

<p align="center">
<img src="https://user-images.githubusercontent.com/26822768/28040452-23915522-65c6-11e7-814d-7ee00713d0d9.gif"/>
</p>


