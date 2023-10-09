
<p align="center">
<a href="https://www.electronjs.org/"  target="blank"><img  src="https://www.electronjs.org/assets/img/logo.svg"  width="100"  alt="Sequelize Logo" /></a>
<a href="https://ant.design/"  target="blank"><img  src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"  width="100"  alt="Antd Logo" /></a>
<a href="https://reactjs.org/"  target="blank"><img  src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"  width="100"  alt="React Logo" /></a>
<a href="https://www.postgresql.org"  target="blank"><img  src="https://www.postgresql.org/media/img/about/press/elephant.png"  width="100"  alt="PostgreSql Logo" /></a>

  
[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/badge/node-18.18.0-orange" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/badge/npm-9.8.1-brightgreen" alt="Npm Version" /></a>
<a href="" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="MIT" /></a>
<a href="https://www.npmjs.com/~pg" target="_blank"><img src="https://img.shields.io/badge/postgresql-16-orange" alt="Postgresql Version" /></a>
<a href="https://www.npmjs.com/~pg" target="_blank"><img src="https://img.shields.io/badge/React-18.2.0-brightgreen" alt="Npm Version" /></a>
<a href="https://www.npmjs.com/~pg" target="_blank"><img src="https://img.shields.io/badge/Antd-5.9.4-orange" alt="Npm Version" /></a>
</p>

The software runs on multiple platforms (windows, macos, linux). with technologies and frameworks such as: electron, react, postgresql, antdesign.

![homepage](./assets/homepage.png)

provides features such as:
* Documents:  Get, Create,  Update, Report.
* Reader: Get, Create,  Update.
* Borrow: Get, Create,  Update, Report.
* Return: Get, Create,  Update, Report.
* Reminder: Get, Create,  Update, Report.
* Penalty: Get, Create,  Update, Report.
* Publisher: Get, Create.
* Author: Get, Create.
* staff: add. delete.

Basically sending and receiving data is handled through elecronjs's `Inter-Process Communication` providing two threads. 1 thread is for application interaction with the database, 1 thread is for rendering and displaying on the UI. diagram as follows:
```
IPC                 --->            IPC
main process        <---            renderer process
```
We put react into electron to better implement components.

### Steps to run and build the source code.
1. Prepare and install the necessary software:
    * Node.js: Download and install Node.js from https://nodejs.org/en, version >= 18.18.0.

    * PostgreSQL Database: Download and install PostgreSQL Database from https://www.postgresql.org/download, version >= 16. You can also set it up using Docker instead of installing it directly on your devices. Please remember to note the `username`, `password`, `database name` (create a database named is `library`), and `port` after setting up the database.
    * Git: Install Git from https://git-scm.com/downloads to clone the repository. Alternatively, you can download the repository directly (Code -> Download Zip).
2. Running the Source Code.
    * After you have prepared and installed the required software as mentioned above, the next step is to open a terminal (command line) in the `library-management` folder (the repository you've pulled or extracted). Enter the following commands:
    ```
    node -v 
    npm -v
    ```
    * Use these commands to check if Node.js and npm are installed and to verify their versions. Once you've confirmed that both commands work, proceed with:
    ```
    npm ci
    ```
   *  After the npm ci command finishes installing, you need to change the urlConnection in this path: ~./library-management/src/main/databases/db.ts.
Currently, it is set to:
```
const urlConnection = 'postgres://postgres:123456@localhost:5433/library';
```
You should change it (`username`, `password`, `port`, `databaseName`) based on your database setup. The common format will be:
```
postgres://user:pass@example.com:5432/databasename
```

* Check if ts-node is installed using the following command:
```
ts-node -v
```
* If it's not installed, you can install it using:
```
npm i ts-node -g
```
* Next, run the application in development mode with the following command:
```
npm start
```
* Open another command line window and run the following commands to import seeds and some necessary data for the application to work:

```
npm run seed && npm run mock
```
At this point, you should be able to interact with the application.

If you want to build the application into an executable file for various environments such as `Linux`, `macOS`, or `Windows`, you can use the following command (for `Linux` as an example):
```
 electron-builder --linux
```
You can refer to the documentation here for more information: https://www.electron.build/cli.html

### Additional Information
1. Database Diagram:
![diagram](./assets/diagram.png)
2. Currently, there are basic user permissions for ADMIN and STAFF regarding 2 tabs: "Document Requests" and "Employee Statistics."

If you have any issues or questions, you can create Merge Requests (MR) or report bugs here: https://github.com/t-pk/library-management/issues.

Thank you!.