---
sidebar_position: 1
---

# Quick Start Guide

Discover **how to set up Lists in 5 minutes**.

## Getting Started

Get started by **creating a new account and organisation**.

### Account

This is the information you will use to log into the Listed manager.

### Organisation Structure

Organisations contain admin users - like you, end users, sites and lists.

If you don't already have an organisation, you'll need to create one once you have an account.
If you're already part of an organisation, ask the owner for an invitation.

### What you'll need to complete this guide

- A Listed account.
- A Listed organisation and API token.
- A JS based project such as React, Gatsby, Next JS to import the SDK.

## Generate a new site

Generate a new Listed demo site within your Organisation Dashboard.

[INSERT SCREENS]

## Create a new Demo list

Open your new site and create a new List. 
We'll call this list "Weekly Groceries".

## Install the JS SDK

Yarn

```yarn add listed```

NPM

```npm install listed```

[INSERT SCREENS]

## Create env variables in your project

In your JS project, create a new `LISTED_ADMIN_API_KEY` variable.

Open your Organisations Settings screen to generate an API token.

[INSERT SCREENS]

## Create Server Side function

Use the server methods to get user tokens for authenticated users.

**You will need to check your customer is authenticated with your application**

Example Function:

```
/api/get-listed-user.js

import { getUser } from 'listed/server';

export default function handler(request, response) {
    const { customerEmail, applicationToken } = request.body;

   // !Check the customer is authenticated with your platform!
   if(!yourAuthCheckFunction(customerEmail, applicationToken)) {
      response.status(401).json({
        message: "Not authenticated",
      });
   }

   const { status, token, error } = getUserToken(
        customerEmail, 
        process.env.LISTED_ADMIN_API_KEY
   );
   
   if(error) {
      response.status(error.statusCode).json({
        message: error.message,
      });
   }
   
  response.status(200).json({
    userStatus: status,
    token: token,
  });
}
```

## Fetch your Customer token

```
function getListedUser(userToken, customerEmail) {
    const res = await fetch('/api/get-listed-user', {
        method: 'POST',
        headers: {
          'X-User-Token': userToken,
        },
        body: JSON.stringify({
            customerEmail: customerEmail
        })
      })
      .then(res => res.json())
      .then(res => console.log(res));
      
    return res;
}
```

## Initialise a new Listed client.

```
const { email, token } = authenticatedUser; // Your application's user.

import Client from 'listed/client'

const getListedUser('', '')

cost ListManager = new Client(email, token);

ListManager->addToList(
    'wishlist', 
    'product', 
    [{
        title: 'Product 1',
        handle: 'product_1',
        sku: 'prod_1'
    }]
);
```

##  Get a list.

```
const wishList = listed.getList('wishlist');

// Present a list.

wishList.forEach((listItem) => listItem);

// { "title": "Product 1", "handle": "product-1", "sku": "prod-1" }
```

## Add to a list.

```
const res = listed.addItem(
    'wishlist',
    TYPE_PRODUCT,
    [
        { "title": "Product 2", "handle": "product-2", "sku": "prod-2" }
    ]
);

// { "status": 200, "succeeded": [{ "title": "Product 2", "handle": "product-2", "sku": "prod-2" }], failed: [], errors: []}

// Adding the same item again.

const res = listed.addItem(
    'wishlist',
    TYPE_PRODUCT,
    [
        { "title": "Product 2", "handle": "product-2", "sku": "prod-2" }
    ]
);

// { "status": 422, "succeeded": [], "failed": [{ "title": "Product 2", "handle": "product-2", "sku": "prod-2" }], errors: [ 'Item is already in this list' ]}
```

## Clear a list

```
const res = listed.clear('wishlist');
// true

// Delete a list

const res = listed.delete('wishlist');
// true
```
