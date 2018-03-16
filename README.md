# Auth0 Exercise Demo Application

## Overview

This sample application demonstrates the following 
1. Provide a solution that allows a customer to define limited access to their API
2. Centralised Login usage
3. Refresh Token usage
4. Calling external APIs using same Resource API and different scopes

This application demonstrates the usage of a single Resource Server with namespaced scoping representing multiple APIs. This sample consists of:

- 3 Node.js APIs: `create`, `read` and `delete`;
- 1 Resource Server representing the 3 APIs;
- 2 Namespaced scopes: `read:customers`, `create:calendar` and `delete:customers`;
- The Code Authorization Grant flow to obtain an `access_token` that works for the APIs.

## Implementation

This folder includes the application implementation using Node.js and the [Express](http://expressjs.com/) framework.

## Prerequisites

* Auth0 account
* [Node Package Manager (NPM)](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/)

## Set the configuration values

Rename the `.env.example` file in the root folder to `.env` Once you have renamed the file you should set the following values in your new `.env` file:

* `{AUTH0_DOMAIN}`: Set this to the value of your Auth0 Domain. You can retrieve it from the *Settings* of your Client at the [Auth0 Dashboard](https://manage.auth0.com/#/clients).
* `{API_IDENTIFIER}`: Set this to the value for your Auth0 API audience. You can retrieve it from the *Settings* of your Client at the [Auth0 Dashboard](https://manage.auth0.com/#/api).
* `{AUTH0_CLIENT_IDENTIFIER}`: Set this to the value of your API Client Secret. You can retrieve it from the *Settings* of your API at the [Auth0 Dashboard](https://manage.auth0.com/#/clients).
* `{AUTH0_CLIENT_SECRET}`: Set this to the value of your API Client Secret. You can retrieve it from the *Settings* of your API at the [Auth0 Dashboard](https://manage.auth0.com/#/clients).

## Setup

### In Auth0 Dashboard

#### Create API

Follow steps from the [README.md](https://github.com/sunshiva/Auth0-Exercise-API/master/README.md) doc for the API implementation. You will need to configure the API as per the doc


Create a regular web application Client.

Under settings ensure you have (replace hostname:port for your environment):

#### Client-Type: Regular Web Application 

Allowed Callback URLs:
 - http://localhost:3000/callback

Allowed Web Origins:
 - http://localhost:3000

Allowed Logout URLs
 - http://localhost:3000

Under tenant settings -> advanced -> Allowed Logout URLs
 - http://localhost:3000

Under Advanced Settings -> Oauth, switch ON the OIDC Conformant toggle.

#### Enable Cross Origin Authentication

In order to be able to log-in with user and password you need to make sure you take into account the details explained in the [Cross Origin Authentication documentation](https://auth0.com/docs/cross-origin-authentication). 

#### Create test user accounts

#### Authorize users with roles and permissions

Under [Extensions](https://manage.auth0.com/#/extensions) click on the Authorization Extension. If its not installed, you may have to [install](https://auth0.com/docs/extensions/authorization-extension/v2) it. 

Create the following permissions and assign it to the application created earlier
* read:timesheets
* create:timesheets
* Delete:timesheets

Create the following Roles for users and asociate it to the application created earlier.
* Read Customers (assign the permission 'read:customers' created above )
* Create Customers (assign the permission 'create:customers' created above )
* Delete Customers (assign the permission 'delete:customers' created above )

Associate the Auth0 user accounts with the above role(s).

## Deploy & Run

To test this application, you will need to also configure and run the corresponding API. Please see the [README.md](https://github.com/sunshiva/Auth0-Exercise-API/edit/master/README.md) for the API for instructions on how to configure and run the CRUD API.

Once the API is running, you can open a terminal window to the root folder in which this README.md is (``) and install the required dependencies for the application by running:

```text
npm i
```

Once the packages are installed, you can then run the Node app:

```text
npm start
```

The application will be served at `http://localhost:3000`.

Browse to http://localhost:3000/customers and follow the use cases to read/add/delete customer data

## Test

We assume that you already have an Auth0 account and you have configured your API in the dashboard.

You can test the API in conjunction with this application client. Alternatively you can test it using a tool with which you can make HTTP requests (such as Postman or CURL) but following the steps below.

### Get an Access Token

To ask Auth0 for tokens for any of your authorized client applications, perform a POST operation to the `https://{AUTH0_DOMAIN/oauth/token` endpoint with a payload in the following format:

```json
{
  "audience": "{API_IDENTIFIER}",
  "grant_type": "client_credentials",
  "client_id": "{AUTH0_CLIENT_IDENTIFIER}",
  "client_secret": "{AUTH0_CLIENT_SECRET}"
}
```

```
curl --request POST --url 'https://{AUTH0_DOMAIN}/oauth/token' --header 'content-type: application/json' --data '{"grant_type":"client_credentials","client_id": "{AUTH0_CLIENT_IDENTIFIER}","client_secret": "{AUTH0_CLIENT_SECRET}", "audience": "{API_IDENTIFIER}"}'
 ```
 
The response payload will be in the following format:

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiKLPhbGciOiJSUzI1NiIsImtpZCI6Ik1qUXlOVFEyTURoR...",
  "token_type": "Bearer"
}
```

Record the value of access_token from above

### Invoke the API

To invoke the API start the node process and make a `POST` request to `http://localhost:4300/customers/create`.

You should add an `Authorization` header with the value `Bearer {access_token}`

The body payload should be in the following format:

```json
{
	"name": "Test User",
	"address": "10 Test St, Test",
	"phone": "0987654321",
	"email": "test@test.com"
}
```

```
curl -H "authorization: bearer {access_token}" -d '{"name": "Test User", "address": "10 Test St, Test", "phone": "0987654321", "email": "test@test.com"}' http://localhost:4300/customers/create
```

You should get a response like the following:

```json
{
  "message": "Record successfully created"
}
```

